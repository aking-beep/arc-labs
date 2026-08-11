---
title: Email Draft & Route
category: Automation
difficulty: starter
tags: [email, classification, automation, human-in-the-loop]
updated: 2026-08-11
hitl: true
stack: [LLM, email provider, ticketing]
---

# Email Draft & Route

Classify inbound email, route it to the right queue, and draft a reply for human approval. Never auto-send.

## What it does
Reads an inbound email, assigns a category and priority, routes it to the owning team, and drafts a reply that lands in a review queue. A human approves or edits before anything sends.

## Pipeline
1. **Classify** — intent + priority + sentiment from subject and body.
2. **Route** — map intent to a team/queue.
3. **Draft** — generate a reply with the right tone and a single clear next step.
4. **Queue** — write the draft to a review inbox with the classification attached.
5. **Approve** — human sends or edits; capture edits as training signal.

## Guardrails
Never auto-send. Anything touching billing, legal, or account changes is flagged for mandatory human review. Redact secrets and PII from logs. If classification confidence is low, route to a general triage queue rather than guessing.

## Tools
- **classifier** (llm) — Intent, priority, sentiment.
- **router** (queue) — Map intent to a team queue.
- **drafter** (llm) — Write a reply with one clear next step.
- **review-inbox** (human) — Approve or edit before send.

## Example input
```json
{
  "subject": "Invoice 1841 looks high",
  "body": "We were charged twice for July. Can you check?"
}
```

## Example output
```json
{
  "intent": "billing",
  "priority": "high",
  "queue": "finance-ops",
  "draft": "Thanks for flagging invoice 1841. We will check for a duplicate July charge and reply with what we find.",
  "auto_send": false
}
```
