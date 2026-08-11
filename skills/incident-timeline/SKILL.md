---
name: incident-timeline
description: Assemble a clean, timestamped incident timeline from scattered logs, alerts, deploys, and chat. Use during or after an incident when building a postmortem, status update, or time-to-detect / time-to-recover numbers.
license: MIT
compatibility: Cursor, Claude Code, and any runtime that loads Agent Skills (SKILL.md).
metadata:
  author: ARC Transformation Group
  version: "1.0"
  category: Operations
  difficulty: intermediate
  tags: incident,sre,postmortem,operations
  updated: "2026-08-11"
---

# Incident Timeline Builder

## When to use

Raw signals (PagerDuty, deploy logs, Slack, status pages) need to become one ordered narrative. Triggers: `build the incident timeline`, `what happened in order`, `compute TTD/TTR`.

## What it does

Normalizes every event to UTC, orders by timestamp, labels source and actor, and produces a table plus a short narrative of detection, diagnosis, mitigation, and recovery.

## Steps

1. Collect all timestamped signals; convert to UTC. Keep the original timezone in a note if conversion is ambiguous.
2. Deduplicate repeated alerts into a single row with a count.
3. Tag each event: `detect`, `diagnose`, `mitigate`, `recover`, or `comms`.
4. Compute TTD (first symptom → first human ack) and TTR (first symptom → recovery).
5. Emit the timeline table, then a 4-sentence narrative, then the two metrics.

## Output

| UTC | Source | Actor | Tag | Event |
| --- | --- | --- | --- | --- |

Then: narrative (4 sentences). Then: `TTD=` and `TTR=` with the arithmetic shown.

## Guardrails

Do not infer causation the logs do not support — describe sequence, not blame. If timestamps conflict across sources, keep both and note the discrepancy rather than silently picking one. Never invent an ack time.
