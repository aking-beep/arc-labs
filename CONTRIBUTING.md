# Contributing

Thank you for helping grow the catalog.

1. Fork and branch from `main`.
2. Add a `CatalogItem` to `lib/catalog/data.ts`. Required: What it does, Pipeline, Guardrails, `hitl`, `tools`, `requiredInput`, `example`.
3. Run `npm run sync-content` then `npm test && npm run typecheck`.
4. Open a PR. Describe the workflow, where you used it, and why the human gate is where it is.

Do not add templates that auto-send email, auto-pay, or overwrite a system of record without HITL.
