# Prototypes

**One step past an experiment: works end-to-end, for a real person, on their own device.**

A prototype is still disposable. What makes it different from an experiment is that it no
longer has a human behind the curtain — the mechanism actually runs.

```
prototypes/<record-id>/
├── README.md
├── NOTES.md
└── <code>
```

## Experiment vs prototype vs product

| | Experiment | Prototype | Product |
| --- | --- | --- | --- |
| **Question** | Could this work? | Does this work for someone? | Should this exist at scale? |
| **Mechanism** | Faked where convenient | Real, end-to-end | Real and maintained |
| **Audience** | The owner, a handful of testers | Real people, not employees | Users |
| **Timebox** | 1–7 days | 1–3 weeks | Quarters |
| **Lives in** | `experiments/<domain>/` | `prototypes/` | Its own repository |
| **Principles** | 1–3, 7 | 1–5, 7, 10 | All ten |

## Not organised by domain

Deliberately flat. There are never many prototypes at once — a record only reaches this
stage after an experiment survived a decision — and a flat directory makes it obvious when
there are too many. More than a handful here means Labs is building rather than deciding.

## Graduating out

The moment a prototype has real returning users and someone willing to own it as a
product, it stops belonging here. See
[Gate 4](../docs/GRADUATION_CRITERIA.md#gate-4--validating--incubate) and
[Gate 5](../docs/GRADUATION_CRITERIA.md#gate-5--incubate--graduate). **Graduation deletes
the directory** — Labs keeps no copy of graduated code.

## Prototype hygiene

Still disposable, with two exceptions that are not negotiable at this stage:

- **Privacy** ([Principle #7](../docs/PRODUCT_PRINCIPLES.md)). Real people are using this.
  Private defaults, stated collection, and deletion when the validation window closes.
- **Reversibility** ([Principle #3](../docs/PRODUCT_PRINCIPLES.md)). The user can see what
  the system did and undo it.

Everything else — tests, error handling, architecture, performance — can wait for
`building`. These two cannot, because the cost of getting them wrong lands on someone who
agreed to help.
