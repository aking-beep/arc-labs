---
title: Spec → Test Plan
category: Quality
difficulty: advanced
tags: [testing, qa, spec, quality]
updated: 2026-08-11
---

# Spec → Test Plan

Turn a feature spec into a structured test plan: happy paths, edge cases, and negative cases.

## When to use
When a written spec or ticket needs a test plan before implementation starts. Triggers: `write test cases for this`, `what should we test`.

## What it does
Derives testable behaviors from the spec and organizes them into happy-path, edge-case, and negative/failure cases, each with preconditions, steps, and expected result. Flags any acceptance criterion that isn't observable or measurable.

## Steps
1. Extract every acceptance criterion; number them.
2. For each, write at least one happy-path case.
3. Enumerate boundaries (empty, max, min, off-by-one) as edge cases.
4. Add negative cases: invalid input, unauthorized access, dependency failure.
5. Map each case back to the criterion it verifies; flag uncovered criteria.

## Guardrails
If a criterion can't be tested as written (e.g. 'should feel fast'), do not invent a threshold — flag it and request a measurable target. Coverage claims must trace to a numbered criterion.
