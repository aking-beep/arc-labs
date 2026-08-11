---
title: SOW Generator (Lite)
category: Consulting
difficulty: intermediate
tags: [sow, consulting, hitl, markdown]
updated: 2026-08-11
hitl: true
stack: [LLM, Markdown, JSON]
---

# SOW Generator (Lite)

Draft a consulting-grade Statement of Work from structured operational intelligence. Facts and labeled assumptions only. Never invent pricing.

## What it does
Generates a Statement of Work from supplied operational intelligence. Separates current state, objectives, scope, out of scope, requirements, deliverables, milestones, dependencies, assumptions, risks, acceptance criteria, success metrics, governance, timeline, staffing, and commercial assumptions. Listed as a free ARC Labs utility in the Master Blueprint (SOW Generator Lite).

## Pipeline
1. **Load** — structured intelligence + engagement goal.
2. **Draft JSON** — every major section as fields.
3. **Draft Markdown** — consulting-grade prose from the same fields.
4. **Flag** — unanswered questions and pricing placeholders.
5. **Review** — partner edits before it leaves the building.

## Prompt skeleton
```
Generate a consulting-grade Statement of Work from the supplied structured operational intelligence.

Rules:
- Use only supplied facts and explicitly labeled assumptions.
- Separate current state, objectives, scope, out of scope, requirements,
  deliverables, milestones, dependencies, assumptions, risks, acceptance
  criteria, success metrics, governance, timeline, staffing, and commercial assumptions.
- Link major scope items to evidence or identified operational needs.
- Identify unanswered questions.
- Never invent pricing. Where pricing is missing, provide placeholders and estimation logic.
- Return: 1) structured JSON  2) polished Markdown.
```

## Guardrails
Never invent pricing or confidential client facts. Label assumptions. Link scope to evidence. Human signs the SOW; the model does not send it.

## Tools
- **intel-loader** (api) — Load operating intelligence for the engagement.
- **sow-model** (llm) — Emit structured JSON plus polished Markdown.
- **partner-review** (human) — Sign off scope, commercial placeholders, and unanswered questions.

## Example input
```json
{
  "account_name": "Northstar Fitness",
  "engagement_goal": "90-day AI readiness assessment and roadmap",
  "intelligence": {
    "operating_condition": "AMBER",
    "gaps": [
      "No approved AI use-case list",
      "No data classification"
    ]
  }
}
```

## Example output
```json
{
  "json": {
    "scope": [
      "Readiness snapshot",
      "One workflow design",
      "90-day roadmap"
    ],
    "out_of_scope": [
      "Model training",
      "Production agent"
    ]
  },
  "markdown": "# Statement of Work — Northstar Fitness\n...",
  "unanswered_questions": [
    "Who owns data classification today?"
  ],
  "pricing": "PLACEHOLDER — estimate from staffing x duration; do not invent a number."
}
```
