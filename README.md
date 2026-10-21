# ARC Labs

> **ARC Labs explores the intersection of human potential, human curiosity, and emerging technology.**

This repository is not a monorepo. It is the **R&D operating system** for ARC
Transformation Group: where an idea is written down, timeboxed, tested against evidence,
and then either killed or sent out into its own repository.

Its sibling has an equally crisp mandate:

> **ARC Control makes autonomous technology trustworthy enough to operate in the real world.**

**Labs explores what should exist. Control makes intelligent systems safe and reliable
enough to exist at scale.**

---

## The incubation model

```
Idea ──▶ Experiment ──▶ Prototype ──▶ Validation ──▶ Product ──▶ Independent repo
  │          │              │              │             │
  └──────────┴──────────────┴──────────────┴─────────────┘
                   any stage can decide: KILL
```

Something can begin in `experiments/`. Once it becomes a real application with its own
users, deployment, roadmap, or revenue model, it **graduates into its own repository** —
and Labs keeps no copy of the code, only the record of why it was built.

## The five questions

Every experiment in Labs answers all five, in a record, before it consumes anyone's time:

| | Question |
| --- | --- |
| 1 | **Hypothesis** — what do we believe? |
| 2 | **Human problem** — whose capability or experience are we improving? |
| 3 | **Experiment** — what is the smallest thing we can build? |
| 4 | **Evidence** — what tells us people actually want it? |
| 5 | **Decision** — kill, iterate, incubate, or graduate? |

This is what stops ARC Labs becoming a graveyard of half-built projects, and it is
**enforced, not encouraged**. A record past its review date with no decision fails CI.
See [`docs/GRADUATION_CRITERIA.md`](./docs/GRADUATION_CRITERIA.md).

## Quickstart

```bash
python3 -m pip install pyyaml

python3 tools/labs.py status                                   # the pipeline board
python3 tools/labs.py validate                                 # what CI runs
python3 tools/labs.py new "Your idea" --domain ai --owner you  # open a record
```

Then answer the five questions in the generated file, set a `review_by` date, and build
the smallest thing.

## Repository map

| Directory | What it holds |
| --- | --- |
| [`incubator/`](./incubator/) | **The board.** One record per idea. The record *moves* between stage directories — `git mv` is the state transition. |
| [`experiments/`](./experiments/) | The work, by domain. Hardcoded, disposable, timeboxed. |
| [`prototypes/`](./prototypes/) | Works end-to-end for a real person. One step past an experiment. |
| [`research/`](./research/) | Dated, attributed notes. Knowledge that outlives the experiment. |
| [`portfolio/`](./portfolio/) | `products.yaml` (hand-maintained registry) and `experiments.yaml` (generated). |
| [`resources/`](./resources/) | Maintained public libraries: skills, workflows, architectures. The [one exception](./docs/LABS_CHARTER.md#the-one-exception-maintained-public-resource-libraries) to "no product source here". |
| [`shared/`](./shared/) | Leverage: design system, analytics, AI, auth, mobile. Reusable before repeated. |
| [`templates/`](./templates/) | The paperwork each gate asks for. |
| [`evals/`](./evals/) | The gates with teeth. Accessibility and security block every graduation. |
| [`docs/`](./docs/) | Charter, product principles, experimentation practice, graduation criteria. |
| [`tools/`](./tools/) | `labs.py` and the record schema. |

## Domains

| Domain | The question it asks |
| --- | --- |
| [`ai`](./experiments/ai/) | What can intelligent systems do for a person that they could not do before? |
| [`human-performance`](./experiments/human-performance/) | How do we measurably raise human capability? |
| [`travel`](./experiments/travel/) | How does technology change how people move through and understand the world? |
| [`gaming`](./experiments/gaming/) | What do play, progression, and motivation teach us about engagement? |
| [`emerging-tech`](./experiments/emerging-tech/) | What becomes possible that was not possible 18 months ago? |

## Portfolio

Current classification. Registry: [`portfolio/products.yaml`](./portfolio/products.yaml).
Belonging to ARC Labs as a division does not mean living in this repository — products
graduate into their own.

| Line | Product | Labs relationship | Code location |
| --- | --- | --- | --- |
| AI & developer tools | AI Fit | Labs product | `aifit-engine` (a second copy lives in `ark`) |
| | AI Fit Teams | Labs commercial experiment | `ark/apps/business` — moving to `aifit-engine/apps/teams` |
| | MCP Conformance Scanner | Labs product | `mcp-conformance-scanner` |
| | Prompt Reviewer | Labs product | `prompt-reviewer` |
| | Connectivity Scanner | Labs product | `connectivity-scanner` |
| | ARC Skills | Labs resource library | [`resources/skills`](./resources/skills/) in this repo |
| | AI Workflow Templates | Labs resource library | [`resources/workflows`](./resources/workflows/) in this repo |
| | Reference Architectures | Labs resource library | [`resources/architectures`](./resources/architectures/) in this repo |
| Travel & experiences | ARC Travel (ARC Stay) | Labs product | `arc-travel` |
| | Culture Context | Labs technology | `culture-context` — moving into `arc-travel` as a module |
| Gaming & human performance | CLIMB UP | Labs product | `climb-up` |
| | Steady Move | Labs product | `steady-move` |
| | MIRRORSU | Labs product | `v0-voice-note-mood-tracker` |
| Experimental learning | AWS Quest | Labs experiment | [`experiments/aws-quest`](./experiments/aws-quest/) in this repo |
| | 1–7 day experiments | Labs experiment | `experiments/` in this repo |
| **Not Labs** | **ARC Control** | Control | `arc-control` — the one canonical Control repo |
| | ARK (legacy) | Control + Labs, splitting | `ark` — Control half to `arc-control`, AI Fit halves to AI Fit |
| | Company website | Corporate | `arc-website` |

Repositories to archive — the three empty ones (`arc-agent-governance`,
`arc-ai-security-scanner`, `arc-journey-scanner`) and `aws-quest`, now imported here — are
listed under `archive:` in the registry. The three resource libraries' old repositories are
archived only once their deployments run from [`resources/`](./resources/).

## Documents worth reading in order

1. [`docs/LABS_CHARTER.md`](./docs/LABS_CHARTER.md) — the mandate, and what Labs is not
2. [`docs/GRADUATION_CRITERIA.md`](./docs/GRADUATION_CRITERIA.md) — the five questions, the
   stages, the five gates, the staleness rule
3. [`docs/EXPERIMENTATION.md`](./docs/EXPERIMENTATION.md) — how to actually run one
4. [`docs/PRODUCT_PRINCIPLES.md`](./docs/PRODUCT_PRINCIPLES.md) — what Labs builds, and how
   it behaves when it builds it

## The seed records

`incubator/` ships with five illustrative records — one per stage — marked `example: true`
in their front-matter and labelled in their bodies. They exist so the board renders, the
validator is exercised, and the format is legible without reading the schema.

The most useful one is
[`exp-2026-0004-streak-pressure-mechanic`](./incubator/archive/exp-2026-0004-streak-pressure-mechanic.md):
the primary target was met and the experiment was killed anyway. That is the case this
whole system exists to handle.

Replace or delete them as real records arrive.
