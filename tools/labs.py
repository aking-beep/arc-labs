#!/usr/bin/env python3
"""labs - the ARC Labs pipeline tool.

Records are markdown files with YAML front-matter living under incubator/<stage-dir>/.
The schema is tools/record_schema.yaml. See docs/GRADUATION_CRITERIA.md.

    labs validate              full repository check (this is what CI runs)
    labs status                the pipeline board
    labs new TITLE --domain D  open a new record in incubator/ideas/
    labs decide ID --decision  record a decision at a review date
    labs move ID --to STAGE    move a record between stages (git mv)
    labs portfolio             regenerate portfolio/experiments.yaml

Requires: PyYAML.
"""

from __future__ import annotations

import argparse
import datetime as dt
import pathlib
import re
import subprocess
import sys
import textwrap
from dataclasses import dataclass, field

try:
    import yaml
except ImportError:  # pragma: no cover
    sys.exit("labs: PyYAML is required (pip install pyyaml)")

ROOT = pathlib.Path(__file__).resolve().parent.parent
SCHEMA_PATH = ROOT / "tools" / "record_schema.yaml"
INCUBATOR = ROOT / "incubator"
EXPERIMENTS_INDEX = ROOT / "portfolio" / "experiments.yaml"
PRODUCTS_INDEX = ROOT / "portfolio" / "products.yaml"
TEMPLATE = ROOT / "templates" / "experiment" / "RECORD.md"

TODAY = dt.date.today()
FRONT_MATTER = re.compile(r"\A---\n(.*?)\n---\n(.*)\Z", re.DOTALL)

RESET, BOLD, RED, YELLOW, GREEN, DIM = (
    "\033[0m", "\033[1m", "\033[31m", "\033[33m", "\033[32m", "\033[2m"
)
if not sys.stdout.isatty():
    RESET = BOLD = RED = YELLOW = GREEN = DIM = ""


# --------------------------------------------------------------------------- model

@dataclass
class Record:
    path: pathlib.Path
    meta: dict
    body: str
    front_lines: list[str] = field(default_factory=list)

    @property
    def id(self) -> str:
        return str(self.meta.get("id", self.path.stem))

    @property
    def stage(self) -> str:
        return str(self.meta.get("stage", "?"))

    @property
    def decision(self) -> str:
        return str(self.meta.get("decision", "?"))

    @property
    def rel(self) -> str:
        return str(self.path.relative_to(ROOT))


@dataclass
class Report:
    errors: list[str] = field(default_factory=list)
    warnings: list[str] = field(default_factory=list)

    def error(self, where: str, msg: str) -> None:
        self.errors.append(f"{where}: {msg}")

    def warn(self, where: str, msg: str) -> None:
        self.warnings.append(f"{where}: {msg}")


def load_schema() -> dict:
    with SCHEMA_PATH.open() as fh:
        return yaml.safe_load(fh)


def parse_record(path: pathlib.Path) -> Record:
    text = path.read_text()
    match = FRONT_MATTER.match(text)
    if not match:
        raise ValueError("missing YAML front-matter delimited by --- lines")
    meta = yaml.safe_load(match.group(1)) or {}
    if not isinstance(meta, dict):
        raise ValueError("front-matter must be a YAML mapping")
    return Record(
        path=path, meta=meta, body=match.group(2), front_lines=match.group(1).split("\n")
    )


def load_records(report: Report | None = None) -> list[Record]:
    records: list[Record] = []
    for path in sorted(INCUBATOR.glob("*/*.md")):
        if path.name == "README.md":
            continue
        try:
            records.append(parse_record(path))
        except Exception as exc:  # noqa: BLE001 - surfaced as a validation error
            if report is None:
                raise
            report.error(str(path.relative_to(ROOT)), str(exc))
    return records


def as_date(value) -> dt.date | None:
    if isinstance(value, dt.datetime):
        return value.date()
    if isinstance(value, dt.date):
        return value
    if isinstance(value, str):
        try:
            return dt.date.fromisoformat(value.strip())
        except ValueError:
            return None
    return None


def words(value) -> int:
    return len(str(value).split()) if value is not None else 0


# ----------------------------------------------------------------------- validation

def required_now(rule, rec: Record, schema: dict) -> bool:
    """Resolve a field's conditional `required` rule against one record."""
    stage, decision = rec.stage, rec.decision
    terminal = schema["terminal_stages"]
    return {
        "always": True,
        "never": False,
        "non_terminal": stage not in terminal,
        "in_flight": stage in schema["in_flight_stages"],
        "kill_condition_stages": stage in schema["kill_condition_stages"],
        "decided": decision != "pending",
        "killed": decision == "kill",
        "graduated": decision == "graduate",
    }.get(rule, False)


def check_fields(rec: Record, schema: dict, report: Report) -> None:
    where = rec.rel
    known = set(schema["fields"])
    for key in rec.meta:
        if key not in known:
            report.warn(where, f"unknown front-matter field {key!r}")

    for name, spec in schema["fields"].items():
        value = rec.meta.get(name)
        missing = value is None or (isinstance(value, (str, list)) and len(value) == 0)
        if missing:
            if required_now(spec["required"], rec, schema):
                report.error(where, f"missing required field {name!r}")
            continue

        kind = spec["type"]
        if kind == "date" and as_date(value) is None:
            report.error(where, f"{name!r} must be an ISO date (YYYY-MM-DD), got {value!r}")
        elif kind == "int" and not isinstance(value, int):
            report.error(where, f"{name!r} must be an integer, got {value!r}")
        elif kind == "bool" and not isinstance(value, bool):
            report.error(where, f"{name!r} must be true or false, got {value!r}")
        elif kind == "list" and not isinstance(value, list):
            report.error(where, f"{name!r} must be a list, got {type(value).__name__}")
        elif kind == "str" and not isinstance(value, str):
            report.error(where, f"{name!r} must be a string, got {type(value).__name__}")

        if "enum" in spec:
            allowed = schema[spec["enum"]]
            allowed = list(allowed) if not isinstance(allowed, dict) else list(allowed)
            if value not in allowed:
                report.error(where, f"{name!r} must be one of {allowed}, got {value!r}")

        if "min_words" in spec and words(value) < spec["min_words"]:
            report.error(
                where,
                f"{name!r} needs at least {spec['min_words']} words to be a real answer "
                f"(got {words(value)})",
            )


def check_identity(rec: Record, schema: dict, report: Report) -> None:
    where = rec.rel
    if not re.match(schema["id_pattern"], rec.id):
        report.error(where, f"id {rec.id!r} does not match {schema['id_pattern']}")
    if rec.path.stem != rec.id:
        report.error(where, f"filename must equal id ({rec.id}.md)")

    expected = schema["stages"].get(rec.stage)
    if expected:
        actual = str(rec.path.parent.relative_to(ROOT))
        if actual != expected:
            report.error(
                where,
                f"stage {rec.stage!r} must live in {expected}/, found in {actual}/ "
                f"(use `labs move`)",
            )


def check_decision(rec: Record, schema: dict, report: Report) -> None:
    where = rec.rel
    allowed_stages = schema["decision_requires_stage"].get(rec.decision)
    if allowed_stages and rec.stage not in allowed_stages:
        report.error(
            where,
            f"decision {rec.decision!r} requires stage in {allowed_stages}, got {rec.stage!r}",
        )
    if rec.stage in schema["terminal_stages"] and rec.decision == "pending":
        report.error(where, f"terminal stage {rec.stage!r} cannot have decision 'pending'")

    iterations = rec.meta.get("iterations", 0)
    if isinstance(iterations, int) and iterations >= schema["limits"]["max_iterations"]:
        report.warn(
            where,
            f"{iterations} iterations: hypothesis is not testable at this scale — "
            f"kill it or rewrite it under a new id",
        )


def check_evidence(rec: Record, schema: dict, report: Report) -> None:
    where = rec.rel
    evidence = rec.meta.get("evidence")
    if not isinstance(evidence, list) or not evidence:
        return

    seen_hard = False
    for i, signal in enumerate(evidence):
        label = f"evidence[{i}]"
        if not isinstance(signal, dict):
            report.error(where, f"{label} must be a mapping with signal/type/target")
            continue
        for key in ("signal", "type", "target"):
            if not signal.get(key):
                report.error(where, f"{label} is missing {key!r}")
        kind = signal.get("type")
        if kind and kind not in schema["evidence_types"]:
            report.error(where, f"{label} type {kind!r} not in {schema['evidence_types']}")
        if kind in schema["hard_evidence_types"]:
            seen_hard = True
        if rec.decision != "pending" and not signal.get("actual"):
            report.error(
                where,
                f"{label} has no 'actual' but the record is decided — record the result, "
                f'even if it is "no data"',
            )

    if not seen_hard and rec.stage != "idea":
        report.error(
            where,
            "needs at least one evidence signal of type "
            f"{schema['hard_evidence_types']} — interest is not demand",
        )


def check_dates(rec: Record, schema: dict, report: Report) -> None:
    where = rec.rel
    opened = as_date(rec.meta.get("opened"))
    review_by = as_date(rec.meta.get("review_by"))
    decided_on = as_date(rec.meta.get("decided_on"))
    terminal = rec.stage in schema["terminal_stages"]

    if opened and review_by and review_by < opened:
        report.error(where, f"review_by ({review_by}) is before opened ({opened})")
    if opened and decided_on and decided_on < opened:
        report.error(where, f"decided_on ({decided_on}) is before opened ({opened})")

    # The harshest rule in the repository, and the one that stops the graveyard.
    if not terminal and rec.decision == "pending" and review_by and review_by <= TODAY:
        overdue = (TODAY - review_by).days
        report.error(
            where,
            f"review_by was {review_by} ({overdue}d ago) and decision is still 'pending' — "
            f"decide today: kill, iterate, incubate, or graduate",
        )

    if rec.stage == "idea" and opened:
        age = (TODAY - opened).days
        shelf = schema["limits"]["idea_shelf_life_days"]
        if age > shelf:
            report.warn(
                where,
                f"idea has sat for {age}d (shelf life {shelf}d) — promote it or kill it, "
                f"ideas do not improve by waiting",
            )


def check_links(rec: Record, products: dict, report: Report) -> None:
    where = rec.rel
    for rel in rec.meta.get("work") or []:
        if not (ROOT / str(rel)).exists():
            report.error(where, f"work path {rel!r} does not exist")

    repo = rec.meta.get("graduated_to")
    if repo:
        known = {p.get("repo") for p in products.get("products", []) or []}
        if repo not in known:
            report.error(
                where,
                f"graduated_to {repo!r} is not listed in portfolio/products.yaml — "
                f"graduation is not complete until the product is registered",
            )


def check_owner_load(records: list[Record], schema: dict, report: Report) -> None:
    terminal = set(schema["terminal_stages"])
    cap = schema["limits"]["max_in_flight_per_owner"]
    load: dict[str, list[str]] = {}
    for rec in records:
        if rec.stage in terminal or rec.stage == "idea":
            continue
        load.setdefault(str(rec.meta.get("owner", "?")), []).append(rec.id)
    for owner, ids in sorted(load.items()):
        if len(ids) > cap:
            report.warn(
                "incubator",
                f"{owner} has {len(ids)} in-flight records (cap {cap}): "
                f"{', '.join(sorted(ids))} — all of them will stall",
            )


def check_uniqueness(records: list[Record], report: Report) -> None:
    seen: dict[str, str] = {}
    for rec in records:
        if rec.id in seen:
            report.error(rec.rel, f"duplicate id {rec.id!r}, also in {seen[rec.id]}")
        else:
            seen[rec.id] = rec.rel


def check_index(records: list[Record], report: Report) -> None:
    expected = build_index(records)
    if not EXPERIMENTS_INDEX.exists():
        report.error("portfolio/experiments.yaml", "missing — run `labs portfolio`")
        return
    with EXPERIMENTS_INDEX.open() as fh:
        actual = yaml.safe_load(fh)
    if actual != expected:
        report.error(
            "portfolio/experiments.yaml",
            "out of sync with incubator records — run `labs portfolio` and commit",
        )


def check_products(products: dict, records: list[Record], report: Report) -> None:
    where = "portfolio/products.yaml"
    entries = products.get("products") or []
    by_id = {r.id: r for r in records}
    for entry in entries:
        for key in ("name", "repo", "relationship", "status"):
            if not entry.get(key):
                report.error(where, f"product {entry.get('name', '?')!r} is missing {key!r}")
        origin = entry.get("labs_record")
        if origin and origin not in by_id:
            report.warn(
                where,
                f"product {entry.get('name')!r} cites labs_record {origin!r} "
                f"which has no record in incubator/",
            )


def validate() -> int:
    schema = load_schema()
    report = Report()
    records = load_records(report)

    products = {}
    if PRODUCTS_INDEX.exists():
        with PRODUCTS_INDEX.open() as fh:
            products = yaml.safe_load(fh) or {}
    else:
        report.error("portfolio/products.yaml", "missing")

    for rec in records:
        check_fields(rec, schema, report)
        check_identity(rec, schema, report)
        check_decision(rec, schema, report)
        check_evidence(rec, schema, report)
        check_dates(rec, schema, report)
        check_links(rec, products, report)

    check_uniqueness(records, report)
    check_owner_load(records, schema, report)
    check_products(products, records, report)
    check_index(records, report)

    for msg in report.warnings:
        print(f"{YELLOW}warn{RESET}  {msg}")
    for msg in report.errors:
        print(f"{RED}error{RESET} {msg}")

    n = len(records)
    if report.errors:
        print(
            f"\n{RED}{BOLD}FAIL{RESET} {n} record(s): "
            f"{len(report.errors)} error(s), {len(report.warnings)} warning(s)"
        )
        return 1
    print(
        f"\n{GREEN}{BOLD}OK{RESET} {n} record(s) valid, "
        f"{len(report.warnings)} warning(s)"
    )
    return 0


# --------------------------------------------------------------------------- status

STAGE_ORDER = ["idea", "experiment", "prototype", "validating", "building", "graduated", "killed"]


def status() -> int:
    schema = load_schema()
    report = Report()
    records = load_records(report)
    by_stage: dict[str, list[Record]] = {s: [] for s in STAGE_ORDER}
    for rec in records:
        by_stage.setdefault(rec.stage, []).append(rec)

    print(f"\n{BOLD}ARC Labs pipeline{RESET} {DIM}({TODAY}){RESET}\n")
    for stage in STAGE_ORDER:
        bucket = sorted(by_stage.get(stage, []), key=lambda r: r.id)
        print(f"{BOLD}{stage:<11}{RESET} {DIM}{len(bucket):>2}{RESET}")
        for rec in bucket:
            review = as_date(rec.meta.get("review_by"))
            flag, note = "", ""
            if stage not in schema["terminal_stages"] and rec.decision == "pending" and review:
                days = (review - TODAY).days
                if days < 0:
                    flag, note = f"{RED}OVERDUE{RESET}", f"{-days}d past review"
                elif days <= 2:
                    flag, note = f"{YELLOW}DUE{RESET}", f"{days}d to review"
                else:
                    note = f"review in {days}d"
            elif rec.decision != "pending":
                note = f"decided {rec.decision} {rec.meta.get('decided_on', '')}"
            iters = rec.meta.get("iterations", 0) or 0
            tag = " [example]" if rec.meta.get("example") else ""
            print(
                f"  {flag + ' ' if flag else ''}{rec.id}{tag}\n"
                f"      {DIM}{rec.meta.get('domain', '?')} · {rec.meta.get('owner', '?')}"
                f"{' · ' + str(iters) + ' iter' if iters else ''}"
                f"{' · ' + note if note else ''}{RESET}"
            )
        print()

    overdue = sum(
        1
        for r in records
        if r.stage not in schema["terminal_stages"]
        and r.decision == "pending"
        and (as_date(r.meta.get("review_by")) or TODAY + dt.timedelta(days=1)) <= TODAY
    )
    live = [r for r in records if r.stage not in schema["terminal_stages"]]
    grad = by_stage.get("graduated", [])
    killed = by_stage.get("killed", [])
    closed = len(grad) + len(killed)
    rate = f"{len(grad) / closed:.0%}" if closed else "n/a"
    print(
        f"{DIM}live {len(live)} · graduated {len(grad)} · killed {len(killed)} · "
        f"graduation rate {rate}{RESET}"
    )
    if overdue:
        print(f"{RED}{overdue} record(s) overdue for a decision{RESET}")
    return 0


# ------------------------------------------------------------------------ mutations

def slugify(title: str) -> str:
    slug = re.sub(r"[^a-z0-9]+", "-", title.lower()).strip("-")
    return re.sub(r"-{2,}", "-", slug)[:48].strip("-")


def next_id(title: str) -> str:
    year = TODAY.year
    used = []
    for path in INCUBATOR.glob("*/*.md"):
        match = re.match(rf"exp-{year}-(\d{{4}})-", path.stem)
        if match:
            used.append(int(match.group(1)))
    return f"exp-{year}-{max(used, default=0) + 1:04d}-{slugify(title)}"


# Records are hand-edited markdown. Re-serialising the whole front-matter would collapse
# block scalars, quote dates, and delete the template's comments — so mutations edit only
# the lines they change and leave the rest byte-identical.

TOP_KEY = re.compile(r"^([A-Za-z_][A-Za-z0-9_]*):")
RISKY = (": ", " #", "\n")
# Leading characters that would make a plain YAML scalar ambiguous.
SPECIAL = '<>|&*!%@`[]{}#,' + chr(39) + chr(34)


def render_entry(key: str, value) -> list[str]:
    if isinstance(value, bool):
        return [f"{key}: {str(value).lower()}"]
    if isinstance(value, int):
        return [f"{key}: {value}"]
    text = " ".join(str(value).split())
    plain = (
        len(text) <= 72
        and not any(r in text for r in RISKY)
        and text[:1] not in SPECIAL
    )
    if plain:
        return [f"{key}: {text}"]
    return [f"{key}: >"] + ["  " + line for line in textwrap.wrap(text, width=92)]


def entry_bounds(lines: list[str], key: str) -> tuple[int, int] | None:
    """Line span of one top-level front-matter entry, including continuations."""
    start = next(
        (i for i, line in enumerate(lines) if (m := TOP_KEY.match(line)) and m.group(1) == key),
        None,
    )
    if start is None:
        return None
    end = start + 1
    while end < len(lines) and (not lines[end].strip() or lines[end][:1] in (" ", "\t")):
        end += 1
    # Hand back trailing blank lines so spacing between entries survives.
    while end > start + 1 and not lines[end - 1].strip():
        end -= 1
    return start, end


def set_field(rec: Record, key: str, value) -> None:
    lines = rec.front_lines
    bounds = entry_bounds(lines, key)
    entry = render_entry(key, value)
    if bounds is None:
        rec.front_lines = lines + entry
    else:
        start, end = bounds
        rec.front_lines = lines[:start] + entry + lines[end:]
    rec.meta[key] = value


def drop_field(rec: Record, key: str) -> None:
    bounds = entry_bounds(rec.front_lines, key)
    if bounds:
        start, end = bounds
        rec.front_lines = rec.front_lines[:start] + rec.front_lines[end:]
    rec.meta.pop(key, None)


def save(rec: Record) -> None:
    front = "\n".join(rec.front_lines).rstrip("\n")
    rec.path.write_text(f"---\n{front}\n---\n{rec.body}")


def find_record(record_id: str) -> Record:
    matches = [p for p in INCUBATOR.glob("*/*.md") if p.stem == record_id]
    if not matches:
        partial = [p for p in INCUBATOR.glob("*/*.md") if record_id in p.stem]
        if len(partial) == 1:
            matches = partial
        elif len(partial) > 1:
            sys.exit(f"labs: {record_id!r} is ambiguous: {[p.stem for p in partial]}")
        else:
            sys.exit(f"labs: no record matching {record_id!r}")
    return parse_record(matches[0])


def git(*args: str) -> None:
    subprocess.run(["git", "-C", str(ROOT), *args], check=True)


def cmd_new(args: argparse.Namespace) -> int:
    schema = load_schema()
    if args.domain not in schema["domains"]:
        sys.exit(f"labs: domain must be one of {schema['domains']}")
    record_id = next_id(args.title)
    target = INCUBATOR / "ideas" / f"{record_id}.md"
    text = (
        TEMPLATE.read_text()
        .replace("exp-0000-0000-replace-me", record_id)
        .replace("REPLACE WITH A ONE-LINE TITLE", args.title)
        .replace("domain: ai # ", "domain: " + args.domain + " # ")
        .replace("opened: 2026-01-01", f"opened: {TODAY}")
        .replace("owner: unassigned", f"owner: {args.owner}")
    )
    target.write_text(text)
    print(f"{GREEN}created{RESET} {target.relative_to(ROOT)}")
    print("\nNext: answer the five questions, then set review_by and timebox_days.")
    print(f"      {DIM}docs/GRADUATION_CRITERIA.md#the-five-questions{RESET}")
    print(
        f"\n{YELLOW}note{RESET}  the scaffold does not validate until it is filled in — "
        f"that is deliberate.\n      Finish it before committing, or CI will tell you "
        f"which question is still blank."
    )
    return 0


def cmd_move(args: argparse.Namespace) -> int:
    schema = load_schema()
    if args.to not in schema["stages"]:
        sys.exit(f"labs: stage must be one of {list(schema['stages'])}")
    rec = find_record(args.id)
    dest_dir = ROOT / schema["stages"][args.to]
    dest = dest_dir / rec.path.name
    set_field(rec, "stage", args.to)
    save(rec)
    if dest != rec.path:
        git("mv", str(rec.path.relative_to(ROOT)), str(dest.relative_to(ROOT)))
    print(f"{GREEN}moved{RESET} {rec.id}: -> {args.to} ({dest.relative_to(ROOT)})")
    if args.to in schema["terminal_stages"] and rec.decision == "pending":
        print(f"{YELLOW}note{RESET}  terminal stage needs a decision: `labs decide {rec.id} ...`")
    return 0


def cmd_decide(args: argparse.Namespace) -> int:
    schema = load_schema()
    if args.decision not in schema["decisions"]:
        sys.exit(f"labs: decision must be one of {schema['decisions']}")
    rec = find_record(args.id)

    if args.decision == "iterate":
        # An iteration is not a closed decision: it buys a new timebox on the same
        # hypothesis, so the record goes back to 'pending' with a later review date.
        if not args.review_by:
            sys.exit("labs: --review-by is required when iterating (the new timebox)")
        count = int(rec.meta.get("iterations", 0) or 0) + 1
        set_field(rec, "iterations", count)
        set_field(rec, "decision", "pending")
        set_field(rec, "review_by", str(args.review_by))
        set_field(rec, "rationale", args.rationale)
        drop_field(rec, "decided_on")
        print(f"{GREEN}iterated{RESET} {rec.id}: iteration {count}, review_by {args.review_by}")
        if count >= schema["limits"]["max_iterations"]:
            print(
                f"{YELLOW}warn{RESET}  iteration cap reached — kill it, or rewrite the "
                f"hypothesis under a new id"
            )
        save(rec)
        return 0

    set_field(rec, "decision", args.decision)
    set_field(rec, "decided_on", str(args.on or TODAY))
    set_field(rec, "rationale", args.rationale)

    if args.decision == "kill":
        if not args.learned:
            sys.exit(
                "labs: --learned is required on a kill (an experiment that taught nothing "
                "was designed wrong, and that is the lesson)"
            )
        set_field(rec, "learned", args.learned)
        print(f"{GREEN}killed{RESET} {rec.id}")
    elif args.decision == "graduate":
        if not args.to_repo:
            sys.exit("labs: --to-repo is required on a graduation (<org>/<repo>)")
        set_field(rec, "graduated_to", args.to_repo)
        print(f"{GREEN}graduated{RESET} {rec.id} -> {args.to_repo}")
    else:
        print(f"{GREEN}decided{RESET} {rec.id}: {args.decision}")

    save(rec)
    next_stage = {"kill": "killed", "graduate": "graduated", "incubate": "building"}
    if args.decision in next_stage:
        print(f"{DIM}next: labs move {rec.id} --to {next_stage[args.decision]}{RESET}")
    print(
        f"{DIM}      then fill in every evidence 'actual' — a decided record with a "
        f"blank actual fails validate{RESET}"
    )
    return 0


# ------------------------------------------------------------------------- portfolio

def build_index(records: list[Record]) -> dict:
    """The generated view of every record. Single source of truth stays in incubator/."""
    rows = []
    for rec in sorted(records, key=lambda r: r.id):
        row = {
            "id": rec.id,
            "title": rec.meta.get("title"),
            "domain": rec.meta.get("domain"),
            "stage": rec.stage,
            "owner": rec.meta.get("owner"),
            "opened": str(rec.meta.get("opened")),
            "decision": rec.decision,
            "record": rec.rel,
        }
        for key in ("review_by", "decided_on", "graduated_to"):
            if rec.meta.get(key):
                row[key] = str(rec.meta[key])
        if rec.meta.get("iterations"):
            row["iterations"] = rec.meta["iterations"]
        if rec.meta.get("example"):
            row["example"] = True
        rows.append(row)

    counts: dict[str, int] = {}
    for rec in records:
        counts[rec.stage] = counts.get(rec.stage, 0) + 1
    return {
        "generated_by": "tools/labs.py portfolio",
        "note": "GENERATED FILE - do not edit. Source of truth is incubator/*/*.md",
        "counts": {s: counts[s] for s in STAGE_ORDER if s in counts},
        "experiments": rows,
    }


def cmd_portfolio(_args: argparse.Namespace) -> int:
    records = load_records()
    index = build_index(records)
    header = (
        "# GENERATED FILE - do not edit by hand.\n"
        "# Regenerate with: python3 tools/labs.py portfolio\n"
        "# Source of truth: incubator/*/*.md\n\n"
    )
    EXPERIMENTS_INDEX.write_text(
        header + yaml.safe_dump(index, sort_keys=False, allow_unicode=True, width=100)
    )
    print(f"{GREEN}wrote{RESET} {EXPERIMENTS_INDEX.relative_to(ROOT)} ({len(records)} records)")
    return 0


# ------------------------------------------------------------------------------ cli

def main() -> int:
    parser = argparse.ArgumentParser(prog="labs", description=__doc__.split("\n")[0])
    sub = parser.add_subparsers(dest="cmd", required=True)

    sub.add_parser("validate", help="full repository check (what CI runs)")
    sub.add_parser("status", help="the pipeline board")
    sub.add_parser("portfolio", help="regenerate portfolio/experiments.yaml")

    p_new = sub.add_parser("new", help="open a new record in incubator/ideas/")
    p_new.add_argument("title")
    p_new.add_argument("--domain", required=True)
    p_new.add_argument("--owner", default="unassigned")

    p_move = sub.add_parser("move", help="move a record between stages")
    p_move.add_argument("id")
    p_move.add_argument("--to", required=True)

    p_dec = sub.add_parser("decide", help="record a decision at a review date")
    p_dec.add_argument("id")
    p_dec.add_argument("--decision", required=True, help="kill | iterate | incubate | graduate")
    p_dec.add_argument("--rationale", required=True, help="one line: why this decision")
    p_dec.add_argument("--learned", help="required on kill: what is now known")
    p_dec.add_argument("--to-repo", help="required on graduate: <org>/<repo>")
    p_dec.add_argument("--review-by", type=dt.date.fromisoformat, help="required on iterate")
    p_dec.add_argument("--on", type=dt.date.fromisoformat, help="decision date (default today)")

    args = parser.parse_args()
    return {
        "validate": lambda _a: validate(),
        "status": lambda _a: status(),
        "new": cmd_new,
        "move": cmd_move,
        "decide": cmd_decide,
        "portfolio": cmd_portfolio,
    }[args.cmd](args)


if __name__ == "__main__":
    sys.exit(main())
