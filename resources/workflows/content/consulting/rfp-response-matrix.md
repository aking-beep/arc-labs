---
title: RFP Response + Compliance Matrix
category: Consulting
difficulty: advanced
tags: [rfp, compliance, consulting, matrix]
updated: 2026-08-11
hitl: true
stack: [LLM, spreadsheet/CSV, capability library]
---

# RFP Response + Compliance Matrix

Extract every RFP requirement, build a compliance matrix, and draft a response package. Mark gaps. Never claim capabilities you cannot support.

## What it does
Builds an RFP response package from the source RFP plus a capability library. First extracts every requirement and a compliance matrix. Then drafts cover letter, summary, approach, staffing, timeline, risk, security, pricing framework, differentiators, case studies, and a submission checklist. From ARC's Operator AI RFP prompt.

## Pipeline
1. **Extract** — every requirement; mandatory vs optional; weights if present.
2. **Matrix** — map capabilities and case studies; mark FULL / PARTIAL / GAP.
3. **Questions** — list clarification questions and assumptions.
4. **Draft** — response sections that only use supported capabilities.
5. **Check** — submission checklist; human approves claims.

## Prompt skeleton
```
Analyze the supplied RFP and create a response package.

First:
- Extract every requirement.
- Classify mandatory versus optional.
- Identify evaluation criteria and weights where present.
- Create a compliance matrix.
- Map supplied capabilities and case studies to requirements.
- Identify gaps, assumptions, risks, and clarification questions.

Then generate: executive cover letter, executive summary, understanding of need,
proposed approach, technical response, delivery methodology, staffing, timeline,
governance, risk management, security and compliance, pricing framework,
differentiators, case studies, compliance matrix, submission checklist.

Do not claim capabilities not supported by the supplied capability library.
Mark unsupported requirements as GAP or PARTIAL.
```

## Guardrails
Do not claim capabilities that are not in the library. GAP stays GAP. Pricing framework is structure only unless a real rate card is supplied. Human submits the bid.

## Tools
- **rfp-parser** (llm) — Extract requirements, weights, and evaluation criteria.
- **capability-library** (api) — Map only documented capabilities and case studies.
- **matrix-builder** (validator) — Classify FULL / PARTIAL / GAP per requirement.
- **proposal-lead** (human) — Approve claims before the package is submitted.

## Example input
```json
{
  "rfp_text": "Vendor must provide an evidence-backed readiness score and a 90-day roadmap. SOC2 required.",
  "capability_library": [
    "AI readiness assessment",
    "90-day roadmap workshop",
    "No SOC2 (in progress)"
  ]
}
```

## Example output
```json
{
  "matrix": [
    {
      "requirement": "Evidence-backed readiness score",
      "status": "FULL",
      "evidence": "AI readiness assessment"
    },
    {
      "requirement": "90-day roadmap",
      "status": "FULL",
      "evidence": "90-day roadmap workshop"
    },
    {
      "requirement": "SOC2",
      "status": "GAP",
      "evidence": "Not yet attested; do not claim."
    }
  ],
  "clarification_questions": [
    "Is SOC2 attestation required at bid or at kickoff?"
  ]
}
```
