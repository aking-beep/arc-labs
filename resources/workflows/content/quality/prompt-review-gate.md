---
title: Prompt Review Gate
category: Quality
difficulty: starter
tags: [prompts, ci, quality, sister-tool]
updated: 2026-08-11
hitl: false
stack: [Prompt Reviewer CLI, GitHub Actions]
---

# Prompt Review Gate

Run ARC Prompt Reviewer as a CI gate: score clarity, ambiguity, injection surface, and failure modes before a prompt ships.

## What it does
Wraps the free ARC Prompt Reviewer as a workflow step. Paste or path a system prompt, get a 0-100 score, letter grade, and concrete rewrites. Fail CI when the grade is below the bar. Static and reproducible. No model call.

## Pipeline
1. **Collect** — prompt file (and optional tool list) in the PR.
2. **Review** — `npm run review -- path/to/prompt.txt --min-grade=B`.
3. **Report** — Markdown/JSON on the PR.
4. **Gate** — fail the check under the minimum grade.
5. **Rewrite** — apply suggested blocks and re-run.

## Prompt skeleton
```
npm run review -- prompts/system.md --tools tools.txt --min-grade=B --json
```

## Guardrails
A high grade means the prompt states the right defenses, not that a live model is unbreakable. Always red-team before production. Sister tool: github.com/aking-beep/prompt-reviewer.

## Tools
- **prompt-reviewer** (validator) — Static review. No model call.
- **ci** (api) — Fail the job when grade is below --min-grade.

## Example input
```json
{
  "prompt_path": "prompts/support-copilot.md",
  "min_grade": "B"
}
```

## Example output
```json
{
  "score": 48,
  "grade": "F",
  "gate": "fail",
  "top_gaps": [
    "No instruction priority",
    "Ambiguous 'be helpful'"
  ]
}
```
