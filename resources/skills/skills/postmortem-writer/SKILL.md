---
name: postmortem-writer
description: Turn an incident timeline and notes into a blameless postmortem with impact, contributing factors, and numbered follow-ups. Use after an incident when writing a PIR, RCA, or postmortem doc.
license: MIT
compatibility: Cursor, Claude Code, and any runtime that loads Agent Skills (SKILL.md).
metadata:
  author: ARC Transformation Group
  version: "1.0"
  category: Operations
  difficulty: intermediate
  tags: postmortem,incident,sre,rca
  updated: "2026-08-11"
---

# Postmortem Writer

## When to use

The incident is mitigated and the team needs a written record. Triggers: `write the postmortem`, `draft the PIR`, `root cause analysis`.

## What it does

Produces a blameless postmortem: summary, customer/user impact, timeline (or pointer to one), contributing factors, what went well, what to change, and numbered actions with owners.

## Steps

1. Write a 5-line summary a non-engineer can read.
2. Quantify impact: users, duration, revenue/SLA if known. Mark unknown as unknown.
3. Paste or summarize the timeline. Do not rewrite timestamps.
4. Separate **trigger** (what started it) from **contributing factors** (why it spread). Avoid a single "root cause" if several factors stacked.
5. List follow-ups as `owner / due / success criterion`. Prefer `unassigned` over inventing a person.

## Output

`# Postmortem — <title> — <date>` with sections: Summary, Impact, Timeline, Contributing factors, What went well, Follow-ups.

## Guardrails

No blame language ("X should have known"). Do not invent metrics. If a follow-up has no owner, mark `unassigned` rather than guessing. Do not declare "this can never happen again."
