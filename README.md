# ARC Skills

**ARC Labs 0.2** — Free · Open Source · Community Project

A free, open library of production-ready **agent skills**. Each package is a directory with a `SKILL.md` that follows the [Agent Skills specification](https://agentskills.io/specification) — YAML frontmatter (`name`, `description`) plus steps and guardrails you can drop into Claude, Cursor, or any compatible runtime.

Repo: https://github.com/aking-beep/arc-skills
Live: https://arcskills.arctransformationgrouplab.dev
Labs: https://arc-website-pi-five.vercel.app/labs/arc-skills
Drive home: `ARC Transformation/ARC Labs (Free)/arc-skills`

Sister tools: [MCP Conformance Scanner](https://github.com/aking-beep/mcp-conformance-scanner) · [Prompt Reviewer](https://github.com/aking-beep/prompt-reviewer)

---

## What's inside

- **20 operator skills** across Engineering, Operations, Productivity, Support, Quality, Growth, Architecture, Data, DevOps, Security, Delivery, and AI — drawn from ARC Labs tools and the same operating procedures ARC uses on delivery work (generalized, no client data).
- **Browsable catalog** — search and filter by category and tag.
- **Copy / download** `SKILL.md` with Cursor and Claude install paths.
- **Read-only API** — `GET /api/catalog`, plus `?format=raw` for the markdown.
- **CLI** — `npm run catalog` and `npm run validate`.

No account required to browse or copy. Optional email capture is only for update notifications.

## Quick start

```bash
npm install
npm run validate
npm run dev          # http://localhost:3000
npm run catalog -- "review"
```

### Install a skill in Cursor

```bash
mkdir -p ~/.cursor/skills/pr-review-summary
curl -s "https://arcskills.arctransformationgrouplab.dev/api/catalog?slug=pr-review-summary&format=raw" \
  > ~/.cursor/skills/pr-review-summary/SKILL.md
```

Project-scoped: `.cursor/skills/<slug>/SKILL.md`. Claude Code: `.claude/skills/<slug>/SKILL.md`.

## API

```
GET /api/catalog
GET /api/catalog?category=Engineering
GET /api/catalog?q=incident
GET /api/catalog?slug=pr-review-summary
GET /api/catalog?slug=pr-review-summary&format=raw
```

## Layout

```
skills/<slug>/SKILL.md   # source of truth (Agent Skills spec)
app/                     # Next.js catalog UI
lib/skills/              # parser, loader, types
cli/                     # catalog + validate + snapshot
```

## Deploy

Import the GitHub repo in Vercel. Framework: Next.js. No env vars required for the catalog. Optional: `EMAIL_CAPTURE_WEBHOOK_URL` / `LEAD_WEBHOOK_URL`, Upstash for rate limits.

## License

MIT © 2026 ARC Transformation Group
