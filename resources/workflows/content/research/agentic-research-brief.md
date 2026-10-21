---
title: Agentic Research Brief
category: Research
difficulty: advanced
tags: [agent, research, search, synthesis]
updated: 2026-08-11
hitl: true
stack: [LLM, search, citation store]
---

# Agentic Research Brief

A plan-search-synthesize agent loop that produces a cited research brief with an explicit confidence note.

## What it does
Answers an open research question by planning sub-questions, searching for each, and synthesizing a brief with citations and a stated confidence level. Flags where sources disagree instead of papering over it.

## Pipeline
1. **Plan** — decompose the question into 3–6 sub-questions.
2. **Search** — retrieve sources per sub-question (web, docs, or internal).
3. **Extract** — pull the relevant claim + citation from each source.
4. **Synthesize** — write the brief, citing every claim.
5. **Assess** — end with a confidence note and list unresolved conflicts.

## Guardrails
Every non-obvious claim must carry a citation. When sources conflict, present both and say so. Cap search depth and total tool calls to bound cost. State the confidence level explicitly so readers can calibrate.

## Tools
- **planner** (llm) — Decompose into 3-6 sub-questions.
- **search** (retriever) — Retrieve sources per sub-question.
- **synthesizer** (llm) — Write the brief with citations and a confidence note.
- **analyst** (human) — Accept or send back conflicts.

## Example input
```json
{
  "question": "Where does MCP conformance usually break in the wild?"
}
```

## Example output
```json
{
  "sub_questions": [
    "Handshake failures",
    "Tool schema drift",
    "Auth"
  ],
  "brief": "Public servers most often fail capability negotiation and tool schemas.",
  "confidence": "medium",
  "conflicts": []
}
```
