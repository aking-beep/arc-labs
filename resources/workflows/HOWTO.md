# How to use and extend AI Workflow Templates

## Browse

- Web: search or filter by category, open any template.
- CLI: `npm run catalog`, `npm run catalog -- "<query>"`, `npm run catalog -- --json`.
- API: `curl https://aiworkflowtemplates.arctransformationgrouplab.dev/api/catalog`.

## Run a template

1. Read **What it does**, **Pipeline**, and **Guardrails**. The guardrails are the safe operating envelope.
2. Copy the prompt skeleton into your agent runtime or codebase.
3. Wire the named tools (vector store, CRM API, email queue, evidence store) to your own accounts.
4. Keep human-in-the-loop steps intact. Templates that say HITL never auto-send, auto-pay, or auto-write.
5. Use **Structural dry-run** on the detail page (or `POST /api/dry-run`) to check required fields. No model is called.

## Add a new template

1. Append a `CatalogItem` to `lib/catalog/data.ts` with:
   - sections: What it does, Pipeline, (optional) Prompt skeleton, Guardrails
   - `hitl`, `stack`, `tools`, `requiredInput`, `example`
2. `npm run sync-content` to write the Markdown mirror under `content/`.
3. `npm test && npm run typecheck`.
4. Open a PR.

## Local development

```bash
npm install
npm run dev
npm test
```

Home, detail pages, API, CLI, and dry-run all read from `lib/catalog/data.ts`.

## Sources

Templates in 0.1 were distilled from ARC Google Drive materials:

- Operator AI master spec and prompts (daily brief, extraction, SOW, RFP, assessment)
- ARC Master Blueprint Labs list (SOW Generator Lite, RAG Readiness Checker)
- ARC product portfolio register (KickoffPilot, ClearDesk, FieldNote patterns)
- Sister Labs tools (Prompt Reviewer, MCP Conformance Scanner)
