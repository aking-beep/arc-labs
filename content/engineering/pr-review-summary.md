---
title: PR Review Summary
category: Engineering
difficulty: starter
tags: [code-review, github, engineering, quality]
updated: 2026-08-11
---

# PR Review Summary

Turn a raw diff into a structured review: risk callouts, test gaps, and a suggested merge decision.

## When to use
Use when a diff or pull request needs a fast, consistent first-pass review before a human signs off. Triggers include: `review this PR`, `summarize this diff`, `what's risky here`, or a pasted unified diff.

## What it does
Reads the diff, groups changes by concern, and produces:
- A one-line **merge recommendation** (approve / approve-with-nits / request-changes).
- **Risk callouts** ranked high → low, each tied to a specific file and line range.
- **Test coverage gaps** — logic paths introduced without a matching test.
- A short **reviewer checklist** the human can tick through.

## Steps
1. Parse the diff into hunks; ignore pure formatting churn.
2. For each hunk, classify: behavior change, refactor, config, docs, or test.
3. Flag any behavior change without an accompanying test hunk.
4. Scan for common risks: unvalidated input, broadened permissions, swallowed errors, N+1 queries, missing null checks.
5. Emit the merge recommendation last, justified by the highest-severity finding.

## Guardrails
Never claim a test exists that you did not see in the diff. If the diff is truncated, say so and scope the review to what's visible. Do not approve changes that touch auth, billing, or migrations without an explicit human-review flag.
