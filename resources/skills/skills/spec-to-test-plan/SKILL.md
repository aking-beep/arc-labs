---
name: spec-to-test-plan
description: Turn a feature spec or ticket into a structured test plan covering happy paths, edge cases, and negative cases. Use when asked to write test cases, derive QA coverage, or check whether acceptance criteria are testable.
license: MIT
compatibility: Cursor, Claude Code, and any runtime that loads Agent Skills (SKILL.md).
metadata:
  author: ARC Transformation Group
  version: "1.0"
  category: Quality
  difficulty: advanced
  tags: testing,qa,spec,quality
  updated: "2026-08-11"
---

# Spec → Test Plan

## When to use

A written spec or ticket needs a test plan before implementation starts. Triggers: `write test cases for this`, `what should we test`, `are these acceptance criteria testable`.

## What it does

Derives testable behaviors from the spec and organizes them into happy-path, edge-case, and negative/failure cases, each with preconditions, steps, and expected result. Flags any acceptance criterion that is not observable or measurable.

## Steps

1. Extract every acceptance criterion; number them.
2. For each, write at least one happy-path case.
3. Enumerate boundaries (empty, max, min, off-by-one) as edge cases.
4. Add negative cases: invalid input, unauthorized access, dependency failure.
5. Map each case back to the criterion it verifies; flag uncovered criteria.

## Output

A table: `ID | Criterion | Type | Preconditions | Steps | Expected`. Then a coverage gap list.

## Guardrails

If a criterion cannot be tested as written (e.g. "should feel fast"), do not invent a threshold — flag it and request a measurable target. Coverage claims must trace to a numbered criterion.
