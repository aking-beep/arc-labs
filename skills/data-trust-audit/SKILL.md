---
name: data-trust-audit
description: Audit whether leadership KPIs can be trusted — source inventory, lineage, quality scores, and a remediation sequence. Use for data readiness, schema/pipeline review, or when numbers have been disputed.
license: MIT
compatibility: Cursor, Claude Code, and any runtime that loads Agent Skills (SKILL.md).
metadata:
  author: ARC Transformation Group
  version: "1.0"
  category: Data
  difficulty: advanced
  tags: data-quality,lineage,kpi,analytics,warehouse
  updated: "2026-08-11"
---

# Data Trust Audit

## When to use

Reporting is argued about, a warehouse is "done" but nobody trusts it, or an AI project is about to sit on shaky data. Triggers: `data readiness`, `why don't these dashboards match`, `score data quality`.

## What it does

Traces KPIs from dashboard to source, scores critical tables, and sequences fixes so leadership numbers get trustworthy first. Drawn from ARC's Quill operating procedure, generalized.

## Steps

1. Inventory sources (including shadow spreadsheets and one-off scripts).
2. Map lineage: source → staging → transform → consumption. Name the tool at each hop.
3. Schema flags: missing owners, ambiguous types, "usually populated" columns.
4. Score each critical table 0–100 on completeness, uniqueness, validity, timeliness, consistency, accuracy. **Every score names the test.**
5. For each leadership KPI: high / medium / low trust, with the specific reason.
6. Sequence remediation: (1) KPIs leadership uses, (2) pipelines that feed them, (3) schemas, (4) retire shadow sources, (5) automated checks.

## Output

Source inventory, lineage notes, quality score table, KPI trust list, roadmap, assumptions.

## Guardrails

Do not score quality on gut feel. Do not recommend a warehouse rewrite when three transformations are broken. Do not ignore the spreadsheet that actually runs finance close. "Dashboard disagrees" is not the same as "data is wrong" — say which.
