---
title: Structured Data Extraction
category: Extraction
difficulty: advanced
tags: [extraction, json, schema, validation]
updated: 2026-08-11
hitl: true
stack: [LLM, Zod / JSON Schema]
---

# Structured Data Extraction

Extract a validated JSON object from messy text (invoices, resumes, forms) with a schema and a bounded repair loop.

## What it does
Pulls structured fields out of unstructured documents and guarantees the output matches a schema. The model emits JSON; a validator checks it; on failure the errors are fed back for a bounded repair attempt.

## Pipeline
1. **Define** — a strict schema (types, required fields, enums).
2. **Extract** — prompt the model to emit JSON matching the schema.
3. **Validate** — parse against the schema (e.g. Zod / JSON Schema).
4. **Repair** — on validation error, return the errors to the model for up to 2 retries.
5. **Escalate** — after retries fail, flag for human review with the raw output attached.

## Guardrails
Never accept unvalidated output downstream. Cap repair retries to avoid loops and cost blowups. For low-confidence fields (e.g. a total that doesn't reconcile), mark them `needs_review` rather than passing a bad value through.

## Tools
- **extract-model** (llm) — Emit JSON matching the schema.
- **validator** (validator) — Parse against Zod / JSON Schema.
- **repair** (llm) — At most two retries with validator errors.
- **reviewer** (human) — Handle needs_review fields after retries fail.

## Example input
```json
{
  "document_text": "Invoice 1841 · Acme · July 2026 · $1,200",
  "schema_name": "invoice"
}
```

## Example output
```json
{
  "invoice_id": "1841",
  "vendor": "Acme",
  "period": "2026-07",
  "amount": 1200,
  "needs_review": []
}
```
