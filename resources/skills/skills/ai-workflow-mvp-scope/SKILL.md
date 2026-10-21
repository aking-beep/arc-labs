---
name: ai-workflow-mvp-scope
description: Scope an AI workflow MVP to one user, one workflow, one metric, with human-in-the-loop and failure design on every model step. Use when designing an AI feature, writing MVP scope, or checking an agent workflow before build.
license: MIT
compatibility: Cursor, Claude Code, and any runtime that loads Agent Skills (SKILL.md).
metadata:
  author: ARC Transformation Group
  version: "1.0"
  category: AI
  difficulty: advanced
  tags: mvp,agents,workflow,hitl,kpis
  updated: "2026-08-11"
---

# AI Workflow MVP Scope

## When to use

An "AI product" is about to sprawl. Triggers: `scope the MVP`, `design this agent workflow`, `one user one workflow`, `HITL for this step`.

## What it does

Reframes the problem, forces one user / one workflow / one metric, designs each step (human / script / model), and refuses to start build without KPIs, cost/latency envelopes, and failure paths. Drawn from ARC's Nova operating procedure, generalized.

## Steps

1. Reframe: primary user, job, decision supported, what "better" means (faster / more accurate / cheaper / less fatigue). If this is fuzzy, stop and ask.
2. Concept brief: one user, one workflow, one metric. Pre vs post. Classify every step.
3. MVP in/out: what is built, what stays manual, minimum data and integrations, go-live acceptance.
4. For **every** model step answer: task (classify/extract/summarize/generate/decide), input/output shape, accuracy range, how accuracy is measured, low-confidence behavior, unavailable behavior, wrong behavior, who reviews when, logging/retention, cost per run, latency envelope, whether the data is allowed to leave.
5. KPIs: business, system, adoption — each with definition, target, measurement, review cadence, escalation.
6. Rollout: pilot population, onboarding, feedback, rollback, phase-2 criteria.

## Output

Problem reframe, concept brief, MVP in/out, per-step design table, KPI table, rollout, open questions.

## Guardrails

Do not design a platform when an MVP would do. Do not let model choice drive the workflow. Do not skip KPIs "until after launch." Do not treat HITL as a later add-on. If data classification is unknown, the model step is blocked, not "we'll be careful."
