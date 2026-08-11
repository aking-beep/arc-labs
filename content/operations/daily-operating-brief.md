---
title: Daily Operating Brief
category: Operations
difficulty: intermediate
tags: [operator, brief, hitl, json]
updated: 2026-08-11
hitl: true
stack: [LLM, JSON schema, evidence store]
---

# Daily Operating Brief

Turn structured operating objects into an evidence-backed daily brief: decisions, commitments at risk, issues, and at most five priorities.

## What it does
Produces a Daily Operating Brief for an accountable operator. It does not chat. It ranks what needs a decision, which commitments will slip, which issues are already happening, who needs a message, and at most five recommended priorities. Every recommendation cites an operating-object ID. This is the core loop from ARC's Operator AI package.

## Pipeline
1. **Load** — pull operating objects and evidence for the account as of a date.
2. **Prioritize** — decisions that unblock work, then missed commitments, then high-severity risks or issues, then stakeholder comms, then commercial signals.
3. **Draft** — emit valid JSON matching the DailyOperatingBrief schema.
4. **Gate** — operator reviews before Slack/email/dashboard publish.
5. **Publish** — on approval, render Markdown + JSON for the day's brief.

## Prompt skeleton
```
You are preparing an evidence-backed Daily Operating Brief for an accountable operator.
Use only the supplied structured operating objects and evidence.

Prioritize:
1. decisions that unblock work
2. commitments likely to be missed
3. high-severity risks or active issues
4. stakeholder communication that protects confidence
5. commercially relevant scope or expansion signals

Rules:
- Do not repeat low-value information.
- Do not describe a risk as an issue unless it has already occurred.
- Do not claim certainty when evidence is incomplete.
- Recommend no more than five priorities.
- Each recommendation must reference its operating object ID.
- Return valid JSON matching the DailyOperatingBrief schema.
```

## Guardrails
Use only supplied objects. A status report saying "green" does not override contradictory evidence. Never invent owners, dates, or decisions. Cap priorities at five. Human review before any outbound message. Label synthetic accounts as synthetic.

## Tools
- **operating-object-store** (api) — Read structured objects and evidence IDs for the account.
- **brief-model** (llm) — Draft the DailyOperatingBrief JSON from supplied objects only.
- **operator-review** (human) — Confirm priorities before the brief is sent or posted.

## Example input
```json
{
  "account_id": "northstar-fitness",
  "as_of": "2026-08-03",
  "operating_objects": [
    {
      "id": "OBJ-14",
      "object_type": "decision",
      "title": "Approve consent language for DE launch"
    },
    {
      "id": "OBJ-09",
      "object_type": "commitment",
      "title": "Priya readiness view by July 31"
    }
  ]
}
```

## Example output
```json
{
  "operating_condition": "AMBER",
  "decisions_required": [
    "Approve DE consent language before country-lead comms."
  ],
  "commitments_at_risk": [
    "Priya readiness view (due July 31) has no evidence of delivery."
  ],
  "priorities": [
    {
      "rank": 1,
      "object_id": "OBJ-14",
      "action": "Get a dated yes/no on consent language."
    },
    {
      "rank": 2,
      "object_id": "OBJ-09",
      "action": "Confirm readiness-view owner and new date."
    }
  ]
}
```
