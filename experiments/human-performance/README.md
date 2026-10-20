# Human performance experiments

> **How do we measurably raise human capability?**

The largest domain in Labs and the one closest to the mandate. The discipline it demands is behavioural evidence: in this domain more than any other, people report improvement they did not experience and sustain habits they did not form. Self-report is a signal about perception, not capability.

## Belongs here

- Training, progression, and skill-acquisition structures
- Recovery, readiness, and load management
- Motivation and adherence mechanics — within [Principle #2](../../docs/PRODUCT_PRINCIPLES.md)
- Measurement: what is worth tracking, and what tracking does to the person tracking it
- Coaching interactions, human or model-assisted

## Does not belong here

- Anything that needs a clinical claim or medical advice
- Loss-aversion mechanics — streaks, guilt, escalating stakes. Ruled out as a category;
  see [`exp-2026-0004`](../../incubator/archive/exp-2026-0004-streak-pressure-mechanic.md)
- Health data collected without a specific hypothesis that requires it ([Principle #7](../../docs/PRODUCT_PRINCIPLES.md))
- Content libraries with no mechanism being tested

---

One directory per experiment, named for its record id. Start from
[`templates/experiment/WORK_README.md`](../../templates/experiment/WORK_README.md), and
open the record first: `python3 tools/labs.py new "Title" --domain human-performance`.
