---
id: exp-2026-0002-question-framing-before-a-session
title: Question framing instead of instruction before a training session
domain: human-performance
stage: experiment
owner: aking
opened: 2026-10-18
review_by: 2026-10-27
timebox_days: 7
decision: pending
iterations: 1
example: true

hypothesis: >
  We believe that replacing the pre-session instruction ("complete three sets") with a
  question ("what do you want to find out today?") raises session completion, because the
  barrier is motivational framing rather than the difficulty of the work itself.

human_problem: >
  Someone eight weeks into a training programme knows what to do and does it anyway less
  than half the time. The gap is not knowledge or capability — it is that the session
  arrives as an obligation handed to them, and obligations handed to people are easy to
  put down.

experiment: >
  One screen, two variants, shown to the same 24 people on alternating days for a week.
  Variant A is the current instruction, variant B is a question. Count completed sessions.
  Everything else — the programme, the timing, the notifications — stays identical.

kill_condition: >
  Completion under variant B is within 5 percentage points of variant A across the full
  week, in which case the framing is not the lever and we stop looking here.

evidence:
  - signal: Session completion rate, variant B vs variant A
    type: behavioural
    target: ">= 15 percentage points higher for B"
    actual:
  - signal: Unprompted comments about how the prompt felt
    type: qualitative
    target: "framing mentioned by >= 5 of 24 without being asked"
    actual:

work:
  - experiments/human-performance/exp-2026-0002-question-framing
---

# Question framing instead of instruction before a training session

> **Illustrative seed record.** The specifics here are a worked example of the record
> format, not a committed project. Replace or delete it once real records exist.

## Why now

The first iteration of this experiment shipped an instruction-framed prompt to 12 testers
and four completed. Two testers volunteered, without being asked, that the prompt "felt
like homework". That comment is the entire reason this record has a second iteration: the
mechanic was never under suspicion, the framing was.

## What we are not doing

- Not changing the programme, the content, or the timing — only the sentence
- Not personalising the question (that is a separate hypothesis, and a more expensive one)
- Not building a settings screen to choose between framings

## Prior art

See `research/human-potential/` for the self-determination theory reading that motivated
the question framing. Note the gap worth being honest about: that literature is about
sustained motivation over months, and this experiment measures a week. A win here is
evidence about the prompt, not about the theory.

## Open questions

- Does the effect survive past novelty? A week cannot answer this; a `validating` stage could.
- Does the question need to be answered, or is being asked sufficient?
