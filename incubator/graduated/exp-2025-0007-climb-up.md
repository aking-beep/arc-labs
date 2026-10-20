---
id: exp-2025-0007-climb-up
title: CLIMB UP — structured progression for self-coached climbers
domain: human-performance
stage: graduated
owner: aking
opened: 2025-03-11
decision: graduate
decided_on: 2025-11-04
rationale: >
  Returning non-employee users, an owner, and a quarter of product roadmap. Graduated to
  its own repository with its own deployment cadence.
graduated_to: aking-beep/climb-up
example: true

hypothesis: >
  We believed that a self-coached climber plateaus for want of structured progression
  rather than for want of effort or access, and that a tool which makes the next session
  obvious would produce measurable progression where a training log does not.

human_problem: >
  A climber two years in, training three times a week without a coach, improving slower
  than their effort justifies. They are not short of information or motivation. What they
  lack is a credible answer to "what should today be", so every session defaults to
  whatever they did last time.

experiment: >
  A single progression path, hardcoded, for one discipline. No account system, no
  logging, no social features — just the next session, and whether people came back for
  the one after it.

evidence:
  - signal: Users returning for a fourth prescribed session
    type: behavioural
    target: "set at the time; see repository analytics"
    actual: "BACKFILL REQUIRED — reconstructed record, see aking-beep/climb-up analytics"
  - signal: Self-reported progression at eight weeks
    type: qualitative
    target: "set at the time; see repository analytics"
    actual: "BACKFILL REQUIRED — reconstructed record"
---

# CLIMB UP — structured progression for self-coached climbers

> **Illustrative, partially reconstructed record.** CLIMB UP graduated before this record
> format existed. The hypothesis and problem statement are restated here as the origin
> story; the evidence actuals are **not yet backfilled** and are marked as such rather
> than filled with plausible numbers.
>
> This is also the worked example of **how to backfill a pre-system graduation** — see below.

## Where the code lives

[`aking-beep/climb-up`](https://github.com/aking-beep/climb-up). Not in Labs, by design:
graduation deletes the code from `experiments/`. See
[`portfolio/products.yaml`](../../portfolio/products.yaml) for the portfolio entry.

## Backfilling a record for a product that graduated before the system

Worth doing for anything already shipped, and worth doing cheaply:

1. **Restate the hypothesis as it actually was**, not as the product now justifies itself.
   The value of the record is that it captures what was believed at the time, including
   the parts that turned out to be wrong.
2. **Mark unknown evidence as unknown.** `BACKFILL REQUIRED` is a true statement.
   Retrofitted numbers are worse than a gap, because a gap can be fixed and a plausible
   fabrication cannot be detected.
3. **Set `decided_on` to the real graduation date** if it is knowable, and say so in the
   body if it is an estimate.
4. **Register the product** in `portfolio/products.yaml`. `labs validate` fails a
   `graduated_to` that is not registered, which is the check that keeps the two in sync.

## What Labs learned

To be written by the owner. The useful content is the part that did not survive contact
with users — which disciplines the single hardcoded progression path failed for, and what
that implied about how general the progression model could be.
