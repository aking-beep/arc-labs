import type { CatalogItem } from "./types";

export const ITEMS: CatalogItem[] = [
  {
    slug: "pr-review-summary",
    title: "PR Review Summary",
    category: "Engineering",
    summary:
      "Turn a raw diff into a structured review: risk callouts, test gaps, and a suggested merge decision.",
    tags: ["code-review", "github", "engineering", "quality"],
    updated: "2026-08-11",
    difficulty: "starter",
    source: "content/engineering/pr-review-summary.md",
    sections: [
      {
        heading: "When to use",
        body: "Use when a diff or pull request needs a fast, consistent first-pass review before a human signs off. Triggers include: `review this PR`, `summarize this diff`, `what's risky here`, or a pasted unified diff.",
      },
      {
        heading: "What it does",
        body: "Reads the diff, groups changes by concern, and produces:\n\n- A one-line **merge recommendation** (approve / approve-with-nits / request-changes).\n- **Risk callouts** ranked high → low, each tied to a specific file and line range.\n- **Test coverage gaps** — logic paths introduced without a matching test.\n- A short **reviewer checklist** the human can tick through.",
      },
      {
        heading: "Steps",
        body: "1. Parse the diff into hunks; ignore pure formatting churn.\n2. For each hunk, classify: behavior change, refactor, config, docs, or test.\n3. Flag any behavior change without an accompanying test hunk.\n4. Scan for common risks: unvalidated input, broadened permissions, swallowed errors, N+1 queries, missing null checks.\n5. Emit the merge recommendation last, justified by the highest-severity finding.",
      },
      {
        heading: "Guardrails",
        body: "Never claim a test exists that you did not see in the diff. If the diff is truncated, say so and scope the review to what's visible. Do not approve changes that touch auth, billing, or migrations without an explicit human-review flag.",
      },
    ],
  },
  {
    slug: "incident-timeline",
    title: "Incident Timeline Builder",
    category: "Operations",
    summary:
      "Assemble a clean, timestamped incident timeline from scattered logs, alerts, and chat messages.",
    tags: ["incident", "sre", "postmortem", "operations"],
    updated: "2026-08-11",
    difficulty: "intermediate",
    source: "content/operations/incident-timeline.md",
    sections: [
      {
        heading: "When to use",
        body: "During or after an incident, when raw signals (PagerDuty alerts, deploy logs, Slack threads) need to become a single ordered narrative for a postmortem or status update.",
      },
      {
        heading: "What it does",
        body: "Normalizes every event to one timezone, orders by timestamp, and labels each entry with a source and an actor. Produces a table plus a prose summary of detection, diagnosis, mitigation, and recovery windows, and computes time-to-detect and time-to-recover.",
      },
      {
        heading: "Steps",
        body: "1. Collect all timestamped signals; convert to UTC.\n2. Deduplicate repeated alerts into a single row with a count.\n3. Tag each event: `detect`, `diagnose`, `mitigate`, `recover`, or `comms`.\n4. Compute TTD (first symptom → first human ack) and TTR (first symptom → recovery).\n5. Emit the timeline table, then a 4-sentence narrative, then the two metrics.",
      },
      {
        heading: "Guardrails",
        body: "Do not infer causation the logs don't support — describe sequence, not blame. If timestamps conflict across sources, keep both and note the discrepancy rather than silently picking one.",
      },
    ],
  },
  {
    slug: "meeting-notes-to-actions",
    title: "Meeting Notes → Action Items",
    category: "Productivity",
    summary:
      "Convert messy meeting notes or a transcript into owned, dated action items with decisions separated out.",
    tags: ["meetings", "notes", "productivity", "follow-up"],
    updated: "2026-08-11",
    difficulty: "starter",
    source: "content/productivity/meeting-notes-to-actions.md",
    sections: [
      {
        heading: "When to use",
        body: "After any meeting where the notes or transcript are unstructured and you need clear follow-ups. Triggers: `pull the action items`, `what did we decide`, `who owns what`.",
      },
      {
        heading: "What it does",
        body: "Separates three things people usually blur together:\n\n- **Decisions** — settled outcomes, stated as facts.\n- **Action items** — each with an owner and a due date (ask or infer, never leave blank).\n- **Open questions** — unresolved items that need a follow-up.",
      },
      {
        heading: "Steps",
        body: "1. Read the full notes before extracting anything.\n2. Pull decisions first; phrase each in past tense.\n3. Extract actions; attach an owner. If no owner is named, mark `owner: unassigned` rather than guessing a person.\n4. Attach a due date; if none is stated, propose one and mark it `(proposed)`.\n5. List open questions last so nothing is dropped.",
      },
      {
        heading: "Guardrails",
        body: "Never invent an owner's name. `unassigned` is always safer than a wrong assignment. Keep action verbs concrete (`draft`, `send`, `review`) — avoid `look into`.",
      },
    ],
  },
  {
    slug: "api-changelog-writer",
    title: "API Changelog Writer",
    category: "Engineering",
    summary:
      "Generate a human-readable, semver-aware changelog entry from a set of merged commits or PRs.",
    tags: ["changelog", "api", "release", "engineering"],
    updated: "2026-08-11",
    difficulty: "intermediate",
    source: "content/engineering/api-changelog-writer.md",
    sections: [
      {
        heading: "When to use",
        body: "At release time, when merged commits/PRs need to become a changelog that developers can actually read. Triggers: `write the changelog`, `what changed since v1.4`.",
      },
      {
        heading: "What it does",
        body: "Groups changes into `Added`, `Changed`, `Deprecated`, `Fixed`, and `Breaking`, writes each from the consumer's point of view, and proposes the next semver bump based on the presence of breaking changes or new features.",
      },
      {
        heading: "Steps",
        body: "1. Classify each commit by Keep-a-Changelog category.\n2. Rewrite terse commit messages into user-facing sentences ('Fixed a crash when …', not 'fix npe').\n3. Surface breaking changes at the top with a migration note.\n4. Recommend the version bump: any breaking → major; any new feature → minor; else patch.",
      },
      {
        heading: "Guardrails",
        body: "Only describe changes present in the provided commits. If a commit message is ambiguous, flag it for author review rather than inventing behavior.",
      },
    ],
  },
  {
    slug: "customer-reply-triage",
    title: "Customer Reply Triage",
    category: "Support",
    summary:
      "Classify an inbound support message by intent, urgency, and sentiment, then draft a first-response.",
    tags: ["support", "triage", "email", "customer"],
    updated: "2026-08-11",
    difficulty: "starter",
    source: "content/support/customer-reply-triage.md",
    sections: [
      {
        heading: "When to use",
        body: "On inbound support email or chat that needs routing and a fast, on-brand first reply. Triggers: `triage this ticket`, `draft a reply`.",
      },
      {
        heading: "What it does",
        body: "Labels the message with intent (bug, billing, how-to, feature request, churn-risk), urgency (P1–P4), and sentiment. Then drafts a first response that acknowledges, sets expectations, and asks for exactly the missing information needed to resolve.",
      },
      {
        heading: "Steps",
        body: "1. Read the full message and any quoted history.\n2. Assign intent + urgency + sentiment.\n3. Route: map intent to the owning team.\n4. Draft a reply: acknowledge → answer or set expectation → one clear next step.\n5. Keep the draft under 120 words unless the issue demands detail.",
      },
      {
        heading: "Guardrails",
        body: "Never promise a fix date the team hasn't committed to. For billing or account changes, confirm identity before taking action. Escalate anything mentioning legal, security, or a data breach to P1 regardless of tone.",
      },
    ],
  },
  {
    slug: "spec-to-test-plan",
    title: "Spec → Test Plan",
    category: "Quality",
    summary:
      "Turn a feature spec into a structured test plan: happy paths, edge cases, and negative cases.",
    tags: ["testing", "qa", "spec", "quality"],
    updated: "2026-08-11",
    difficulty: "advanced",
    source: "content/quality/spec-to-test-plan.md",
    sections: [
      {
        heading: "When to use",
        body: "When a written spec or ticket needs a test plan before implementation starts. Triggers: `write test cases for this`, `what should we test`.",
      },
      {
        heading: "What it does",
        body: "Derives testable behaviors from the spec and organizes them into happy-path, edge-case, and negative/failure cases, each with preconditions, steps, and expected result. Flags any acceptance criterion that isn't observable or measurable.",
      },
      {
        heading: "Steps",
        body: "1. Extract every acceptance criterion; number them.\n2. For each, write at least one happy-path case.\n3. Enumerate boundaries (empty, max, min, off-by-one) as edge cases.\n4. Add negative cases: invalid input, unauthorized access, dependency failure.\n5. Map each case back to the criterion it verifies; flag uncovered criteria.",
      },
      {
        heading: "Guardrails",
        body: "If a criterion can't be tested as written (e.g. 'should feel fast'), do not invent a threshold — flag it and request a measurable target. Coverage claims must trace to a numbered criterion.",
      },
    ],
  },
];
