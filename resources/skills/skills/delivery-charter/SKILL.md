---
name: delivery-charter
description: Turn a scoped engagement into a project charter, milestone plan, RAID log, and a one-page weekly status. Use at kickoff, for delivery governance, or when writing a Friday status.
license: MIT
compatibility: Cursor, Claude Code, and any runtime that loads Agent Skills (SKILL.md).
metadata:
  author: ARC Transformation Group
  version: "1.0"
  category: Delivery
  difficulty: intermediate
  tags: delivery,charter,raid,status,program
  updated: "2026-08-11"
---

# Delivery Charter

## When to use

Work is about to start (or has started without a spine). Triggers: `write the charter`, `kickoff plan`, `weekly status`, `RAID log`.

## What it does

Produces charter v1, a dependency-aware milestone plan, a starter RAID log, and a one-page weekly status template. Drawn from ARC's Ridge operating procedure, generalized.

## Steps

1. Charter: goal, in-scope, out-of-scope, success criteria, stakeholders, milestones, initial risks. Get a named sponsor.
2. Decompose into workstreams. Sequence on dependencies. Put dates on **external** dependencies (access, data, decisions).
3. RAID: seed from charter and known technical findings. Escalate anything unresolved > 14 days.
4. Cadence: daily async, weekly 30-min + written status, milestone reviews. Adjust for size.
5. Scope change: anything > ~4 hours of new work needs a written change (delta to scope, cost, timeline) before work starts.
6. Weekly status: RAG, completed, in progress + ETA, next week, blockers (who unblocks, by when), decisions needed.

## Output

Charter, milestone table, RAID starter, weekly status filled if notes exist otherwise the blank template.

## Guardrails

Do not start "helpful extra work" that is not in scope. Do not hide a Red RAG as Yellow. Do not invent a sponsor. If access is missing, that is a dated external dependency, not a team-velocity problem.
