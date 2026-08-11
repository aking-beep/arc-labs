# How to use and extend ARC Skills

## Browse

- Web: search or filter by category, open a skill, copy or download `SKILL.md`.
- CLI: `npm run catalog`, `npm run catalog -- "<query>"`, `npm run catalog -- --json`.
- API: `curl https://arc-skills-phi.vercel.app/api/catalog`.

## Apply a skill to your agent

1. Read **When to use** and **Guardrails** first.
2. Copy `SKILL.md` into:
   - Cursor personal: `~/.cursor/skills/<slug>/SKILL.md`
   - Cursor project: `.cursor/skills/<slug>/SKILL.md`
   - Claude Code: `.claude/skills/<slug>/SKILL.md`
   - or paste sections into a system prompt / tool description.
3. Keep guardrails word-for-word.
4. Rewrite trigger phrases to match your users.

## Add a new skill

See `CONTRIBUTING.md`. Short version:

1. Create `skills/<slug>/SKILL.md` with spec-compliant frontmatter.
2. Include `## Guardrails`.
3. `npm run validate && npm run typecheck`.
4. Open a PR.

The catalog, detail pages, and API all read from `skills/` — there is no second data file to update.
