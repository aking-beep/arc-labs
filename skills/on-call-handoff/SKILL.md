---
name: on-call-handoff
description: Produce a tight on-call handoff from recent pages, deploys, open incidents, and unfinished threads. Use at shift change, Friday wrap, or when asked to write the on-call notes.
license: MIT
compatibility: Cursor, Claude Code, and any runtime that loads Agent Skills (SKILL.md).
metadata:
  author: ARC Transformation Group
  version: "1.0"
  category: Operations
  difficulty: starter
  tags: on-call,sre,handoff,operations
  updated: "2026-08-11"
---

# On-call Handoff

## When to use

One engineer is going off rotation and the next needs the state of the world in under two minutes. Triggers: `write the handoff`, `on-call notes`, `what's on fire`.

## What it does

Compresses the last shift into: open incidents, pages that mattered, deploys in flight, risks to watch, and a single "if this pages, do this" list.

## Steps

1. List **open** incidents first. Status, next action, owner.
2. List pages in the window that were real vs noise (one line each).
3. List deploys or flag flips that are not fully baked.
4. Name the top 3 watch items for the next 12 hours.
5. Attach runbook links only if they were provided or exist in-repo. Do not invent URLs.

## Output

```
Open:
- ...
Noise vs signal:
- ...
In flight:
- ...
Watch:
- ...
If this pages: ...
```

## Guardrails

Never mark an incident resolved unless the input says it recovered. Never invent a runbook link. Keep the whole handoff under 400 words.
