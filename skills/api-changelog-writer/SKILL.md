---
name: api-changelog-writer
description: Generate a human-readable, semver-aware changelog entry from merged commits or pull requests. Use at release time, or when asked to write the changelog or summarize what changed since a version.
license: MIT
compatibility: Cursor, Claude Code, and any runtime that loads Agent Skills (SKILL.md).
metadata:
  author: ARC Transformation Group
  version: "1.0"
  category: Engineering
  difficulty: intermediate
  tags: changelog,api,release,engineering
  updated: "2026-08-11"
---

# API Changelog Writer

## When to use

Merged commits or PRs need to become a changelog developers can actually read. Triggers: `write the changelog`, `what changed since v1.4`, `draft release notes`.

## What it does

Groups changes into Added, Changed, Deprecated, Fixed, and Breaking. Rewrites each from the consumer's point of view and proposes the next semver bump.

## Steps

1. Classify each commit by Keep a Changelog category.
2. Rewrite terse commit messages into user-facing sentences ("Fixed a crash when …", not "fix npe").
3. Surface breaking changes at the top with a migration note.
4. Recommend the version bump: any breaking → major; any new feature → minor; else patch.

## Output

Keep a Changelog sections, then a single line: `Recommended bump: X.Y.Z → A.B.C (reason)`.

## Guardrails

Only describe changes present in the provided commits. If a commit message is ambiguous, flag it for author review rather than inventing behavior. Do not hide breaking changes in Added or Fixed.
