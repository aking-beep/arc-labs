---
id: exp-2026-0004-streak-pressure-mechanic
title: Streak-pressure mechanic to raise session consistency
domain: gaming
stage: killed
owner: aking
opened: 2026-04-07
review_by: 2026-04-21
timebox_days: 14
decision: kill
decided_on: 2026-04-21
rationale: >
  Target was met and the mechanic was killed anyway. It raised consistency by manufacturing
  anxiety, which fails Product Principle #2 — and the retention it produced did not survive
  a broken streak.
learned: >
  Loss-aversion mechanics work on the metric and against the user. Consistency rose 22
  points while unprompted negative sentiment tripled, and 71% of users who broke a streak
  never returned — the mechanic was not building a habit, it was building a liability that
  discharged on the first missed day. Two durable conclusions: consistency is the wrong
  north star where the real goal is progression, and any future mechanic must be tested
  against post-failure behaviour, not just adherence while the streak holds.
example: true

hypothesis: >
  We believed that a visible streak counter with escalating loss framing would raise
  session consistency, and that higher consistency would translate into measurably better
  progression outcomes over eight weeks.

human_problem: >
  Someone training on their own completes roughly half the sessions they intend to. The
  stated goal was to close that gap, on the assumption that consistency was the binding
  constraint on their progression.

experiment: >
  Streak counter plus escalating loss framing ("don't lose your 9 days"), shown to 180
  users for two weeks against a control group of equal size. Measured session consistency,
  sentiment, and — added at the review — return behaviour after a broken streak.

kill_condition: >
  Consistency fails to rise by 10 points, or sentiment degrades materially, or post-break
  return rate falls below the control group.

evidence:
  - signal: Session consistency, treatment vs control
    type: behavioural
    target: ">= 10 percentage points higher"
    actual: "+22 points — target comfortably met"
  - signal: Unprompted negative sentiment in support channel
    type: qualitative
    target: "no material increase"
    actual: "3.1x control; words used were 'stressful', 'guilty', 'nagging'"
  - signal: Return rate after a broken streak
    type: behavioural
    target: "not set in advance — added at review"
    actual: "29% returned, vs 64% of control after an equivalent gap"
---

# Streak-pressure mechanic to raise session consistency

> **Illustrative seed record.** The specifics here are a worked example of the record
> format, not a real study. Replace or delete it once real records exist.

## Why this is the most useful record in the repository

It is the case the system exists to handle: **the primary target was met and the
experiment was killed anyway.**

Consistency rose 22 points against a 10-point target. Had the record contained only that
signal, this would have shipped. Two things stopped it:

1. A written kill condition that included sentiment, not just the metric being optimised
2. `docs/PRODUCT_PRINCIPLES.md` #2 — *curiosity is the engagement model* — which rules out
   loss-aversion mechanics as a category, and which the record had to be argued against
   rather than around

## The signal that was missing from the plan

Post-break return rate was **not** in the original evidence list. It was added at the
review because someone asked what happens on day ten, and it turned out to be the finding:
29% versus 64%. The mechanic was not building a habit, it was accumulating a liability
that discharged the first time someone missed a day.

The process lesson is sharper than the product lesson. A validation plan that measures
only adherence-while-working cannot see the failure mode, so
[`templates/validation-plan/PLAN.md`](../../templates/validation-plan/PLAN.md) now asks
explicitly for behaviour after the mechanic fails.

## What this rules out

- Streaks, loss framing, and escalating-stakes mechanics in Labs products — the category,
  not just this implementation
- Consistency as a north-star metric where progression is the actual goal

## What is still open

The underlying problem is untouched: people complete about half the sessions they intend
to. [`exp-2026-0002`](../validating/exp-2026-0002-question-framing-before-a-session.md)
approaches it from framing rather than pressure, which is the direction this kill pointed at.
