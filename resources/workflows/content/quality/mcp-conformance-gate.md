---
title: MCP Conformance Gate
category: Quality
difficulty: starter
tags: [mcp, ci, conformance, sister-tool]
updated: 2026-08-11
hitl: false
stack: [MCP Conformance Scanner, CI]
---

# MCP Conformance Gate

Point ARC's MCP Conformance Scanner at a server before it ships. Handshake, schemas, and a graded report with operator-ready fixes.

## What it does
Runs the free ARC MCP Conformance Scanner as a workflow gate. Point it at a Model Context Protocol server and get a conformance report: what passes, what breaks, and what to fix first. Flagship ARC Labs tool.

## Pipeline
1. **Point** — server URL or local process.
2. **Scan** — handshake, capability negotiation, schema checks.
3. **Grade** — operator-ready findings, not a linter dump.
4. **Share** — report link on the PR.
5. **Gate** — fail CI on handshake or schema breaks.

## Prompt skeleton
```
# Point the scanner at the server under test.
# Fail the job if handshake or tool schemas break.
# Attach the report URL to the PR.
```

## Guardrails
A passing handshake is not production-ready by itself. Read the findings. Sister tool: github.com/aking-beep/mcp-conformance-scanner.

## Tools
- **scanner** (validator) — Handshake, capability negotiation, tool/resource schemas.
- **ci** (api) — Publish the graded report and fail on breaks.

## Example input
```json
{
  "server_url": "https://mcp.example.com"
}
```

## Example output
```json
{
  "handshake": "pass",
  "capability_negotiation": "3 findings",
  "tool_schemas": "pass",
  "resource_schemas": "1 break",
  "grade": "B-"
}
```
