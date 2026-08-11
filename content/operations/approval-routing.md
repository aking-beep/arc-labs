---
title: Approval Routing (Draft, Don't Move Money)
category: Operations
difficulty: starter
tags: [approvals, ops, hitl, policy]
updated: 2026-08-11
hitl: true
stack: [LLM, policy engine, ticketing]
---

# Approval Routing (Draft, Don't Move Money)

Classify an inbound request, check policy, and route Green/Yellow/Red to the approver of record. Routes and drafts. Never moves money.

## What it does
Routes POs, expenses, vendor onboarding, time-off, and contract sign-off. The model classifies and extracts. A deterministic policy engine triages Green/Yellow/Red. A human clicks Approve, Reject, or Request-info. Pattern from ARC's ClearDesk candidate: routes and drafts, never moves money.

## Pipeline
1. **Classify + extract** — type, amount, vendor, dates, requester.
2. **Policy check** — deterministic rules, not the model.
3. **Triage** — Green / Yellow / Red.
4. **Route** — approver of record with the packet.
5. **HITL** — one-click decision; audit the outcome and time-to-decision.

## Prompt skeleton
```
Classify this inbound approval request.
Return JSON: { type, amount, vendor, requester, dates, confidence, excerpts[] }.
Do not decide Green/Yellow/Red. Do not recommend paying anyone.
The policy engine will triage. A human will decide.
```

## Guardrails
Never move money, never auto-approve Green without a human, never let the model override policy. Fintech-disqualifier sidestep is load-bearing: this tool drafts a packet, it does not pay.

## Tools
- **classifier** (llm) — Type, amount, vendor, requester from the inbound request.
- **policy-check** (validator) — Deterministic budget/policy rules. Not the model.
- **router** (queue) — Send to approver of record with a one-click packet.
- **approver** (human) — Approve, reject, or request info. Nothing executes without this.

## Example input
```json
{
  "request_text": "Please onboard Acme Cloud, $1,200/mo, requested by ops.",
  "policy": {
    "vendor_onboarding_limit": 500,
    "approver": "finance-lead"
  }
}
```

## Example output
```json
{
  "type": "vendor_onboarding",
  "amount": 1200,
  "triage": "Red",
  "reason": "Amount exceeds vendor_onboarding_limit of 500.",
  "approver": "finance-lead",
  "draft": "Packet ready. No payment initiated."
}
```
