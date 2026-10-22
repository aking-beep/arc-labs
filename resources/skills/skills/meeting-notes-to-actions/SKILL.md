---
name: meeting-notes-to-actions
description: Convert messy meeting notes or a transcript into owned, dated action items with decisions separated from open questions. Use after a meeting when asked to pull action items, list decisions, or capture who owns what.
license: MIT
compatibility: Cursor, Claude Code, and any runtime that loads Agent Skills (SKILL.md).
metadata:
  author: ARC Transformation Group
  version: "1.0"
  category: Productivity
  difficulty: starter
  tags: meetings,notes,productivity,follow-up
  updated: "2026-08-11"
---

# Meeting Notes → Action Items

## When to use

Notes or a transcript are unstructured and follow-ups would otherwise vanish. Triggers: `pull the action items`, `what did we decide`, `who owns what`.

## What it does

Separates three things people usually blur:

- **Decisions** — settled outcomes, stated as facts.
- **Action items** — each with an owner and a due date (ask or infer, never leave blank).
- **Open questions** — unresolved items that need a follow-up.

## Steps

1. Read the full notes before extracting anything.
2. Pull decisions first; phrase each in past tense.
3. Extract actions; attach an owner. If no owner is named, mark `owner: unassigned` rather than guessing a person.
4. Attach a due date; if none is stated, propose one and mark it `(proposed)`.
5. List open questions last so nothing is dropped.

## Output

Three lists: Decisions, Actions (`owner` / `due` / `verb + object`), Open questions.

## Guardrails

Never invent an owner's name. `unassigned` is always safer than a wrong assignment. Keep action verbs concrete (`draft`, `send`, `review`) — avoid `look into`.
