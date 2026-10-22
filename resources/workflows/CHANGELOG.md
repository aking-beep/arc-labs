# Changelog

All notable changes to AI Workflow Templates are documented here. Format based on Keep a Changelog; this project follows semver.

## [0.1.0] - 2026-08-11

### Added

- Initial public release: 16 workflow templates across Operations, Consulting, Retrieval, Automation, Extraction, Content, Research, and Quality.
- Templates distilled from ARC Drive materials: Operator AI prompts, Master Blueprint Labs list, portfolio register (KickoffPilot, ClearDesk, FieldNote), and sister Labs tools.
- Browsable, searchable catalog UI with HITL badges.
- Static per-template detail pages with copy Markdown / copy prompt.
- Structural dry-run at `POST /api/dry-run` (no model call).
- Read-only JSON API at `/api/catalog`.
- CLI search (`npm run catalog`).
- `npm test` catalog integrity checks and `npm run sync-content`.
- Optional email capture for update notifications.
