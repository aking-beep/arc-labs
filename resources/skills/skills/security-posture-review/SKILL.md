---
name: security-posture-review
description: Produce a current-state security posture review covering IAM, secrets, third parties, and a 0-30 / 30-90 / 90-180 remediation sequence. Use for access reviews, secrets hygiene, or a scale-ready security roadmap.
license: MIT
compatibility: Cursor, Claude Code, and any runtime that loads Agent Skills (SKILL.md).
metadata:
  author: ARC Transformation Group
  version: "1.0"
  category: Security
  difficulty: advanced
  tags: security,iam,secrets,risk,compliance
  updated: "2026-08-11"
---

# Security Posture Review

## When to use

Access is fuzzy, secrets live in too many places, or a customer just asked hard questions. Triggers: `security review`, `IAM audit`, `secrets inventory`, `are we ready for SOC 2`.

## What it does

Snapshots posture, reviews access and secrets, triages cloud/app misconfig, and builds a risk matrix with a sequenced roadmap. Drawn from ARC's Sentinel operating procedure, generalized.

## Steps

1. Posture snapshot: IAM topology, secrets locations (not values), data classification, third parties, compliance status if any.
2. Access: highest-privilege accounts, service accounts, MFA coverage, offboarding speed, least-privilege on critical resources.
3. Secrets: in source control?, env vars, rotation, PII/PHI handling, backup encryption.
4. Cloud/app triage: public surfaces, open buckets/SGs, CVEs on key services, logging/audit, incident runbook ever exercised.
5. Risk matrix: severity, likelihood, business impact, high/medium/low.
6. Roadmap: Immediate 0–30 (exploitable or compliance-blocking), Near-term 30–90, Scale-readiness 90–180.
7. Executive summary in plain language. Translate jargon.

## Output

Snapshot, access findings, secrets findings, risk table, roadmap, executive summary, assumptions.

## Guardrails

No FUD. No "best practice" without a threat mapped to *this* system. Do not recommend a SOC 2 program to a team that does not need one. Distinguish "fix today" from "fix before enterprise sale." Never ask for or echo secret *values* — locations and handling only. Estimate operational load of every control.
