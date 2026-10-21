# Contributing to ARC Skills

Thank you. This catalog stays useful only if every skill is something an operator would actually load.

## Add a skill

1. Create `skills/<slug>/SKILL.md`. The directory name **must** match the `name` field.
2. Follow the [Agent Skills spec](https://agentskills.io/specification):
   - `name`: lowercase, numbers, hyphens; 1–64 chars; no leading/trailing hyphen
   - `description`: what it does **and** when to use it; 1–1024 chars
3. Include these sections in the body:
   - `# Title`
   - `## When to use`
   - `## What it does`
   - `## Steps`
   - `## Output`
   - `## Guardrails` (required — CI fails without it)
4. Fill `metadata` with `category`, `difficulty` (`starter` | `intermediate` | `advanced`), `tags` (comma-separated), `updated` (ISO date), `author`, `version`.
5. Run:

```bash
npm run validate
npm run typecheck
npm run build
```

6. Open a PR. One skill per PR unless they are a tightly coupled pair.

## What we will not merge

- Skills that invent owners, dates, or facts the input did not contain.
- Skills that skip guardrails or tell the agent to hide uncertainty.
- Client names, private paths, credentials, or ARC-internal routing.
- Vague “be helpful” prompts with no steps and no failure modes.

## License

Contributions are accepted under the MIT license of this repository.
