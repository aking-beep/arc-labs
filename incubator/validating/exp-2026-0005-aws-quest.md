---
id: exp-2026-0005-aws-quest
title: AWS Quest — walking a cloud curriculum as a game map
domain: gaming
stage: experiment
owner: aking
opened: 2026-10-21
review_by: 2026-11-04
timebox_days: 14
decision: pending
iterations: 1

hypothesis: >
  We believe that putting a daily cloud curriculum on a walkable game map, where each
  lesson is a waypoint with a role-play scenario, gets lessons finished more consistently
  than the same lessons kept as a list of documents, because the next step is always
  visible and finishing one is rewarded.

human_problem: >
  Someone working through a long self-paced AWS curriculum, one lesson a day, alongside a
  job. The lessons are good; the drop-off comes from a list of documents giving no sense
  of where you are, what is next, or that yesterday counted.

experiment: >
  The existing single-file prototype: eight lessons (L066–L073) across four regions, with
  XP, levels and badges saved in localStorage. Use it as the only way into those eight
  lessons for two weeks and record which waypoints are cleared, on which days.

kill_condition: >
  Fewer than five of the eight waypoints are cleared inside the two weeks, in which case
  the map is not what makes the next lesson happen and it goes back to being a list.

evidence:
  - signal: Waypoints cleared within the timebox
    type: behavioural
    target: ">= 6 of 8 within 14 days"
    actual:
  - signal: Days with a lesson cleared, versus the same stretch of the curriculum as documents
    type: behavioural
    target: "more active days than the document-list baseline"
    actual:

work:
  - experiments/aws-quest
---

# AWS Quest — walking a cloud curriculum as a game map

> **Drafted during the repository consolidation on 2026-10-21.** The hypothesis, timebox and
> targets above were written from the prototype's README so the work has an owner and a
> review date, as the charter requires. Confirm or rewrite them; extending `review_by` is
> always fine, with a commit that says why.

## Where it came from

AWS Quest was its own repository, `aking-beep/aws-quest`. It was imported into
[`experiments/aws-quest`](../../experiments/aws-quest/) with its history, per the consolidation
plan. It is one dependency-free `index.html`: open it in a browser.

## What we are not doing

- No accounts, no server, no sync — progress stays in localStorage.
- No lessons beyond the eight already wired in until this record has a decision.
- No claim that a game teaches better; this only tests whether it gets lessons finished.

## Decision

Pending — due 2026-11-04.
