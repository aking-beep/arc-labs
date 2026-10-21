# AI Fit canonical code, and extracting AI Fit Teams from ARK

**Date:** 2026-10-21 · **Author:** aking · **Confidence:** medium

## The question

AI Fit exists twice: the standalone [aifit-engine](https://github.com/aking-beep/aifit-engine)
repo (public name "Fit") and the copy inside the [ark](https://github.com/aking-beep/ark) monorepo
(`my-ai/` Python API on :8472 plus `apps/consumer` on :3000). AI Fit Teams (`apps/business`, :3001)
also lives in ark and reads ARK Control's `GET /api/v1/calibration`. Which AI Fit copy is canonical,
and what does it take to move AI Fit Teams next to it without breaking the calibration contract?

## What we found

**Same codebase, forked both ways after 2026-09-14.** ark's `06f0926` (2026-09-14, "three surfaces,
one engine") brought in aifit-engine; `fea99da` (2026-09-15) renamed `fit/` to `my-ai/` and the Python
package from `aifit` to `myai`. `my-ai/README.md` and `docs/06-aifit-consumer.md` in ark both point to
aifit-engine as upstream. The two trees are the same file for file: 17 identical Python module names
under `packages/core/src/{aifit,myai}`, the same 23 FastAPI routes in `services/api/main.py`, and the
same `data/scenarios/scenarios.json` (8 scenarios, byte-identical). After normalizing the rename,
`events/persona/registry/scenarios.py` are identical. `fit.py` (97 lines changed), `metrics.py` (103) and
`engine.py` (79) have moved apart.

**What changed in each.** The local clone of aifit-engine is shallow: one commit, `5c4fd0c` on 2026-10-10,
"Merge PR #19: notes in scoring, session tokens, durable store, fair ranking". Its earlier history is
not visible locally. ark has 235 commits; the newest on AI Fit paths are on 2026-10-11 (`cc45ec6`,
`98c31b8`, API hardening) and 2026-10-19 (`a7b941e`, `vercel.consumer.json` renamed to `vercel.json`).

| | aifit-engine (standalone) | ark `my-ai/` + `apps/consumer` |
|---|---|---|
| Last change | 2026-10-10 | 2026-10-19 |
| Python tests (run today) | **35 pass** | **74 pass** |
| Eval harness `validate-seed` / `run-cases` | 16 products, 4 models / 3 cases pass | 23 products, 9 models / 3 cases pass |
| Registry (`data/registry/*.json`) | v0.3, all `last_evaluated_at` 2026-09-12 | v0.3 rows from 2026-09-12 plus 7 products and 5 models at v0.4 dated 2026-09-16 (DeepSeek, Grok, Copilot, Meta AI, GitHub Copilot, LM Studio, Le Chat; Qwen 3, DeepSeek-R1, Llama 3.1, Gemma 3, gpt-oss 20B) |
| Scoring fix for signals never shown | `ABSENCE_STRENGTH` constant (`test_review_fixes.py`) | share of opportunities, with `OPPOSING_METRICS` netting (`test_metrics.py`, 12 tests, `docs/SCORING_SPEC.md`) |
| API protection | per-session tokens (36 references in `main.py`), UUID ids, store TTL | UUID and path-traversal checks, 413 body limit, string and list caps, per-client and global rate limits (`test_api_hardening.py`, 13 tests); **no session tokens** |
| Web extras | `src/lib/share-snapshot.ts`, `e2e/share-and-filters.spec.ts`, `.env.example` | `/v1/[...path]` proxy (`src/lib/my-ai-proxy.ts`), `/health` route, 26 node unit tests (pass), `PRODUCT.md` |
| CI | `.github/workflows/ci.yml`: ruff, pytest, evals, web lint/tsc/build, **Playwright e2e** | ark `ci.yml` `my-ai-python` job (pytest + evals) and the full build; **no e2e job** |
| Packaging | `aifit` 0.4.0, AGENTS/CLAUDE/CONTRIBUTING docs | `myai` 0.3.0 |
| `vercel.json` | services `web` = `apps/web`, `api` = repo root FastAPI | the same file with `web` = `apps/consumer` and `api` = `my-ai` |

The quiz flow (`/assessment` leading to `/results/[sessionId]` and `/share/[shareId]`) and setup-file
generation (`exports.py`, which writes `json`, `profile`, `routing`, `chatgpt`, `gemini`, `claude` and a
Cursor rule) exist in both copies. They differ only in naming: ark writes `.cursor/rules/my-ai.mdc`
with "AI Fit" copy, and the standalone writes `.cursor/rules/fit.mdc` with "Fit" copy. Both registries
are past the engine's own `FRESHNESS_THRESHOLD_DAYS = 30` as of today (35 and 39 days). ark's weekly
`refresh-models.yml` audits only the TypeScript `@ark/core` model catalog. It does not cover the Python
registry.

**Deployment status.** The Vercel team has four relevant projects. `aifit-engine` was created on
2026-09-05 and last updated on 2026-10-10. `ark-ai-fit-teams`, `ark-ai-fit` and `ark-control` were all
created on 2026-10-19 between 08:18 and 09:09 UTC. I could not read deployment state: the Vercel API
returned 403 for this scope. ark's root `vercel.json` describes only the AI Fit (consumer + API) build.
There is no Vercel config for `apps/business`, so the `ark-ai-fit-teams` project's root directory and
settings live only in the Vercel dashboard. `deploy/docker-compose.yml` runs all four ark processes
together, with `ARK_CONTROL_URL=http://127.0.0.1:3002`.

**AI Fit Teams dependencies.** These come from `apps/business/package.json` and its imports.
- `@ark/core` (6,067 lines of source; dependencies `zod` and `@noble/hashes`). Teams uses `assess`,
  `Workload`, `Verdict`, `TaskShape`, `DataClass`, `estimateTokens`, `DETERMINISTIC_SHAPES`,
  `ASSESS_API_LIMITS`, `CALL_SHAPE`, `PATTERN_LABEL`, `SUITABILITY_RUBRIC`, `Pattern`, `urlCodec`,
  `encodeForUrlClient`, `fetchCalibration`, and the fixtures `SUPPORT_TRIAGE` and `INVOICE_LOOKUP`.
- `@ark/ui` (567 lines): `Panel`, `Badge`, `BasisTag`, `Callout`, `DimensionList`, `CardTable`, and
  `@ark/ui/tailwind-preset` in `tailwind.config.cjs`, which also scans `../../packages/ui/src`.
- `@ark/runtime` (1,011 lines; it pulls in `@ark/sdk`, `@ark/providers` and `@ark/evals`). Only
  `src/lib/measure.ts` uses it, for the opt-in "measure a sample" feature (`ARK_MEASURE_ENABLED=1`,
  `ARK_OLLAMA_MODEL`/`ARK_OLLAMA_URL`).
- `@ark/sdk` and `@ark/providers` are imported by `src/lib/measure.test.ts` but are not declared in
  `package.json`. They resolve only through the workspace.
- Teams does **not** depend on `@ark/db`, and its `next.config.mjs` says so on purpose. It extends
  `../../tsconfig.base.json`. Its tests run from ark's root `npm test`. Today 21 of 22 pass; the
  failure is `measure.test.ts`, because `@ark/providers` and `@ark/runtime` are not built locally. That
  is an environment gap, not a code defect.

**Teams and Control talk over two wires, not one.** The README says the only runtime wire is
`GET /api/v1/calibration`. In code there are two:
1. **Calibration (read).** `packages/core/src/calibration/client.ts` `fetchCalibration({days:30})` sends
   `GET ${ARK_CONTROL_URL}/api/v1/calibration?days=30` with `accept: application/json` and an optional
   `Authorization: Bearer ${ARK_CONTROL_TOKEN}`. It times out at 2.5 s. It returns `null`, never throws
   and never applies a partial result, on any of: no URL, timeout, non-200, or failed
   `CalibrationSet.safeParse`. Callers are `apps/business/src/app/report/page.tsx:104` and
   `src/app/api/assess/route.ts:46`. The schema in `packages/core/src/calibration/priors.ts` is
   `CalibrationSet = { basis: 'measured'|'calibrated', generatedAt: string, windowDays: number,
   orgId?: string, patterns: PatternPrior[], buildCostActualsUsd?: Record<string,number> }`.
   `PatternPrior` is `{ pattern, turnsPerOutcome, contextGrowthPerTurn, failureRate, retriesPerFailure,
   cacheHitRate, costPerOutcomeUsd?, sampleSize, p95TurnsPerOutcome? }`. The server side is
   `apps/control/src/app/api/v1/calibration/route.ts`. It takes the org from the bearer token or the
   session cookie (otherwise 401), clamps `days` to 1–365 (`parseDays` in `src/lib/guards.ts`), and
   calls `calibration()` in `packages/db/src/queries.ts:624`. That function returns `measured` when the
   org has at least 30 own traces. Otherwise it returns fleet `calibrated` data when 3 or more other orgs
   contribute (`FLEET_MIN_SOURCE_ORGS`), and the thin own set if not. The route writes at most one
   snapshot per org per minute and sends `cache-control: private, max-age=60`. Control builds the set
   with `buildCalibration` from the **same** `@ark/core` module that Teams parses it with.
2. **Labels.** `Basis` in `packages/core/src/schema/provenance.ts` is ordered
   `heuristic < benchmark < calibrated < measured`. `resolveCallShape` ignores any pattern below
   `minSample = 30`, and `withPriorBasis` caps a derived cost at `calibrated`, never `measured`. Tests:
   `packages/core/src/engine.test.ts:122-140`, `review-fixes.test.ts:349` (no `org` query parameter),
   and `packages/db/src/tenancy.test.ts:246`.
3. **Ingest (write, opt-in).** In measure mode, `packages/runtime/src/telemetry.ts` `ingestFromEnv`
   builds an `ArkIngest` (`packages/sdk/src/index.ts:175`) that posts to
   `${ARK_CONTROL_URL}/api/v1/events` with `ARK_CONTROL_TOKEN` and `ARK_ORG_ID`, under workload ids
   prefixed `teams_sample_`.

## What it implies for Labs

**Canonical AI Fit code: ark's `my-ai/` + `apps/consumer`.** It is newer (2026-10-19), has twice the
Python tests, has the v0.4 registry, has the specified opportunity-based scoring and the hardened API,
and it is what the new `ark-ai-fit` Vercel project builds. The **home** for it should be
[aifit-engine](https://github.com/aking-beep/aifit-engine), with ark's tree landed on top of it, because
ark is Control's repo. Port these from the standalone, in this order:
1. Session tokens and the token-adoption rule from PR #19, with `tests/test_review_fixes.py` re-run
   against ark's scoring. Keep any test that still describes intended behaviour.
2. `apps/web/src/lib/share-snapshot.ts` and `e2e/share-and-filters.spec.ts`.
3. The Playwright e2e CI job and `.env.example`.
4. The `aifit` package name, renaming back from `myai` (CLI `aifit`, env `AIFIT_ROOT`).

Before the next release, re-review the registry (`docs/REGISTRY_SEED_REVIEW.md`); both copies are past
30 days.

**Target layout (one AI Fit repo, two deployments):**
```
aifit-engine/
  services/api/            FastAPI (from ark my-ai/services)       -> Vercel "ark-ai-fit" service api
  packages/core/src/aifit/ Python engine (myai renamed to aifit)
  data/ evals/ tests/      registry, scenarios, eval cases, pytest
  apps/web/                AI Fit consumer (from ark apps/consumer) -> Vercel "ark-ai-fit" service web
  apps/teams/              AI Fit Teams (from ark apps/business)    -> Vercel "ark-ai-fit-teams", root apps/teams
  packages/teams-core/     Teams' slice of @ark/core (assess, schema/provenance, url-codec, models)
  packages/ui/             copy of @ark/ui + tailwind-preset
  contracts/calibration/   fixture JSON for CalibrationSet (shared with Control)
  vercel.json              unchanged two-service config for AI Fit only
```
Keep the rule that consumer and Teams do not link to each other (`docs/06-aifit-consumer.md`). Use an
npm workspace for `apps/teams` and `packages/*` only; the Python side stays pip.

**Extraction checklist for AI Fit Teams (in order):**
1. **Freeze the contract first.** In ark, move `CalibrationSet`/`PatternPrior` into a small published
   package, for example `@arc/calibration-contract` on GitHub Packages, or export a JSON Schema from
   `priors.ts`. Commit fixture responses for `measured`, `calibrated`, a below-floor pattern and a 401.
   Add a Control-side route test that does not exist today. Control keeps `buildCalibration`; Teams
   keeps `fetchCalibration`/`resolveCallShape`/`withPriorBasis`; both parse against the same schema version.
2. Copy `apps/business` to `apps/teams` with git history (`git filter-repo --path apps/business`).
   Declare `@ark/sdk` and `@ark/providers` as dev dependencies, or drop them.
3. Vendor what Teams imports from `@ark/core` into `packages/teams-core`, including
   `calibration/client.ts` and `priors.ts` (or import the contract package), with
   `engine.test.ts` and `review-fixes.test.ts`. Use `tsc` to prune unused modules (`governance`,
   `agents`, `ingest`).
4. Vendor `@ark/ui` and its tailwind preset. Fix the `content` glob and `tsconfig` `extends`.
5. Decide measure mode. Recommendation: ship the extraction with `ARK_MEASURE_ENABLED` unset, and stub
   `measure.ts` behind the existing `disabled` response. Re-add it later through a published
   `@ark/runtime`, so the `POST /api/v1/events` wire is either carried explicitly or removed. Never
   carry it silently.
6. Carry the environment variables: `ARK_CONTROL_URL`, `ARK_CONTROL_TOKEN`, `ARK_TRUSTED_PROXY_HOPS`,
   plus the measure variables if kept. Issue Teams a Control ingest/read token per org.
7. Port the three test files into the new repo's CI next to the contract-fixture test. Add a check
   that, with `ARK_CONTROL_URL` unset, every figure reads `heuristic`.
8. Point the existing `ark-ai-fit-teams` Vercel project at the new repo with root `apps/teams`. Smoke-test
   against `ark-control`: confirm a 401 without a token, `calibrated` or `measured` with one, and a
   report that still renders when Control is down.
9. Only then delete `apps/business` from ark, update ark's `README.md` and `docs/08-how-ark-works.md`,
   and change the README's "only runtime wire" sentence to match what the code does.

## What we still do not know

- aifit-engine's history before 2026-10-10. The clone is shallow, so the shared-ancestor commit and
  any standalone work between 09-14 and 10-10 other than PR #19 are inferred from diffs, not from logs.
- Whether any Vercel deployment is live, and on which domain: the deployment API returned 403. We also
  do not know the `ark-ai-fit-teams` root-directory setting, or whether the `aifit-engine` project
  still serves traffic.
- Which absent-signal scoring is right for users. Both pass their own tests. Nobody has compared them
  on the eval cases with a rubric that separates them.
- Whether Control will publish its contract as a package or as a JSON Schema. That is Control's
  decision, not Labs'.
- Whether `measure.test.ts` passes once ark's packages are built (not run here).
