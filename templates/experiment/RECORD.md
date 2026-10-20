---
id: exp-0000-0000-replace-me
title: REPLACE WITH A ONE-LINE TITLE
domain: ai # ai | human-performance | travel | gaming | emerging-tech
stage: idea
owner: unassigned
opened: 2026-01-01
decision: pending

# --- Timebox. Required once the stage leaves `idea`. -------------------------
# review_by: 2026-01-08
# timebox_days: 7

# --- Q1. Hypothesis: what do we believe? -------------------------------------
# Falsifiable. "We believe X, for Y, because Z." If no evidence could prove it
# wrong, rewrite it.
hypothesis: >
  We believe ...

# --- Q2. Human problem: whose capability or experience are we improving? -----
# A named person or role, and what is hard for them today. Not a market, not a
# segment, not "users".
human_problem: >
  ...

# --- Q3. Experiment: what is the smallest thing we can build? ----------------
# Buildable inside the timebox by one person. If it needs auth, billing, and a
# mobile app, it is not the smallest thing.
experiment: >
  ...

# --- Q4. Evidence: what tells us people actually want it? --------------------
# Targets are set BEFORE the build. `actual` is filled in at decision time.
# At least one signal must be type `behavioural` or `economic` — interest is
# not demand.
evidence:
  - signal: ...
    type: behavioural # behavioural | qualitative | economic | technical
    target: ...
    actual:
  - signal: ...
    type: qualitative
    target: ...
    actual:

# --- The result that would end this. Required from stage `experiment` on. ----
# kill_condition: >
#   ...

# --- Q5. Decision: filled in at the review date. -----------------------------
# decision: kill | iterate | incubate | graduate
# decided_on: 2026-01-08
# rationale: >
#   one line: why this decision
# learned: >          # required on kill
#   ...
# graduated_to: org/repo   # required on graduate
# iterations: 0

# --- Links -------------------------------------------------------------------
# work:
#   - experiments/<domain>/<id>/
---

# REPLACE WITH A ONE-LINE TITLE

> Status: **idea**. Five questions above. Prose below is for the thinking that does not
> fit in a field.

## Why now

What changed that makes this worth trying today rather than last year? New capability,
new cost curve, new behaviour, new access. If nothing changed, this is an idea without
a trigger.

## What we are not doing

The adjacent things deliberately out of scope for this experiment. This section is what
keeps the smallest thing small.

## Prior art

What already exists, inside ARC and outside it. Why it does not already answer the
question. Link to anything in `research/`.

## Open questions

Things we do not know and are not testing yet. Future records live here.

## Log

Dated entries go in the work directory's `NOTES.md`, not here. Link it under `work:`.
