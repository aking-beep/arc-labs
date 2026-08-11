---
title: Evidence → Operating Objects
category: Operations
difficulty: advanced
tags: [extraction, operator, evidence, json]
updated: 2026-08-11
hitl: true
stack: [LLM, JSON schema, artifact store]
---

# Evidence → Operating Objects

Convert a business artifact into persistent operating objects (decision, commitment, risk, issue, dependency) with verbatim evidence excerpts.

## What it does
Turns a Slack export, email, meeting note, or status report into typed operating objects. Allowed types: initiative, decision, commitment, risk, issue, dependency, stakeholder_action, opportunity, outcome. Prefer fewer high-signal objects over many low-value outcomes. Lifted from ARC's Operator AI extraction prompt.

## Pipeline
1. **Ingest** — store the artifact, stamp SOURCE_ID.
2. **Extract** — model returns JSON only: {"objects":[...]}.
3. **Validate** — every evidence.excerpt is a contiguous verbatim quote; source_id matches SOURCE_ID; object_type is allowed.
4. **Repair** — on schema failure, return errors for at most two retries.
5. **Persist** — human accepts objects into the store.

## Prompt skeleton
```
You are an operating-intelligence extraction engine.
Convert the supplied business artifact into persistent operating objects.

Allowed object_type values:
initiative, decision, commitment, risk, issue, dependency,
stakeholder_action, opportunity, outcome.

Definitions (use precisely):
- risk: a future uncertain condition that may hurt an objective.
- issue: a negative condition that is already occurring now.
- dependency: progress requires another event, team, approval, or deliverable.
- commitment: a named person/team agreed to deliver something by a stated time.
- decision: an option has been selected, OR an approval choice must be made.
- stakeholder_action: communication, alignment, approval, or escalation is required.
- opportunity: evidence supports commercial upside or scope expansion.
- outcome: completed work already delivered (use sparingly).

Rules:
1. Do not invent owners, dates, facts, or decisions.
2. Distinguish estimates from commitments.
3. Every evidence.excerpt MUST be an exact contiguous verbatim quote.
4. Set evidence[].source_id exactly to SOURCE_ID.
5. Confidence must reflect evidentiary strength (0 to 1).
6. Return valid JSON only: {"objects":[ ... ]}.
```

## Guardrails
Do not invent facts. A "green" status report does not create new risks from generic Upcoming bullets. From status reports alone, extract nothing unless there is a concrete ownership gap, missed commitment, explicit blocker, or commercial ask. Escalate after two failed schema repairs.

## Tools
- **artifact-loader** (api) — Fetch the source document and assign SOURCE_ID.
- **extract-model** (llm) — Emit { objects: OperatingObject[] } only.
- **schema-validator** (validator) — Reject objects missing evidence excerpts or types.
- **analyst-review** (human) — Accept, merge, or drop objects before they persist.

## Example input
```json
{
  "source_id": "2026-07-27_weekly_delivery",
  "artifact_text": "Priya will send the readiness view by July 31. Germany legal approval is still pending."
}
```

## Example output
```json
{
  "objects": [
    {
      "id": "OBJ-09",
      "object_type": "commitment",
      "title": "Priya readiness view by July 31",
      "evidence": [
        {
          "source_id": "2026-07-27_weekly_delivery",
          "excerpt": "Priya will send the readiness view by July 31."
        }
      ]
    },
    {
      "id": "OBJ-11",
      "object_type": "dependency",
      "title": "Germany legal approval pending",
      "evidence": [
        {
          "source_id": "2026-07-27_weekly_delivery",
          "excerpt": "Germany legal approval is still pending."
        }
      ]
    }
  ]
}
```
