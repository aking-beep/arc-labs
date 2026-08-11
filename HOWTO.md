# How to use and extend ARC Skills

## Browse
- Web: open the site, search or filter by category, click into any skill.
- CLI: `npm run catalog`, `npm run catalog -- "<query>"`, or `npm run catalog -- --json`.
- API: `curl https://arcskills.arctransformationgrouplab.dev/api/catalog`.

## Apply a skill to your agent
1. Read the **When to use** and **Guardrails** sections first — they define scope and the failure modes to avoid.
2. Paste the section bodies into one of:
   - a Claude/Cursor `SKILL.md`,
   - your agent's system prompt,
   - a tool/function description.
3. Preserve guardrails word-for-word.
4. Rewrite the trigger phrases to match your users' real language.

## Add a new skill
1. Append a `CatalogItem` to `lib/catalog/data.ts`:
   - `slug` (kebab-case, unique), `title`, `category`, `summary`, `tags`, `updated`, optional `difficulty`.
   - `sections`: `When to use`, `What it does`, `Steps`, `Guardrails`.
   - `source`: the path to the mirrored Markdown file.
2. Create the mirror at `content/<category>/<slug>.md` with matching front-matter.
3. `npm run typecheck` — the static routes regenerate automatically.
4. Open a PR.

## Local development
```bash
npm install
npm run dev
```
The home page, detail pages, and API all read from `lib/catalog/data.ts`, so one edit updates every surface.
