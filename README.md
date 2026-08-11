# AI Workflow Templates

**ARC Labs 0.1 · Release #1** — Free · Open Source · Community Project

A free, open library of ready-to-run AI workflows. Each template is a documented pipeline: the prompt, the tools it calls, the data it needs, and the guardrails to keep it safe. Copy one, drop in your keys, and run it. No account, no lock-in.

Most templates stop at a human gate. That is the point.

Repo: https://github.com/aking-beep/ai-workflow-templates  
Labs page: https://arc-website-pi-five.vercel.app/labs/ai-workflow-templates  
Live app: https://aiworkflowtemplates.arctransformationgrouplab.dev  
Drive: `ARC Transformation/ARC Labs (Free)/ai-workflow-templates`

Sister tools: [Prompt Reviewer](https://github.com/aking-beep/prompt-reviewer) · [MCP Conformance Scanner](https://github.com/aking-beep/mcp-conformance-scanner)

---

## What's inside

16 templates drawn from ARC's operator packages, Master Blueprint Labs list, and portfolio register:

| Category | Templates |
| --- | --- |
| Operations | Daily Operating Brief, Evidence → Operating Objects, Approval Routing |
| Consulting | SOW Generator (Lite), RFP Response + Compliance Matrix, Consulting Assessment, Deal → Kickoff Brief |
| Retrieval | RAG Over Your Docs, RAG Readiness Checker |
| Automation | Email Draft & Route, Meeting Notes → CRM Update |
| Extraction | Structured Data Extraction |
| Content | Content Repurposing Chain |
| Research | Agentic Research Brief |
| Quality | Prompt Review Gate, MCP Conformance Gate |

- Searchable catalog UI with HITL badges
- Per-template detail pages, copy Markdown / copy prompt
- Structural dry-run (`POST /api/dry-run`) — validates required fields, no model call
- Read-only JSON API (`GET /api/catalog`)
- CLI (`npm run catalog`)
- Markdown mirrors under `content/`

## Quick start

```bash
npm install
npm run dev          # http://localhost:3000
npm test
npm run typecheck
npm run build
npm run catalog -- "sow"
```

## Using a template

1. Open a template. Read **What it does**, **Pipeline**, and **Guardrails**.
2. Copy the prompt skeleton into your stack.
3. Keep the human-in-the-loop steps. Most templates deliberately do not auto-send, auto-pay, or auto-write.
4. Run the structural dry-run with the example payload, then wire your own model and tools.

## API

```
GET  /api/catalog
GET  /api/catalog?category=Operations
GET  /api/catalog?slug=daily-operating-brief

POST /api/dry-run
{ "slug": "daily-operating-brief", "input": { "account_id": "...", "operating_objects": [], "as_of": "2026-08-11" } }
```

Dry-run is structural only. It does not call a model and does not execute side effects. A passing dry-run means the payload has the required fields.

## Contributing

`lib/catalog/data.ts` is the source of truth. Add a `CatalogItem`, then:

```bash
npm run sync-content
npm test
```

See `HOWTO.md`. MIT licensed.

## Tech

Next.js 15 (App Router) · TypeScript (strict) · Tailwind CSS · Zod. Deploys to Vercel.

## License

MIT © 2026 ARC Transformation Group
