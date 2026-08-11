---
title: RAG Readiness Checker
category: Retrieval
difficulty: starter
tags: [rag, readiness, governance, checklist]
updated: 2026-08-11
hitl: true
stack: [checklist, optional LLM]
---

# RAG Readiness Checker

Score whether a corpus is ready for RAG before you embed it: rights, freshness, structure, PII, and eval questions.

## What it does
Answers 'should we even embed this?' before a RAG project starts. Scores rights, freshness, structure, PII, and whether you have gold questions to eval against. Listed as a free ARC Labs utility in the Master Blueprint.

## Pipeline
1. **Inventory** — sources, owners, dates, access.
2. **Score** — rights, freshness, structure, PII, eval coverage (0-100).
3. **Blockers** — name what would make retrieval unsafe or useless.
4. **Next** — the smallest set of fixes before ingest.
5. **Gate** — do not embed until blockers are cleared or explicitly accepted.

## Prompt skeleton
```
Score this corpus for RAG readiness on five axes (0-20 each):
rights, freshness, structure, PII handling, eval coverage.
Return JSON: { score, grade, axes, blockers[], next[] }.
Do not recommend embedding if rights or PII are unknown.
```

## Guardrails
Unknown PII or unknown rights is a blocker, not a warning. Do not treat a shared-drive dump as a knowledge base. Human accepts residual risk in writing.

## Tools
- **corpus-inventory** (api) — List sources, owners, last-updated, access rights.
- **readiness-model** (llm) — Score each axis and name the blocking gaps.
- **owner-review** (human) — Confirm rights and PII before anything is embedded.

## Example input
```json
{
  "corpus_inventory": [
    {
      "name": "Q3 board deck",
      "owner": "CFO",
      "last_updated": "2025-11-01",
      "rights": "internal",
      "pii": "unknown"
    }
  ]
}
```

## Example output
```json
{
  "score": 42,
  "grade": "D",
  "blockers": [
    "PII unknown",
    "Stale by > 6 months",
    "No gold questions for eval"
  ],
  "next": [
    "Classify PII",
    "Drop or refresh stale decks",
    "Write 10 gold Q&A pairs"
  ]
}
```
