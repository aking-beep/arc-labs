---
name: icp-account-score
description: Score a target account on a 100-point ICP rubric (fit, pain, budget, timing, access, complexity) and assign a pursuit tier. Use when ranking accounts, scoring ICP, building a target list, or deciding Tier A vs cut.
license: MIT
compatibility: Cursor, Claude Code, and any runtime that loads Agent Skills (SKILL.md).
metadata:
  author: ARC Transformation Group
  version: "1.0"
  category: Growth
  difficulty: intermediate
  tags: icp,scoring,pipeline,gtm,accounts
  updated: "2026-08-11"
---

# ICP Account Score

## When to use

A company needs an honest pursuit score before outreach. Triggers: `score this account`, `is this ICP`, `tier this target`.

## What it does

Scores six weighted dimensions (100 points) and emits a tier plus the evidence behind each number. Default weights match a mid-market services ICP; override weights if the user supplies them.

| Dimension | Weight | Measures |
| --- | --- | --- |
| Fit | 20 | Firmographic / technographic match |
| Pain | 25 | Evidence of the specific pain you solve |
| Budget | 15 | Ability to fund the offer |
| Timing | 20 | Trigger event that explains why now |
| Access | 10 | Path to a named buyer |
| Complexity fit | 10 | Scope matches delivery capacity |

## Steps

1. Confirm the ICP band the user wants (size, geo, offer). If none, state the default you are using.
2. Score each dimension with a number **and** one evidence sentence. Prefer public facts over inference.
3. If two or more dimensions are inference-heavy, label the account `hypothesis-heavy`.
4. Sum to a total. Assign tier: A 80–100, B 60–79, C 40–59, Cut below 40.
5. Name the opening offer that fits the pain (diagnostic, workshop, audit) — one offer, not three.

## Output

```
Account:
Total: /100   Tier: A|B|C|Cut   Hypothesis-heavy: yes/no
Fit: /20 — evidence
Pain: /25 — evidence
Budget: /15 — evidence
Timing: /20 — evidence
Access: /10 — evidence
Complexity: /10 — evidence
Opening offer:
Cut reason: (if below 40)
```

## Guardrails

Score honestly. Do not inflate to force a Tier A. Do not invent employee counts, funding, or buyer names. If a fact cannot be verified from the input or a cited source, leave the dimension low and say why. Overrides (strategic interest, warm intro) must be labeled as overrides, not hidden in the math.
