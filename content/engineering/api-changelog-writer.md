---
title: API Changelog Writer
category: Engineering
difficulty: intermediate
tags: [changelog, api, release, engineering]
updated: 2026-08-11
---

# API Changelog Writer

Generate a human-readable, semver-aware changelog entry from a set of merged commits or PRs.

## When to use
At release time, when merged commits/PRs need to become a changelog that developers can actually read. Triggers: `write the changelog`, `what changed since v1.4`.

## What it does
Groups changes into `Added`, `Changed`, `Deprecated`, `Fixed`, and `Breaking`, writes each from the consumer's point of view, and proposes the next semver bump based on the presence of breaking changes or new features.

## Steps
1. Classify each commit by Keep-a-Changelog category.
2. Rewrite terse commit messages into user-facing sentences ('Fixed a crash when …', not 'fix npe').
3. Surface breaking changes at the top with a migration note.
4. Recommend the version bump: any breaking → major; any new feature → minor; else patch.

## Guardrails
Only describe changes present in the provided commits. If a commit message is ambiguous, flag it for author review rather than inventing behavior.
