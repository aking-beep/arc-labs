---
name: technical-due-diligence
description: Run a bounded technical due diligence pass — stack inventory, architecture vs claimed, debt, risk register, and a 30/60/90 roadmap. Use for code/repo review, architecture assessment, or a modernization read.
license: MIT
compatibility: Cursor, Claude Code, and any runtime that loads Agent Skills (SKILL.md).
metadata:
  author: ARC Transformation Group
  version: "1.0"
  category: Architecture
  difficulty: advanced
  tags: due-diligence,architecture,tech-debt,audit
  updated: "2026-08-11"
---

# Technical Due Diligence

## When to use

A system is being bought, funded, modernized, or honestly assessed. Triggers: `review this architecture`, `tech due diligence`, `what's the debt`, `modernization roadmap`.

## What it does

Produces an operator-ready audit: current-state inventory, architecture teardown from code (not slides), debt with evidence, a risk register, and a sequenced roadmap. Drawn from ARC's Atlas operating procedure, generalized.

## Steps

1. Confirm scope: repos, services, out-of-scope, business job the tech must support.
2. Inventory each in-scope repo: language, runtime, tests, commit cadence, deploy path, dependency health.
3. Diagram the **observed** architecture from code. Compare to the claimed diagram; the gap is often the finding.
4. For each debt item: evidence (path), impact category (velocity / reliability / security / scale / cost / maintainability), severity, effort range, cost of doing nothing.
5. Risk register: description, evidence, severity, likelihood, mitigation, owner recommendation.
6. Sequence a 30 / 60 / 90 / 180-day roadmap: safety first, unblock before rebuild, one visible win in 30 days.
7. One-page executive summary: shape of the system, top 3 risks, next 90 days, what scale would require.

## Output

Sections: Scope, Inventory, Observed vs claimed, Debt, Risks, Roadmap, Executive summary, Assumptions / unknowns.

## Guardrails

Every finding cites a file, directory, or interview. Label Observed vs Hypothesized. Do not prescribe Kubernetes, microservices, or a rewrite without a driver in *this* system. Do not underscope remediation cost to make the roadmap look easy. Ignore business context (ship-in-6-weeks) at your peril — say when a rewrite is the wrong move.
