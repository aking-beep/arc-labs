---
title: Content Repurposing Chain
category: Content
difficulty: starter
tags: [content, marketing, repurposing, chain]
updated: 2026-08-11
hitl: true
stack: [LLM]
---

# Content Repurposing Chain

Turn one long-form source into channel-native derivatives: thread, newsletter blurb, and executive summary. No new claims.

## What it does
Takes one canonical piece (a post, doc, or talk transcript) and produces several channel-specific versions that stay faithful to the source: a short social thread, a newsletter blurb, and a one-paragraph executive summary.

## Pipeline
1. **Extract** — pull the core thesis and 3–5 supporting points.
2. **Fan out** — generate each derivative from the extracted skeleton, not from each other (avoids drift).
3. **Constrain** — apply per-channel length and tone limits.
4. **Check** — verify every derivative's claims trace back to the source.

## Guardrails
Generate each format from the shared skeleton, never by re-summarizing a summary. No new claims may appear that are not in the source. Keep links and attributions intact.

## Tools
- **extractor** (llm) — Thesis + 3-5 supporting points from the source only.
- **fan-out** (llm) — Generate each derivative from the skeleton, not from each other.
- **claim-check** (validator) — Reject claims that are not in the source.
- **editor** (human) — Approve before publish.

## Example input
```json
{
  "source_text": "ARC Labs ships free operator tools. Prompt Reviewer scores system prompts. No model call."
}
```

## Example output
```json
{
  "skeleton": {
    "thesis": "ARC Labs ships free operator tools",
    "points": [
      "Prompt Reviewer scores prompts",
      "No model call"
    ]
  },
  "thread": [
    "ARC Labs ships free operator tools.",
    "Prompt Reviewer scores system prompts. No model call."
  ],
  "newsletter": "New from ARC Labs: Prompt Reviewer. Paste a system prompt, get a score. No model call."
}
```
