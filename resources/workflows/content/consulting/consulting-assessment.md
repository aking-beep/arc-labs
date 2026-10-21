---
title: Consulting Assessment
category: Consulting
difficulty: intermediate
tags: [assessment, ai-readiness, aws, consulting]
updated: 2026-08-11
hitl: true
stack: [LLM, JSON, Markdown]
---

# Consulting Assessment

Generate a technical, CRO, AWS, DevOps, or AI-readiness assessment from operating intelligence. Findings grounded in evidence IDs.

## What it does
Produces a consulting-grade assessment of type technical, cro, aws, devops, or ai_readiness. Separates current-state findings, risks, gaps, recommendations, and roadmap. Grounds findings in evidence IDs when available. From ARC's Operator AI assessment prompt.

## Pipeline
1. **Select** — assessment type.
2. **Ground** — attach evidence IDs to each finding.
3. **Separate** — current state, risks, gaps, recommendations, roadmap.
4. **Emit** — JSON + Markdown.
5. **Label** — mark synthetic accounts as synthetic.

## Prompt skeleton
```
Generate a consulting-grade assessment from the supplied structured operational intelligence.

Assessment types supported: technical, cro, aws, devops, ai_readiness.

Rules:
- Use only supplied facts and explicitly labeled assumptions.
- Ground findings in evidence IDs or operating objects when available.
- Separate current-state findings, risks, gaps, recommendations, and roadmap.
- Never invent confidential client facts.
- Clearly label the account and assessment as synthetic when the source intelligence is synthetic.
- Return: 1) structured JSON  2) polished Markdown.
```

## Guardrails
No invented client facts. Synthetic stays labeled synthetic. Human reviews before delivery. Do not sell a near-term fix as transformation.

## Tools
- **intel-loader** (api) — Load operating objects and evidence for the account.
- **assessment-model** (llm) — Emit JSON + Markdown for the chosen assessment type.
- **reviewer** (human) — Confirm findings before the client sees them.

## Example input
```json
{
  "account_name": "Northstar Fitness",
  "assessment_type": "ai_readiness",
  "intelligence": {
    "data_classification": "missing",
    "approved_tools": [
      "ChatGPT consumer"
    ],
    "production_agents": 0
  }
}
```

## Example output
```json
{
  "type": "ai_readiness",
  "current_state": [
    "Consumer ChatGPT in use",
    "No data classification"
  ],
  "risks": [
    "Unapproved tools on client data"
  ],
  "recommendations": [
    "Name approved tools",
    "Classify data",
    "Pick one workflow to design"
  ],
  "roadmap": [
    "30 days: policy",
    "60 days: one workflow",
    "90 days: measure"
  ]
}
```
