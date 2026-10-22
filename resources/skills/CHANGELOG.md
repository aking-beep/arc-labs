# Changelog

All notable changes to ARC Skills are documented here. Format based on Keep a Changelog; this project follows semver.

## [0.2.0] - 2026-08-11

### Added

- Agent Skills specification packages under `skills/<slug>/SKILL.md` as the source of truth.
- 20 production skills across Engineering, Operations, Productivity, Support, Quality, Growth, Architecture, Data, DevOps, Security, Delivery, and AI.
- Copy / download `SKILL.md` and Cursor / Claude install paths on every detail page.
- `GET /api/catalog?format=raw` for the markdown file.
- `npm run validate` (name/description spec + required Guardrails) in CI.
- `CONTRIBUTING.md` and pull-request template.

### Changed

- Catalog loader reads the filesystem (with a build-time snapshot fallback) instead of a hard-coded TypeScript array.

## [0.1.0] - 2026-08-11

### Added

- Initial public release: seeded catalog UI, JSON API, CLI search, optional email capture.
