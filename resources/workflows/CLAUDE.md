# CLAUDE.md — AI Workflow Templates

Context for AI assistants working in this repo.

## What this is

An open catalog of end-to-end AI workflow templates. Every surface (home, detail pages, API, CLI, dry-run) is generated from `lib/catalog/data.ts`. There is **no access gate** — free and browsable without an account.

Most templates require a human in the loop before any external side effect. Do not strip that.

## Architecture

- `lib/catalog/config.ts` — product identity.
- `lib/catalog/data.ts` — `ITEMS: CatalogItem[]`; source of truth.
- `lib/catalog/validate.ts` — structural dry-run (required fields only).
- `lib/catalog/index.ts` — helpers: `getItem`, `allCategories`, `searchItems`.
- `app/page.tsx` — catalog home.
- `app/[slug]/page.tsx` — static detail pages (`dynamicParams = false`).
- `app/api/catalog/route.ts` — read-only JSON API.
- `app/api/dry-run/route.ts` — POST, no model call.
- `content/` — generated Markdown mirrors (`npm run sync-content`).

## Conventions

- Adding a template = one `CatalogItem` in `data.ts` + `npm run sync-content`.
- Sections: What it does, Pipeline, (optional) Prompt skeleton, Guardrails.
- Guardrails and HITL steps are load-bearing.
- Voice: no em-dashes. Plain, operator language. Never invent pricing or client facts in examples; synthetic is labeled synthetic.
- Keep the dependency set minimal.

## Checks

`npm test`, `npm run typecheck`, and `npm run build` must pass. CI runs all three on every PR.
