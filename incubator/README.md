# Incubator

**The incubator is the board. One record per idea, and the record moves.**

Every idea in ARC Labs has exactly one record: a markdown file with YAML front-matter
carrying the [five questions](../docs/GRADUATION_CRITERIA.md#the-five-questions). The
record's stage is encoded twice — in its `stage:` field and in the directory it sits in —
and `tools/labs.py validate` fails if those disagree. `git mv` between these directories
*is* the state transition, which means `git log --follow` on any record is that idea's
complete history.

```
ideas/ ──▶ validating/ ──▶ building/ ──▶ graduated/
   │            │              │
   └────────────┴──────────────┴──────────▶ archive/   (killed)
```

| Directory | Stages it holds | Means |
| --- | --- | --- |
| [`ideas/`](./ideas/) | `idea` | Written down, not started. No timebox yet. |
| [`validating/`](./validating/) | `experiment`, `prototype`, `validating` | In flight, timeboxed, has a kill condition. |
| [`building/`](./building/) | `building` | Decided `incubate`. Becoming a product, still in Labs. |
| [`graduated/`](./graduated/) | `graduated` | Left Labs. Has its own repo. Record stays as the origin story. |
| [`archive/`](./archive/) | `killed` | Answered, and the answer was no. Record stays as the lesson. |

## Why `archive/` is not `graduated/`

Killed records are kept, deliberately and separately. Two reasons:

1. **Honesty.** The ratio of `graduated/` to `archive/` is the only real signal Labs has
   about its own hit rate. Mixing them destroys it.
2. **Compounding.** A kill is required to carry a `learned` field. Those fields are the
   most valuable text in this repository — they stop the same idea being retried in
   eighteen months by someone who was not in the room.

A healthy Labs has considerably more records in `archive/` than in `graduated/`.

## Working the board

```bash
python3 tools/labs.py status       # the board, with overdue reviews flagged red
python3 tools/labs.py validate     # what CI runs
python3 tools/labs.py new "Title" --domain ai --owner aking
python3 tools/labs.py move exp-2026-0001-slug --to prototype
python3 tools/labs.py decide exp-2026-0001-slug --decision kill \
    --rationale "Nobody returned unprompted" \
    --learned "The mechanic was never the problem; the framing was."
```

## The one rule that matters

A record in a non-terminal stage, past its `review_by` date, with `decision: pending`
**fails CI**. Extending a date is cheap — one commit, with the reason in the message.
Ignoring one is not possible. That single mechanism is what keeps this directory a
pipeline instead of a graveyard.
