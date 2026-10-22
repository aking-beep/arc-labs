---
title: Meeting Notes → CRM Update
category: Automation
difficulty: intermediate
tags: [crm, sales, transcription, automation]
updated: 2026-08-11
hitl: true
stack: [transcript, LLM, CRM API]
---

# Meeting Notes → CRM Update

Turn a call transcript into a structured CRM update: next steps, deal stage, risks, and a follow-up draft.

## What it does
Converts a sales-call transcript into fields your CRM actually stores: proposed next step, updated deal stage, identified risks, and a follow-up email draft. All as a structured object a human confirms before write-back. Same shape as ARC's FieldNote portfolio candidate.

## Pipeline
1. **Summarize** — extract decisions, objections, and commitments.
2. **Map** — align to CRM fields (stage, next step, close date, risk).
3. **Draft** — write a follow-up email referencing the specific commitments.
4. **Stage** — present the proposed update as a diff against the current record.
5. **Write-back** — on human confirm, patch the CRM via its API.

## Guardrails
Only propose a stage change the transcript supports; show the evidence line. Never overwrite a human-entered field silently. Always diff and confirm. Store the transcript reference with the update for auditability.

## Tools
- **summarizer** (llm) — Extract decisions, objections, commitments.
- **field-mapper** (llm) — Align to CRM fields as a proposed diff.
- **rep-review** (human) — Confirm the diff before write-back.
- **crm-writer** (api) — Patch the record only after confirm.

## Example input
```json
{
  "transcript": "We need a readiness snapshot before board in September. Stage is still discovery.",
  "current_record": {
    "stage": "discovery",
    "next_step": null
  }
}
```

## Example output
```json
{
  "proposed": {
    "stage": "discovery",
    "next_step": "Send readiness snapshot outline by Friday",
    "close_date": "2026-09-30"
  },
  "evidence": [
    "We need a readiness snapshot before board in September."
  ],
  "follow_up_draft": "Thanks for the time. As discussed, we will send the readiness snapshot outline this week."
}
```
