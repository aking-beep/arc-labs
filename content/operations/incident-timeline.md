---
title: Incident Timeline Builder
category: Operations
difficulty: intermediate
tags: [incident, sre, postmortem, operations]
updated: 2026-08-11
---

# Incident Timeline Builder

Assemble a clean, timestamped incident timeline from scattered logs, alerts, and chat messages.

## When to use
During or after an incident, when raw signals (PagerDuty alerts, deploy logs, Slack threads) need to become a single ordered narrative for a postmortem or status update.

## What it does
Normalizes every event to one timezone, orders by timestamp, and labels each entry with a source and an actor. Produces a table plus a prose summary of detection, diagnosis, mitigation, and recovery windows, and computes time-to-detect and time-to-recover.

## Steps
1. Collect all timestamped signals; convert to UTC.
2. Deduplicate repeated alerts into a single row with a count.
3. Tag each event: `detect`, `diagnose`, `mitigate`, `recover`, or `comms`.
4. Compute TTD (first symptom → first human ack) and TTR (first symptom → recovery).
5. Emit the timeline table, then a 4-sentence narrative, then the two metrics.

## Guardrails
Do not infer causation the logs don't support — describe sequence, not blame. If timestamps conflict across sources, keep both and note the discrepancy rather than silently picking one.
