# CLAUDE.md — ARC Skills

Context for AI assistants working in this repo.

## What this is
An open catalog of agent skills. Every surface (home, detail pages, API, CLI) is generated from a single data source: `lib/catalog/data.ts`. There is **no access gate** — the catalog is free and browsable without an account.

## Architecture
- `lib/catalog/config.ts` — product identity (title, noun, repo, site, version).
- `lib/catalog/data.ts` — the `ITEMS: CatalogItem[]` array. This is the source of truth.
- `lib/catalog/index.ts` — helpers: `getItem`, `allCategories`, `allTags`, `searchItems`.
- `lib/catalog/types.ts` — shared `CatalogItem` / `CatalogConfig` types.
- `app/page.tsx` — server home: hero + `<Catalog>` + `<Subscribe>`.
- `app/[slug]/page.tsx` — static detail pages (`dynamicParams = false`, `generateStaticParams`).
- `app/api/catalog/route.ts` — read-only JSON API.
- `components/Markdown.tsx` — zero-dependency markdown-lite renderer.
- `content/` — human-readable mirror of each skill.

## Conventions
- Adding a skill = one `CatalogItem` in `data.ts` + one mirror file in `content/`.
- Keep `sections` to: When to use, What it does, Steps, Guardrails.
- Slugs are kebab-case and unique; they become the URL and static route.
- No new runtime dependencies without a strong reason — the stack is deliberately minimal.

## Checks
`npm run typecheck` and `npm run build` must pass. CI runs both on every PR.
