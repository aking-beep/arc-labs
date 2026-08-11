---
name: devops-readiness-audit
description: Assess cloud, CI/CD, environments, observability, and scale readiness, sequenced so bleeding stops before tool shopping. Use for DevOps review, CI audit, or "what breaks if traffic doubles."
license: MIT
compatibility: Cursor, Claude Code, and any runtime that loads Agent Skills (SKILL.md).
metadata:
  author: ARC Transformation Group
  version: "1.0"
  category: DevOps
  difficulty: advanced
  tags: devops,cicd,observability,reliability,cloud
  updated: "2026-08-11"
---

# DevOps Readiness Audit

## When to use

Deploys are scary, incidents are found by users, or the team wants a scale read. Triggers: `CI/CD audit`, `observability review`, `what breaks at 3x traffic`.

## What it does

Inventories cloud and pipelines, tests observability against real incidents, and sequences a roadmap: stop bleeding, close the biggest observability gap, harden the pipeline, then scale. Drawn from ARC's Forge operating procedure, generalized.

## Steps

1. Cloud current-state: accounts, regions, core services, IaC vs click-ops, surprising cost lines.
2. CI/CD: build frequency, failure rate, test depth, deploy model, rollback (exists / tested / fictional), secrets handling.
3. Environments: count, parity, data in lower envs (synthetic / masked / prod copies), access, rebuild cadence.
4. Observability test: did the last three incidents surface in the stack, or did users find them?
5. Reliability: SPOFs, backup/restore last tested, runbooks current, on-call who can actually respond.
6. Scale: at 3x / 10x, what breaks first, what costs 10x for 2x benefit, config change vs architecture change.
7. Roadmap: (1) active incident risk, (2) observability gap, (3) pipeline harden, (4) environments, (5) scale prep.

## Output

Inventory, CI/CD findings, observability verdict, SPOF list, 3x/10x break list, sequenced roadmap, assumptions.

## Guardrails

Do not recommend Kubernetes because it is the default answer. Do not add a third observability platform to a team that ignores the one they have. Validate observability claims against real incidents, not dashboard screenshots. Name operational cost of every recommendation.
