---
name: customer-reply-triage
description: Classify an inbound support message by intent, urgency, and sentiment, then draft a first response. Use on support email or chat when asked to triage a ticket or draft a reply.
license: MIT
compatibility: Cursor, Claude Code, and any runtime that loads Agent Skills (SKILL.md).
metadata:
  author: ARC Transformation Group
  version: "1.0"
  category: Support
  difficulty: starter
  tags: support,triage,email,customer
  updated: "2026-08-11"
---

# Customer Reply Triage

## When to use

Inbound support email or chat needs routing and a fast, on-brand first reply. Triggers: `triage this ticket`, `draft a reply`, `what's the severity`.

## What it does

Labels the message with intent (bug, billing, how-to, feature request, churn-risk), urgency (P1–P4), and sentiment. Then drafts a first response that acknowledges, sets expectations, and asks for exactly the missing information needed to resolve.

## Steps

1. Read the full message and any quoted history.
2. Assign intent + urgency + sentiment.
3. Route: map intent to the owning team if a routing table is provided; otherwise name the function (billing, eng, success).
4. Draft a reply: acknowledge → answer or set expectation → one clear next step.
5. Keep the draft under 120 words unless the issue demands detail.

## Output

```
Intent: ...
Urgency: P?
Sentiment: ...
Route to: ...
Draft:
...
```

## Guardrails

Never promise a fix date the team has not committed to. For billing or account changes, confirm identity before taking action. Escalate anything mentioning legal, security, or a data breach to P1 regardless of tone.
