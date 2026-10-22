#!/usr/bin/env python3
"""Check that relative markdown links in this repository resolve.

External URLs are deliberately not checked: a flaky third-party host should never fail
the pipeline's build. Anchors are stripped — this verifies the file exists, not the heading.

A link starting with `/` inside a web app (any directory with a package.json) is a site-root
URL, so it resolves against that app's public/.

    python3 tools/check_links.py
"""

from __future__ import annotations

import pathlib
import re
import sys
from urllib.parse import unquote

ROOT = pathlib.Path(__file__).resolve().parent.parent
LINK = re.compile(r"\[[^\]]*\]\(([^)\s]+)\)")
SKIP_SCHEME = re.compile(r"^(https?:|mailto:|tel:|#)")
# Inline code and fenced blocks hold examples, not links.
FENCE = re.compile(r"```.*?```", re.DOTALL)
INLINE_CODE = re.compile(r"`[^`\n]*`")


def resolve(path: pathlib.Path, target: str) -> pathlib.Path:
    if target.startswith("/"):
        for parent in path.parents:
            if parent == ROOT:
                break
            if (parent / "package.json").exists():
                return (parent / "public" / target.lstrip("/")).resolve()
    return (path.parent / target).resolve()


def main() -> int:
    broken: list[str] = []
    checked = 0

    for path in sorted(ROOT.rglob("*.md")):
        if ".git" in path.parts or "node_modules" in path.parts:
            continue
        text = INLINE_CODE.sub(" ", FENCE.sub(" ", path.read_text()))
        for target in LINK.findall(text):
            if SKIP_SCHEME.match(target):
                continue
            checked += 1
            resolved = resolve(path, unquote(target.split("#", 1)[0]))
            if not resolved.exists():
                broken.append(f"{path.relative_to(ROOT)} -> {target}")

    for item in broken:
        print(f"error broken relative link: {item}")
    if broken:
        print(f"\nFAIL {len(broken)} broken link(s) of {checked} checked")
        return 1
    print(f"OK {checked} relative link(s) resolve")
    return 0


if __name__ == "__main__":
    sys.exit(main())
