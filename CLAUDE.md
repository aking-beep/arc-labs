# CLAUDE.md — ARC Skills

Context for AI assistants working in this repo.

## What this is

An open catalog of Agent Skills. **Source of truth is `skills/<slug>/SKILL.md`**, not a TypeScript array. The UI, API, and CLI all load from that directory. There is **no access gate** — the catalog is free and browsable without an account.

## Architecture

- `skills/` — one directory per skill; `name` in frontmatter must match the directory.
- `lib/skills/parse.ts` — YAML frontmatter + spec validation.
- `lib/skills/load.ts` — filesystem loader (snapshot fallback for serverless).
- `lib/catalog/config.ts` — product identity.
- `app/page.tsx` — hero + `<Catalog>` + optional subscribe.
- `app/[slug]/page.tsx` — static detail pages + copy/download.
- `app/api/catalog/route.ts` — JSON or raw markdown.
- `cli/validate.ts` — CI gate (`## Guardrails` required).

## Conventions

- Follow https://agentskills.io/specification (`name`, `description` constraints).
- `metadata` keys are strings; `tags` is comma-separated; `difficulty` is starter | intermediate | advanced.
- Do not publish client names, private paths, or secrets.
- Generalized ARC operating procedures are welcome; internal routing and Drive paths are not.

## Checks

`npm run validate`, `npm run typecheck`, and `npm run build` must pass.
