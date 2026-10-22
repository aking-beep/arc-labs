---
name: ai-readiness-audit
description: Score AI readiness across strategy, data, process, systems, talent, and governance, then classify automation opportunities so AI is not used where a script would do. Use for AI readiness, automation opportunity, or process mapping.
license: MIT
compatibility: Cursor, Claude Code, and any runtime that loads Agent Skills (SKILL.md).
metadata:
  author: ARC Transformation Group
  version: "1.0"
  category: AI
  difficulty: advanced
  tags: ai-readiness,automation,roi,governance,process
  updated: "2026-08-11"
---

# AI Readiness Audit

## When to use

Leadership wants "AI" and nobody has ranked what is actually ready. Triggers: `AI readiness`, `where should we automate`, `is this an LLM job`.

## What it does

Scores six readiness dimensions, inventories processes, classifies each opportunity (broken / plain automation / AI-assisted / not yet), sizes ROI with visible assumptions, and returns a 30/60/90 plan. Drawn from ARC's Pulse operating procedure, generalized.

## Steps

1. Score 1–5: strategy clarity, data foundation, process maturity, system integration, talent/capacity, risk/governance. Composite determines what is realistic *today*.
2. Inventory 3–5 core processes: name, owner, frequency, inputs, outputs, handoffs, hours, pain.
3. Classify each:
   - **Broken** — fix the process first.
   - **Plain automation** — deterministic. Scripts/RPA. Do not use a model.
   - **AI-assisted** — unstructured or probabilistic. Model plus human-in-the-loop.
   - **Not yet** — name the unblocker.
4. ROI: hours × cycles × cost, plus error and speed value. Show the math.
5. Rank value / effort; use risk and strategic fit as tiebreakers.
6. Roadmap: 30-day visible quick win, 60-day narrow AI POC with a metric, 90-day durable automation, 6–12 month platform unblocks.
7. Executive memo: 3–5 pages equivalent. Readiness, top 5 opportunities, 30/60/90, two decisions leadership must make.

## Output

Readiness scores, process table, classification + rationale, ROI with assumptions, ranked shortlist, roadmap, decisions needed.

## Guardrails

Do not AI-maxx because that is where the budget is. Do not automate work nobody owns. Do not hide ROI assumptions. Every AI opportunity needs a HITL sketch. "Not yet" must name a specific unblocker (data trust, integration, owner, policy).
