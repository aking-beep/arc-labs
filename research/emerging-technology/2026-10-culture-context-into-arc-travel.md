# Merging Culture Context into ARC Travel: feature parity

**Date:** 2026-10-21 · **Author:** aking · **Confidence:** medium

## The question

[`portfolio/products.yaml`](../../portfolio/products.yaml) says
[culture-context](https://github.com/aking-beep/culture-context) should merge into
[arc-travel](https://github.com/aking-beep/arc-travel) as a cultural-context module, and
that culture-context gets archived only once its functionality and tests are preserved
there. This note covers four things: what culture-context actually does in code (not
just in its docs), what arc-travel already has, how to bridge Python FastAPI and
TypeScript Next.js, and what has to be true before archiving.

Paths below are relative to the repo they name. `cc:` is culture-context at `f4aa71f`
(its only commit) and `at:` is arc-travel at `1c48dbe`.

## What we found

**1. The culture-context repo is a flattened, partial upload.** `cc:MANIFEST.json` lists
138 files. Git tracks 91. The upload flattened the directory tree: `docs/*`, `factory/*`
and `packages/*` now sit at the root, and `cc:README.md` is really the old
`infrastructure/README.md`. Several things are missing outright:
`apps/web` (including `apps/web/src/app/api/brief/route.ts` and `api/explain/route.ts`),
all of `apps/mobile` (the Expo app), `.github/workflows/ci.yml`, `evals/README.md` and
`data/README.md`. `cc:src/app/page.tsx` is the old `apps/admin` scaffold: a static page
with hard-coded zero counts. The flattening breaks the build. The root `package.json`
workspaces (`apps/*`, `packages/*`) match nothing, so `npm test`, `npm run typecheck` and
`dev:web` cannot run. `cc:docker-compose.yml` builds `../services/api`, which no longer
resolves. There is one commit on one branch, so this clone cannot recover the missing
files.

**2. Implemented in code (about 300 lines of Python, plus TS types).**

- `POST /v1/brief` and `GET /health`: `cc:services/api/culture_context/api.py`.
- Pydantic models for `TravelerProfile`, `SourceRef`, `RuleRecord`, `BriefItem` and
  `BriefResponse`, with a six-value `SourceClass` and a six-value `RuleKind`:
  `cc:services/api/culture_context/models.py`. These are mirrored in Zod in
  `cc:domain/src/index.ts`.
- A GOV.UK FCDO Content API adapter: `cc:services/api/culture_context/sources/govuk.py`.
  It fetches one slug, takes a SHA-256 of the payload, and picks the entry,
  laws-customs and safety sections. It always emits `kind=advisory`, never `law`, and it
  keyword-tags activities.
- Deterministic applicability: `cc:services/api/culture_context/applicability.py`. A
  record must match on jurisdiction, then any activity, purpose and nationality tags, and
  each match is returned as a reason string.
- The brief service: `cc:services/api/culture_context/service.py`. It degrades to a
  warning when the source is down rather than filling the gap, and it always adds a
  "coverage is partial" warning.
- Snapshot hashing and change detection, in three places:
  `cc:services/api/culture_context/change.py`, `cc:services/worker/culture_worker/change.py`
  (a duplicate) and a CLI that writes snapshot JSON to disk
  (`cc:services/ingestion/culture_ingestion/run.py`).
- A TS SDK client (`cc:sdk/src/index.ts`), a TS source contract
  (`cc:source-contracts/src/index.ts`) and design tokens (`cc:ui/src/index.ts`).
- `cc:services/api/culture_context/source_registry.py` lists four sources, but only
  GOV.UK has an adapter.

**3. Specified only in docs.** Postgres tables (`sources`, `source_snapshots`, `rules`,
`changes`, `verification_events` and others), the `ChangeRecord` lifecycle with
materiality and a reviewer, `effective_from`/`to`, the verification status on rules, the
home-vs-destination comparison, the optional AI explanation, saved trips, subscriptions,
the State Dept, GDACS, ReliefWeb, REST Countries, Frankfurter and Open-Meteo adapters,
first-party primary-law adapters, push, offline mode and the B2B API. See
`cc:ARCHITECTURE.md`, `cc:DATA_MODEL.md`, `cc:API_SOURCES.md`, `cc:BUILD_SEQUENCE.md` and
`cc:ROADMAP.md`. The doctrine lives in `cc:SOURCE_POLICY.md`, `cc:SOURCE_GOVERNANCE.md`
and `cc:PROJECT.md`, and it is the most valuable part of the repo: a provenance ladder;
`government_advisory` never promoted to `law`; a hash change opens a review but never
publishes anything; "we could not verify this" instead of model knowledge. The only eval
is `cc:no-fabrication.jsonl`, two cases with no runner.

**4. Tests.** I ran them in a scratch venv (Python 3.13, FastAPI, Pydantic 2, httpx,
pytest 8) and all **6 passed in 0.16s**:

| Test file | Covers |
| --- | --- |
| `cc:services/api/tests/test_applicability.py` | Activity match, wrong jurisdiction |
| `cc:services/api/tests/test_change.py` | Deterministic hash, cross-source refusal |
| `cc:services/ingestion/tests/test_stable_text.py` | Key-order independence |
| `cc:services/worker/tests/test_worker_change.py` | Hash inequality |

No test touches the GOV.UK adapter, the service, the endpoint or the
source-unavailable path. That leaves MVP acceptance criterion 3 untested
(`cc:specs/culture-context-mvp.md`), and the TS side has no tests at all.

**5. Three defects, each confirmed with a probe script.** Fix them during the port. Do
not carry them over.

- **Script and style text is not stripped.** `html_to_text("<p>Hi</p><script>alert(1)</script>")`
  returns `"Hi alert(1) p{}"`. That contradicts `cc:SOURCE_POLICY.md` ("strip
  scripts/styles"). It renders as plain text, so this is a content-quality problem, not
  XSS.
- **Applicability excludes instead of ranking.** GOV.UK keyword-tags the whole "Local
  laws and customs" section with activities such as `driving` and `nightlife`. A traveler
  who declares none of those activities then gets `relevance() == None`, so the whole
  laws section disappears from their brief.
- **The API and ingestion compute different hashes for the same payload.** The API uses
  `json.dumps(sort_keys=True)` with default separators, while ingestion uses compact
  separators. On top of that, the hash covers the whole payload, so volatile metadata
  changes record IDs and creates noisy change candidates.

**6. What arc-travel already has.** It is a Next.js 16 / React 19 / Prisma 6 / Zod 4
modular monolith, deployed on Vercel. The overlap is large, and in the parts that matter
arc-travel is more mature:

- A destination graph with provenance. `Place` carries `provenance`, `sourceUrl`,
  `verification` and `factsUpdatedAt`, and `ConditionReport` carries `source`,
  `observedAt` and `provenance` (`at:prisma/schema.prisma`, `at:docs/data-model.md`).
- An admin data-quality view that shows provenance, verification and freshness as
  columns (`at:src/app/admin/destination/page.tsx`, `at:src/modules/admin/service.ts`).
  Admin is the only route to `VERIFIED`.
- A guest "Local guide" (`at:src/app/g/[token]/guide/page.tsx`).
- An integration boundary that returns `ProviderResult` with `{ok:false, reason}` and
  "never fabricate, carry provenance" (`at:src/modules/integrations/types.ts`). This is
  the same doctrine as culture-context's unavailable state.
- An AI boundary where the AI explains but never decides: `MockAIProvider`, schema
  validation and injection screening (`at:src/modules/ai/*`, ADR-006). This replaces the
  `@ark/runtime` explanation path culture-context only planned.
- EN/ES i18n.

What arc-travel lacks:

- Any legal, advisory or cultural content.
- An *evidence-class* field. Its `Provenance` enum (`HOTEL_SUBMITTED`, `PUBLIC_SOURCE`
  and so on) records *who supplied* a fact, not *what kind of authority* backs it.
- Content hashing and change detection.
- Country-level scoping. `Place.destination` is a slug; `Guest.countryCode` is optional.

## What it implies for Labs

**Recommended: port into arc-travel as a TS module (`src/modules/culture`). Do not run a
sidecar.**

- **The code is small.** The real logic is about 200 lines, and the Zod schemas already
  exist in `cc:domain/src/index.ts`.
- **A sidecar costs more than it saves.** It would contradict ADR-001 (one deployable).
  It would add a Python host next to Vercel, plus a second CI and a second test runner.
  And the parts that are hard to build (the verification queue, the admin review, the AI
  explain boundary, i18n) would have to cross an HTTP boundary to reach arc-travel's
  versions.
- **Keeping Python is worth it only in one case:** source ingestion becomes heavy
  scraping or PDF/gazette parsing. If that happens, add a Python ingestion worker later
  that writes snapshots into Postgres. It should never be a request-path service.

| Capability | culture-context status + path | arc-travel status + path | Merge action |
| --- | --- | --- | --- |
| Traveler profile | Code: `cc:services/api/culture_context/models.py` | Partial: `Guest.countryCode`, `Stay` dates, `intakeSchema.interests` (`at:src/modules/preferences/schemas.ts`) | Derive the profile from portal context, not a new form. Map `ExperienceCategory`/`Activity` to culture activity tags |
| Source class (evidence ladder) | Code: `SourceClass` enum | Missing. `Provenance` is a different axis | Add a `SourceClass` enum *alongside* `Provenance`. Never collapse it into `PUBLIC_SOURCE` |
| RuleRecord / BriefItem | Code: models, `cc:domain/src/index.ts` | Missing | New Prisma models `CultureRule` and `RuleSource`, keyed by ISO country plus an optional `Place` |
| GOV.UK adapter | Code, untested: `cc:services/api/culture_context/sources/govuk.py` | Missing | New `TravelAdviceProvider` in `at:src/modules/integrations/types.ts`: a `fixture` default (recorded `mexico` payload) and an optional `govuk`. Demo mode stays offline |
| HTML to text | Code, defective: `cc:services/api/culture_context/text.py` | Missing | Port with script/style removal plus tests |
| Applicability | Code + 2 tests: `cc:services/api/culture_context/applicability.py` | Analogue: conditions gate `at:src/modules/destination/conditions.ts` | Port as a pure function. Fix the laws-section exclusion bug (rank, don't drop). Port both tests |
| Brief + unavailable state | Code, untested: `cc:services/api/culture_context/service.py` | Pattern exists: `providerFailed` | Port on `ProviderResult`. Add the missing unavailable-path test |
| Snapshot hash / change detect | Code ×3, inconsistent: `cc:.../change.py`, `cc:services/worker/...`, `cc:services/ingestion/...` | Missing | One TS canonical-JSON plus SHA-256 function. A `SourceSnapshot` table. Hash only the content fields |
| Human review before publish | Docs only: `cc:PROJECT.md`, `cc:SOURCE_GOVERNANCE.md` | Code: `VerificationStatus`, admin-only `VERIFIED`, `recordAudit` | Reuse. Add rule changes to the admin verification queue |
| Provenance in UI | Spec only (web app missing) | Code: admin destination page, `ConditionsCard` always shows source/time | New `CultureCard` on the guest guide page that shows authority, class, URL, retrieved time and jurisdiction |
| AI explanation | Spec only (`api/explain` missing) | Code: `at:src/modules/ai/*` | Use `runAI` with the mock default. AI may rephrase `BriefItem`s, never create one |
| Admin source health | Static scaffold: `cc:src/app/page.tsx` | Code: `at:src/app/admin/health/page.tsx` | Add source freshness and failure counts there |
| SDK / HTTP API | Code: `cc:sdk/src/index.ts`, FastAPI | n/a | Drop for now. B2B API is Phase 3 in `cc:ROADMAP.md`; add a route handler only if a consumer appears |
| Mobile app (Expo) | Missing from repo; plan in `cc:APP_STORE_PLAN.md` | Rejected: ADR-012 (PWA first) | Do not carry over. Record the decision |
| Other adapters (State, GDACS, ReliefWeb, etc.) | Registry entry only | Conditions provider covers marine data | Defer. Track as follow-ups, not parity blockers |
| Doctrine docs | Docs: `cc:SOURCE_POLICY.md`, `cc:SOURCE_GOVERNANCE.md`, `cc:DATA_MODEL.md` | Similar values in `at:CLAUDE.md` non-negotiables | Port as `at:docs/culture-context.md` plus a new ADR. Add a non-negotiable: "an advisory is never rendered as law" |
| Factory scripts / prompts | `cc:scripts/factory-*`, prompts | Has its own `.claude/agents/` | Do not port; they duplicate the ARK factory |

**Archive preconditions.** Do not archive culture-context until every item is true:

1. **Missing files resolved.** Find the original tree (`apps/web` brief and explain
   routes, `apps/mobile`, `ci.yml`, `evals/`) in a local copy, or record in arc-travel
   that they are lost and their behaviour is re-specified.
2. **Data model added.** `src/modules/culture` exists with the `SourceClass` enum and the
   rule and snapshot models in `prisma/schema.prisma`, plus a migration and seed fixture.
3. **Tests ported and extended.** All 6 Python tests are ported to Vitest and pass.
   New tests cover the adapter (against a recorded fixture), the unavailable state, the
   script stripping, the laws-section ranking fix, and "advisory never becomes law".
4. **Visible end to end.** The guest guide shows a sourced cultural brief with full
   provenance for the demo destination (MX / `mexico`) in EN and ES. The admin view shows
   source freshness.
5. **Changes go to human review.** A hash change creates a review item in the admin
   queue, and no notification or "law changed" copy can be published without an
   `Approval`.
6. **CI and attribution pass.** `npm run verify` passes in arc-travel. GOV.UK Open
   Government Licence attribution is rendered.
7. **Doctrine lands.** The doctrine doc and ADR are merged. `portfolio/products.yaml` is
   updated, with a pointer from the culture-context README to the new location before
   archiving.

This also bears on the
[pre-trip briefing idea](../../incubator/ideas/exp-2026-0001-pre-trip-cultural-briefing.md),
which assumes a model can "compress a country guide". Culture-context's doctrine forbids
models from originating facts. If that experiment runs, it should consume the sourced
`BriefItem`s from this module and keep the model to rephrasing.

## What we still do not know

- Whether the missing `apps/web` and `apps/mobile` code exists anywhere. The parity
  table judges those surfaces only from the manifest and the docs.
- Whether any user ever saw the culture-context brief. The repo holds no evidence
  (`evidence/` is absent), so the kill criteria in `cc:specs/culture-context-mvp.md` were
  never tested.
- Whether arc-travel's own 221 unit/integration tests pass today. I did not run them, and
  the clone has no `node_modules`.
- How GOV.UK content-item JSON changes over time, and therefore which fields to hash to
  avoid false change candidates. Recording a few weeks of snapshots would answer this.
- Whether hotel owners want legal or advisory content in a guest portal they brand, or
  see it as liability. The pilot plan does not cover it.
- Exact OGL v3 attribution wording for this use. Check it before showing it to a real
  guest.
