# Resources

**ARC's free, public resource libraries.** Reusable knowledge first, applications second.

| Library | Directory | Was | Check |
| --- | --- | --- | --- |
| ARC Skills | [`skills/`](./skills/) | `aking-beep/arc-skills` | `npm run validate` |
| AI Workflow Templates | [`workflows/`](./workflows/) | `aking-beep/ai-workflow-templates` | `npm test` |
| Reference Architectures | [`architectures/`](./architectures/) | `aking-beep/reference-architectures` | `npm run typecheck` |

Each library was imported with `git subtree`, so its full history is here. Each stays an
independently deployable Next.js app: its own `package.json`, its own lockfile, its own
Vercel project. Nothing is shared between them until it is needed a second time.

Why these live in Labs at all is the
[charter's one exception](../docs/LABS_CHARTER.md#the-one-exception-maintained-public-resource-libraries).

## Moving a library's deployment here

The source repositories are still live. Archive one only after all of these hold:

1. Its Vercel project's Git repository is `aking-beep/arc-labs` and its **Root Directory**
   is `resources/<library>`, with the same environment variables.
2. A production deploy from here serves the existing domain, catalog pages,
   `GET /api/catalog` and install links unchanged.
3. The source repository's README points here, and the repository is archived (not deleted),
   so old links still open.

## Working on a library

```bash
cd resources/skills
npm ci
npm run dev
```

CI runs typecheck, the library's own check and a build for each one
(`.github/workflows/validate.yml`).
