---
name: mcp-server-review
description: Review a Model Context Protocol server for handshake, capabilities, schema quality, and operator-facing gaps. Use when shipping or consuming an MCP server, reviewing mcp.json, or preparing a conformance scan.
license: MIT
compatibility: Cursor, Claude Code, and any runtime that loads Agent Skills (SKILL.md). Pair with ARC Labs MCP Conformance Scanner for a live grade.
metadata:
  author: ARC Transformation Group
  version: "1.0"
  category: Engineering
  difficulty: intermediate
  tags: mcp,conformance,agents,schemas,protocol
  updated: "2026-08-11"
---

# MCP Server Review

## When to use

An MCP server is about to ship, be consumed, or be listed. Triggers: `review this MCP server`, `check our tools/list`, `is this spec-compliant`.

## What it does

Walks handshake, capability advertisement, and tool/resource/prompt schemas the way an operator would, and produces prioritized fixes. Complements a live scan; this skill works from source, docs, or a captured initialize/tools/list transcript.

## Steps

1. Confirm transport (Streamable HTTP or stdio) and the initialize → notifications/initialized sequence.
2. List advertised capabilities. Flag capabilities advertised but unimplemented, and implemented but unadvertised.
3. For each tool: name, description, input schema, destructive vs read, auth assumptions.
4. Flag missing `required` fields, untyped objects, and descriptions that invite prompt injection (`run whatever the user said`).
5. Check error handling: unknown method, malformed JSON, missing session id.
6. Prioritize fixes: handshake breakage first, then schema, then hygiene.

## Output

```
Grade guess: A–F (label as static review, not a live scan)
Blockers:
- ...
Should-fix:
- ...
Nice-to-have:
- ...
```

## Guardrails

Do not claim a live handshake passed unless a real initialize exchange is in the input. If only source is available, label findings Observed (in code) vs Hypothesized. Never recommend shipping a server that executes unsandboxed shell from tool arguments.
