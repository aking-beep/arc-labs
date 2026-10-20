# Architecture — <product name>

**Labs record:** `<exp-id>` · **Owner:** <name> · **Last reviewed:** <YYYY-MM-DD>

## What it is

Two sentences. What runs, and what it does for whom.

## Shape

```
<ascii or mermaid — the boxes that exist and what talks to what>
```

## Decisions

The reason this document exists. One entry per decision that was not obvious.

### D1 — <decision>

| | |
| --- | --- |
| **Context** | What forced a choice |
| **Options** | What else was considered |
| **Decision** | What was chosen |
| **Because** | The reason, in terms of the constraint that mattered |
| **Cost** | What this makes harder later |
| **Revisit when** | The condition that should reopen this |

### D2 — <decision>

...

## Data

What is stored, where, for how long, and under what consent. Tie each item to a reason it
must exist (`docs/PRODUCT_PRINCIPLES.md` #7 — private by default).

| Data | Store | Retention | Consent basis |
| --- | --- | --- | --- |
|  |  |  |  |

## Model use

If it ships model output: which models, what the fallback is when they are slow or
unavailable, what the user sees while waiting, and what the user can undo
(`docs/PRODUCT_PRINCIPLES.md` #3 — the human stays the agent).

## Dependencies on `shared/`

| Package | Used for | Plan at graduation |
| --- | --- | --- |
|  |  | publish / vendor / fork |

## Failure modes

What breaks, what the user sees when it breaks, and what pages a human.

## What we would do differently

Kept current. This is the most useful section for whoever maintains it next.
