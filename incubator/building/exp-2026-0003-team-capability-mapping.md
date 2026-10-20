---
id: exp-2026-0003-team-capability-mapping
title: Team-level AI capability mapping for engineering leaders
domain: ai
stage: building
owner: aking
opened: 2026-06-02
review_by: 2026-12-18
timebox_days: 120
decision: incubate
decided_on: 2026-09-29
rationale: >
  Behavioural and economic targets both cleared; four teams renewed without being asked
  and two routed budget to it. Moving to product work under the AI Fit line.
iterations: 2
example: true

hypothesis: >
  We believe an engineering leader will pay for a map of where their team's AI capability
  actually sits — per person, per workflow — because the decision they are stuck on is
  not whether to adopt AI but which three people to invest in first.

human_problem: >
  A director of engineering with 40 reports has been told to raise AI capability across
  the organisation and has no instrument to tell them where it currently is. They are
  choosing training, tooling, and headcount on anecdote, and they know it.

experiment: >
  Assess four real teams manually — structured interviews plus observed workflow samples —
  and deliver the map as a static document. No product, no dashboard, no self-serve. If
  the map is the valuable thing, the delivery mechanism can be automated afterwards.

kill_condition: >
  No team requests a second assessment, or no leader routes budget toward the map's
  recommendations within 60 days of delivery.

evidence:
  - signal: Teams requesting a repeat assessment unprompted
    type: behavioural
    target: ">= 2 of 4 teams"
    actual: "4 of 4 teams requested a second cycle"
  - signal: Budget committed against the map's recommendations
    type: economic
    target: ">= 1 team routes real budget within 60 days"
    actual: "2 teams; one reallocated a planned training spend entirely"
  - signal: Leaders describe a decision they made differently
    type: qualitative
    target: ">= 3 of 4 leaders, specific decision named"
    actual: "4 of 4; all four named a specific person-level investment"
  - signal: Manual assessment effort per team
    type: technical
    target: "< 12 hours per team, or automation is mandatory before scale"
    actual: "19 hours per team — automation is mandatory, now the core product problem"

work:
  - experiments/ai/exp-2026-0003-team-capability-mapping
---

# Team-level AI capability mapping for engineering leaders

> **Illustrative seed record.** The specifics here are a worked example of the record
> format, not a committed project. Replace or delete it once real records exist.

## Why this is in `building/`

Evidence cleared [Gate 4](../../docs/GRADUATION_CRITERIA.md#gate-4--validating--incubate):
unprompted repeat demand from every team assessed, and real budget movement from two. The
decision was `incubate` on 2026-09-29.

The commercial relationship to the AI Fit line is recorded in
[`portfolio/products.yaml`](../../portfolio/products.yaml). Whether this graduates as part
of AI Fit or as its own product is an open Gate 5 question, not a settled one.

## The thing the evidence actually surfaced

The map was valuable and the *delivery* was not viable: 19 hours of manual assessment per
team against a 12-hour target. That single number is why this is a product problem rather
than a scaling problem — the automation is not an efficiency improvement on the side, it
is the product.

## What product work remains

- Assessment instrument that does not require an interviewer for every data point
- A defensible scoring model, with its limits stated to the buyer rather than hidden
- Per-person data handling that an engineering director can defend to their own reports
  (`docs/PRODUCT_PRINCIPLES.md` #7) — this is the hardest open item, not the modelling
- Pricing, against the budget movement already observed

## Gate 5 blockers

- [ ] Product brief (`templates/product-brief/`)
- [ ] Architecture document, with the per-person data model settled
- [ ] `evals/ai` — scoring output ships to a buyer who will act on it
- [ ] `evals/security` and `evals/accessibility`
- [ ] Decision: graduates inside AI Fit, or as its own repository
