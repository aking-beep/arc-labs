# ARC Skills

**A free, open library of production-ready agent skills.** Each entry is a self-contained `SKILL.md` — a clear trigger, a step list, and guardrails — written to drop straight into Claude, Cursor, or any agent runtime. No account, no lock-in.

Part of [ARC Labs](https://arc-website-pi-five.vercel.app/labs) · Live: https://arcskills.arctransformationgrouplab.dev

## What's inside
- **Browsable catalog** — search and filter skills by category and tag.
- **Per-skill detail pages** — statically generated, each linking back to its source file.
- **Read-only JSON API** — `GET /api/catalog`, no key required.
- **Open content repo** — every skill also lives as Markdown under `content/`.
- **CLI** — `npm run catalog` to search from the terminal.

## Quick start
```bash
npm install
npm run dev          # http://localhost:3000
npm run typecheck
npm run build
npm run catalog -- "review"   # search from the CLI
```

## API
```
GET /api/catalog                      # list all
GET /api/catalog?category=Engineering # filter by category
GET /api/catalog?slug=<slug>          # a single skill
```

## Using a skill
1. Open an entry and read **When to use** and **Guardrails** first.
2. Copy the section bodies into your system prompt, skill file, or tool description.
3. Keep the guardrails verbatim — they prevent the common failure modes.
4. Adapt the trigger phrases to how your users actually ask.

## Contributing
Add an entry to `lib/catalog/data.ts`, mirror it as Markdown under `content/`, and open a PR. See `HOWTO.md` for the full walkthrough.

## Tech
Next.js 15 (App Router) · TypeScript (strict) · Tailwind CSS. Deploys to Vercel. MIT licensed.

## License
MIT © 2026 ARC Transformation Group
