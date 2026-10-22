---
name: prompt-ship-review
description: Review a system prompt against a ship bar for clarity, structure, ambiguity, injection surface, and named failure modes. Use when asked if a prompt is ready to ship, to review a system prompt, or to score injection surface and rewrites.
license: MIT
compatibility: Cursor, Claude Code, and any runtime that loads Agent Skills (SKILL.md). Pair with ARC Labs Prompt Reviewer for the scored report.
metadata:
  author: ARC Transformation Group
  version: "1.0"
  category: Engineering
  difficulty: intermediate
  tags: prompts,injection,clarity,agents,security
  updated: "2026-08-11"
---

# Prompt Ship Review

## When to use

A system prompt (optionally with a tool list) needs a structured review before production. Triggers: `is this prompt ready`, `review this system prompt`, `check injection surface`.

## What it does

Scores the prompt against a fixed rubric and returns concrete rewrites. Aligns with ARC Labs Prompt Reviewer: clarity/structure, ambiguity phrases, OWASP LLM01-aligned injection surface, named failure modes, tool policy.

## Steps

1. Check for a clear **contract**: role, objective, must / never rules.
2. Check **structure**: sections or delimiters so instructions and untrusted data do not blur.
3. List **weasel phrases** ("be helpful", "when needed", "use your judgment") with a replacement for each.
4. Check **injection surface**: instruction priority, trust boundary, untrusted-data framing, no secrets in-prompt.
5. Name **failure modes**: refuse, clarify-or-stop, human gate for high-impact tools.
6. If tools are present, require scoped descriptions and a gate on destructive actions.
7. Emit letter-grade style findings plus paste-ready rewrite blocks.

## Output

- Overall: ship / ship-with-fixes / do-not-ship
- Findings table: check, status (pass/warn/fail), evidence, rewrite
- Failure modes: covered vs gap
- One rewritten prompt skeleton if the original is salvageable

## Guardrails

Scoring is heuristic. A high grade means the prompt *states* the right defenses, not that a live model is unbreakable. Never invent tool behavior that is not in the tool list. Do not put secrets, API keys, or production credentials into the rewritten prompt.
