---
title: Deal → Kickoff Brief
category: Consulting
difficulty: intermediate
tags: [kickoff, handoff, agency, hitl]
updated: 2026-08-11
hitl: true
stack: [LLM, project tool, email]
---

# Deal → Kickoff Brief

Turn a signed SOW or email thread into a kickoff brief: scope, deliverables, budget, deadline, stakeholders, access, and open questions. Reds block approval.

## What it does
Closes the sales-to-delivery handoff. Parses a signed contract, SOW, or email thread into a kickoff brief with confidence-scored fields. Red flags block approval. On approval, create project tasks and draft the client confirmation. Pattern from ARC's KickoffPilot portfolio candidate.

## Pipeline
1. **Extract** — scope, deliverables, budget, deadline, stakeholders, access, open questions.
2. **Score** — confidence per field.
3. **Flag** — reds (missing deadline/budget/owner) block; yellows need a note.
4. **HITL** — PM resolves reds.
5. **Publish** — tasks + drafted client confirmation. Never auto-create tasks on red.

## Prompt skeleton
```
Extract a kickoff brief from the supplied contract / SOW / email thread.

Return JSON with: scope[], deliverables[], budget, deadline, stakeholders[],
access_needed[], open_questions[], and flags[] where each flag has field,
severity (red|yellow), confidence (0-1), and evidence excerpt.

Rules:
- Do not invent a deadline, budget, or owner.
- If a field is missing, set it null and add a red flag.
- Evidence excerpts must be verbatim.
- Reds block task creation.
```

## Guardrails
Reds block approval. Never auto-create project tasks or send the client email. Do not fill gaps with guesses. This is a handoff tool, not a project manager.

## Tools
- **contract-parser** (llm) — Extract scope, budget, dates, stakeholders with confidence.
- **gap-flagger** (validator) — Red any missing deadline, budget, or named owner.
- **pm-review** (human) — Resolve reds before tasks are created.
- **task-writer** (api) — Create project tasks only after approval.

## Example input
```json
{
  "source_documents": [
    "SOW signed 2026-08-01. Deliverables: readiness snapshot, one workflow design. Deadline not stated. Budget: $24k."
  ]
}
```

## Example output
```json
{
  "scope": [
    "Readiness snapshot",
    "One workflow design"
  ],
  "budget": "$24k",
  "deadline": null,
  "flags": [
    {
      "field": "deadline",
      "severity": "red",
      "note": "No date in source. Blocks approval."
    }
  ],
  "open_questions": [
    "What is the hard stop date?"
  ]
}
```
