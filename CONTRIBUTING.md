# Contributing to ARC Labs

This repository is an R&D operating system, not an application, so "contributing" usually
means moving an idea through the pipeline rather than changing code.

## Routing

| What you want to do | Go here |
| --- | --- |
| Propose an idea | `python3 tools/labs.py new "Title" --domain <d> --owner <you>` |
| Argue about an idea first | Open an [experiment proposal](./.github/ISSUE_TEMPLATE/experiment-proposal.yml) issue |
| Run an experiment | [`docs/EXPERIMENTATION.md`](./docs/EXPERIMENTATION.md) |
| Decide an experiment's fate | [`docs/GRADUATION_CRITERIA.md`](./docs/GRADUATION_CRITERIA.md) |
| Graduate a product | [Gate 5](./docs/GRADUATION_CRITERIA.md#gate-5--incubate--graduate) + [launch checklist](./templates/launch-checklist/) |
| Understand what Labs is for | [`docs/LABS_CHARTER.md`](./docs/LABS_CHARTER.md) |
| Add shared infrastructure | [`shared/README.md`](./shared/README.md) — second time it is needed, not the first |
| Write up research | [`research/README.md`](./research/README.md) |
| Change the pipeline tooling | [`tools/README.md`](./tools/README.md) |

## Before you open a pull request

```bash
python3 tools/labs.py validate
python3 tools/check_links.py
```

Both run in CI. The first one is the one that fails.

## Commit conventions

Stage transitions get their own commit, with the reasoning in the message — the record's
git history is the audit trail of how an idea actually progressed, and squashing a
transition into a feature commit loses it.

```
exp-2026-0002: iterate -> prototype

Mechanic held at 12 testers; the framing was the problem, not the progression.
review_by extended to 2026-11-10. Iteration 2 of 3.
```

Extending a `review_by` date is **always** acceptable and **never** silent. One commit,
with the reason. That is the whole deal: the dates are soft, the honesty about them is not.

## Two things that are not negotiable

1. **A record past its review date gets a decision.** Kill, iterate, incubate, or
   graduate. CI enforces it, and the enforcement is the point.
2. **A kill carries what was learned.** An experiment that taught nothing was designed
   wrong, and that is itself the lesson.

## Reviewing a record

Read it against the five questions and ask the uncomfortable one: **what result would
make us stop?** If the record cannot answer that, it is not an experiment yet — it is a
plan to build something, with a hypothesis attached afterward.
