---
name: pr-review-summary
description: Turn a raw diff or pull request into a structured first-pass review with a merge recommendation, ranked risk callouts, and test-coverage gaps. Use when asked to review this PR, summarize this diff, flag what's risky, or when a unified diff is pasted.
license: MIT
compatibility: Cursor, Claude Code, and any runtime that loads Agent Skills (SKILL.md).
metadata:
  author: ARC Transformation Group
  version: "1.0"
  category: Engineering
  difficulty: starter
  tags: code-review,github,engineering,quality
  updated: "2026-08-11"
---

# PR Review Summary

## When to use

A diff or pull request needs a fast, consistent first-pass review before a human signs off. Triggers: `review this PR`, `summarize this diff`, `what's risky here`, or a pasted unified diff.

## What it does

Reads the diff, groups changes by concern, and produces:

- A one-line **merge recommendation** (approve / approve-with-nits / request-changes).
- **Risk callouts** ranked high → low, each tied to a file and line range.
- **Test coverage gaps** — behavior introduced without a matching test.
- A short **reviewer checklist** a human can tick through.

## Steps

1. Parse the diff into hunks. Ignore pure formatting churn.
2. For each hunk, classify: behavior change, refactor, config, docs, or test.
3. Flag any behavior change without an accompanying test hunk.
4. Scan for common risks: unvalidated input, broadened permissions, swallowed errors, N+1 queries, missing null checks, auth/billing/migration edits.
5. Emit the merge recommendation last, justified by the highest-severity finding.

## Output

```
Recommendation: request-changes
Risks:
- [high] path:line — finding
Test gaps:
- path — untested behavior
Checklist:
- [ ] item
```

## Guardrails

Never claim a test exists that you did not see in the diff. If the diff is truncated, say so and scope the review to what is visible. Do not approve changes that touch auth, billing, or migrations without an explicit human-review flag.
