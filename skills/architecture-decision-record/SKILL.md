---
name: architecture-decision-record
description: Write an Architecture Decision Record from a proposed change, including context, options, consequences, and what was rejected. Use when asked to write an ADR, record a design decision, or explain why this approach won.
license: MIT
compatibility: Cursor, Claude Code, and any runtime that loads Agent Skills (SKILL.md).
metadata:
  author: ARC Transformation Group
  version: "1.0"
  category: Architecture
  difficulty: starter
  tags: adr,architecture,decisions,design
  updated: "2026-08-11"
---

# Architecture Decision Record

## When to use

A choice is about to be (or was) made and the team will otherwise forget why. Triggers: `write an ADR`, `record this decision`, `why did we pick X`.

## What it does

Produces a short ADR: status, context, decision, options considered, consequences, and follow-ups.

## Steps

1. Title as a decision, not a topic (`Use SQS for webhook delivery`, not `Messaging`).
2. Status: proposed / accepted / superseded (link the successor if known).
3. Context: the force that made a choice necessary. Facts, not vibes.
4. Options: at least two real alternatives, each with a trade-off. Include "do nothing."
5. Decision: one paragraph, present tense.
6. Consequences: good, bad, and the follow-up work the decision creates.

## Output

```
# ADR-NNN: Title
Status:
Context:
Options:
Decision:
Consequences:
Follow-ups:
```

## Guardrails

Do not hide a rejected option that was actually cheaper. Do not write an ADR for a reversible default (lint rules, folder names) unless the user asked. If requirements are missing, list them under Context as unknowns instead of filling them in.
