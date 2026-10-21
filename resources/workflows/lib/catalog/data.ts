import type { CatalogItem } from "./types";

const UPDATED = "2026-08-11";

export const ITEMS: CatalogItem[] = [
  {
    slug: "daily-operating-brief",
    title: "Daily Operating Brief",
    category: "Operations",
    summary:
      "Turn structured operating objects into an evidence-backed daily brief: decisions, commitments at risk, issues, and at most five priorities.",
    tags: ["operator", "brief", "hitl", "json"],
    updated: UPDATED,
    difficulty: "intermediate",
    source: "content/operations/daily-operating-brief.md",
    hitl: true,
    stack: ["LLM", "JSON schema", "evidence store"],
    tools: [
      { name: "operating-object-store", kind: "api", purpose: "Read structured objects and evidence IDs for the account." },
      { name: "brief-model", kind: "llm", purpose: "Draft the DailyOperatingBrief JSON from supplied objects only." },
      { name: "operator-review", kind: "human", purpose: "Confirm priorities before the brief is sent or posted." },
    ],
    requiredInput: ["account_id", "operating_objects", "as_of"],
    example: {
      label: "Northstar Fitness (synthetic)",
      input: {
        account_id: "northstar-fitness",
        as_of: "2026-08-03",
        operating_objects: [
          { id: "OBJ-14", object_type: "decision", title: "Approve consent language for DE launch" },
          { id: "OBJ-09", object_type: "commitment", title: "Priya readiness view by July 31" },
        ],
      },
      output: {
        operating_condition: "AMBER",
        decisions_required: ["Approve DE consent language before country-lead comms."],
        commitments_at_risk: ["Priya readiness view (due July 31) has no evidence of delivery."],
        priorities: [
          { rank: 1, object_id: "OBJ-14", action: "Get a dated yes/no on consent language." },
          { rank: 2, object_id: "OBJ-09", action: "Confirm readiness-view owner and new date." },
        ],
      },
    },
    relatedLabs: [
      { name: "Evidence to Operating Objects", href: "/evidence-to-operating-objects" },
      { name: "Prompt Reviewer", href: "https://arc-website-pi-five.vercel.app/labs/prompt-reviewer" },
    ],
    sections: [
      {
        heading: "What it does",
        body: "Produces a Daily Operating Brief for an accountable operator. It does not chat. It ranks what needs a decision, which commitments will slip, which issues are already happening, who needs a message, and at most five recommended priorities. Every recommendation cites an operating-object ID. This is the core loop from ARC's Operator AI package.",
      },
      {
        heading: "Pipeline",
        body: "1. **Load** — pull operating objects and evidence for the account as of a date.\n2. **Prioritize** — decisions that unblock work, then missed commitments, then high-severity risks or issues, then stakeholder comms, then commercial signals.\n3. **Draft** — emit valid JSON matching the DailyOperatingBrief schema.\n4. **Gate** — operator reviews before Slack/email/dashboard publish.\n5. **Publish** — on approval, render Markdown + JSON for the day's brief.",
      },
      {
        heading: "Prompt skeleton",
        body: "```\nYou are preparing an evidence-backed Daily Operating Brief for an accountable operator.\nUse only the supplied structured operating objects and evidence.\n\nPrioritize:\n1. decisions that unblock work\n2. commitments likely to be missed\n3. high-severity risks or active issues\n4. stakeholder communication that protects confidence\n5. commercially relevant scope or expansion signals\n\nRules:\n- Do not repeat low-value information.\n- Do not describe a risk as an issue unless it has already occurred.\n- Do not claim certainty when evidence is incomplete.\n- Recommend no more than five priorities.\n- Each recommendation must reference its operating object ID.\n- Return valid JSON matching the DailyOperatingBrief schema.\n```",
      },
      {
        heading: "Guardrails",
        body: "Use only supplied objects. A status report saying \"green\" does not override contradictory evidence. Never invent owners, dates, or decisions. Cap priorities at five. Human review before any outbound message. Label synthetic accounts as synthetic.",
      },
    ],
  },
  {
    slug: "evidence-to-operating-objects",
    title: "Evidence → Operating Objects",
    category: "Operations",
    summary:
      "Convert a business artifact into persistent operating objects (decision, commitment, risk, issue, dependency) with verbatim evidence excerpts.",
    tags: ["extraction", "operator", "evidence", "json"],
    updated: UPDATED,
    difficulty: "advanced",
    source: "content/operations/evidence-to-operating-objects.md",
    hitl: true,
    stack: ["LLM", "JSON schema", "artifact store"],
    tools: [
      { name: "artifact-loader", kind: "api", purpose: "Fetch the source document and assign SOURCE_ID." },
      { name: "extract-model", kind: "llm", purpose: "Emit { objects: OperatingObject[] } only." },
      { name: "schema-validator", kind: "validator", purpose: "Reject objects missing evidence excerpts or types." },
      { name: "analyst-review", kind: "human", purpose: "Accept, merge, or drop objects before they persist." },
    ],
    requiredInput: ["source_id", "artifact_text"],
    example: {
      label: "Weekly delivery note",
      input: {
        source_id: "2026-07-27_weekly_delivery",
        artifact_text: "Priya will send the readiness view by July 31. Germany legal approval is still pending.",
      },
      output: {
        objects: [
          {
            id: "OBJ-09",
            object_type: "commitment",
            title: "Priya readiness view by July 31",
            evidence: [{ source_id: "2026-07-27_weekly_delivery", excerpt: "Priya will send the readiness view by July 31." }],
          },
          {
            id: "OBJ-11",
            object_type: "dependency",
            title: "Germany legal approval pending",
            evidence: [{ source_id: "2026-07-27_weekly_delivery", excerpt: "Germany legal approval is still pending." }],
          },
        ],
      },
    },
    relatedLabs: [{ name: "Daily Operating Brief", href: "/daily-operating-brief" }],
    sections: [
      {
        heading: "What it does",
        body: "Turns a Slack export, email, meeting note, or status report into typed operating objects. Allowed types: initiative, decision, commitment, risk, issue, dependency, stakeholder_action, opportunity, outcome. Prefer fewer high-signal objects over many low-value outcomes. Lifted from ARC's Operator AI extraction prompt.",
      },
      {
        heading: "Pipeline",
        body: "1. **Ingest** — store the artifact, stamp SOURCE_ID.\n2. **Extract** — model returns JSON only: {\"objects\":[...]}.\n3. **Validate** — every evidence.excerpt is a contiguous verbatim quote; source_id matches SOURCE_ID; object_type is allowed.\n4. **Repair** — on schema failure, return errors for at most two retries.\n5. **Persist** — human accepts objects into the store.",
      },
      {
        heading: "Prompt skeleton",
        body: "```\nYou are an operating-intelligence extraction engine.\nConvert the supplied business artifact into persistent operating objects.\n\nAllowed object_type values:\ninitiative, decision, commitment, risk, issue, dependency,\nstakeholder_action, opportunity, outcome.\n\nDefinitions (use precisely):\n- risk: a future uncertain condition that may hurt an objective.\n- issue: a negative condition that is already occurring now.\n- dependency: progress requires another event, team, approval, or deliverable.\n- commitment: a named person/team agreed to deliver something by a stated time.\n- decision: an option has been selected, OR an approval choice must be made.\n- stakeholder_action: communication, alignment, approval, or escalation is required.\n- opportunity: evidence supports commercial upside or scope expansion.\n- outcome: completed work already delivered (use sparingly).\n\nRules:\n1. Do not invent owners, dates, facts, or decisions.\n2. Distinguish estimates from commitments.\n3. Every evidence.excerpt MUST be an exact contiguous verbatim quote.\n4. Set evidence[].source_id exactly to SOURCE_ID.\n5. Confidence must reflect evidentiary strength (0 to 1).\n6. Return valid JSON only: {\"objects\":[ ... ]}.\n```",
      },
      {
        heading: "Guardrails",
        body: "Do not invent facts. A \"green\" status report does not create new risks from generic Upcoming bullets. From status reports alone, extract nothing unless there is a concrete ownership gap, missed commitment, explicit blocker, or commercial ask. Escalate after two failed schema repairs.",
      },
    ],
  },
  {
    slug: "sow-generator-lite",
    title: "SOW Generator (Lite)",
    category: "Consulting",
    summary:
      "Draft a consulting-grade Statement of Work from structured operational intelligence. Facts and labeled assumptions only. Never invent pricing.",
    tags: ["sow", "consulting", "hitl", "markdown"],
    updated: UPDATED,
    difficulty: "intermediate",
    source: "content/consulting/sow-generator-lite.md",
    hitl: true,
    stack: ["LLM", "Markdown", "JSON"],
    tools: [
      { name: "intel-loader", kind: "api", purpose: "Load operating intelligence for the engagement." },
      { name: "sow-model", kind: "llm", purpose: "Emit structured JSON plus polished Markdown." },
      { name: "partner-review", kind: "human", purpose: "Sign off scope, commercial placeholders, and unanswered questions." },
    ],
    requiredInput: ["account_name", "intelligence", "engagement_goal"],
    example: {
      label: "AI readiness SOW",
      input: {
        account_name: "Northstar Fitness",
        engagement_goal: "90-day AI readiness assessment and roadmap",
        intelligence: { operating_condition: "AMBER", gaps: ["No approved AI use-case list", "No data classification"] },
      },
      output: {
        json: { scope: ["Readiness snapshot", "One workflow design", "90-day roadmap"], out_of_scope: ["Model training", "Production agent"] },
        markdown: "# Statement of Work — Northstar Fitness\n...",
        unanswered_questions: ["Who owns data classification today?"],
        pricing: "PLACEHOLDER — estimate from staffing x duration; do not invent a number.",
      },
    },
    relatedLabs: [{ name: "Consulting Assessment", href: "/consulting-assessment" }],
    sections: [
      {
        heading: "What it does",
        body: "Generates a Statement of Work from supplied operational intelligence. Separates current state, objectives, scope, out of scope, requirements, deliverables, milestones, dependencies, assumptions, risks, acceptance criteria, success metrics, governance, timeline, staffing, and commercial assumptions. Listed as a free ARC Labs utility in the Master Blueprint (SOW Generator Lite).",
      },
      {
        heading: "Pipeline",
        body: "1. **Load** — structured intelligence + engagement goal.\n2. **Draft JSON** — every major section as fields.\n3. **Draft Markdown** — consulting-grade prose from the same fields.\n4. **Flag** — unanswered questions and pricing placeholders.\n5. **Review** — partner edits before it leaves the building.",
      },
      {
        heading: "Prompt skeleton",
        body: "```\nGenerate a consulting-grade Statement of Work from the supplied structured operational intelligence.\n\nRules:\n- Use only supplied facts and explicitly labeled assumptions.\n- Separate current state, objectives, scope, out of scope, requirements,\n  deliverables, milestones, dependencies, assumptions, risks, acceptance\n  criteria, success metrics, governance, timeline, staffing, and commercial assumptions.\n- Link major scope items to evidence or identified operational needs.\n- Identify unanswered questions.\n- Never invent pricing. Where pricing is missing, provide placeholders and estimation logic.\n- Return: 1) structured JSON  2) polished Markdown.\n```",
      },
      {
        heading: "Guardrails",
        body: "Never invent pricing or confidential client facts. Label assumptions. Link scope to evidence. Human signs the SOW; the model does not send it.",
      },
    ],
  },
  {
    slug: "rfp-response-matrix",
    title: "RFP Response + Compliance Matrix",
    category: "Consulting",
    summary:
      "Extract every RFP requirement, build a compliance matrix, and draft a response package. Mark gaps. Never claim capabilities you cannot support.",
    tags: ["rfp", "compliance", "consulting", "matrix"],
    updated: UPDATED,
    difficulty: "advanced",
    source: "content/consulting/rfp-response-matrix.md",
    hitl: true,
    stack: ["LLM", "spreadsheet/CSV", "capability library"],
    tools: [
      { name: "rfp-parser", kind: "llm", purpose: "Extract requirements, weights, and evaluation criteria." },
      { name: "capability-library", kind: "api", purpose: "Map only documented capabilities and case studies." },
      { name: "matrix-builder", kind: "validator", purpose: "Classify FULL / PARTIAL / GAP per requirement." },
      { name: "proposal-lead", kind: "human", purpose: "Approve claims before the package is submitted." },
    ],
    requiredInput: ["rfp_text", "capability_library"],
    example: {
      label: "Mid-market AI readiness RFP",
      input: {
        rfp_text: "Vendor must provide an evidence-backed readiness score and a 90-day roadmap. SOC2 required.",
        capability_library: ["AI readiness assessment", "90-day roadmap workshop", "No SOC2 (in progress)"],
      },
      output: {
        matrix: [
          { requirement: "Evidence-backed readiness score", status: "FULL", evidence: "AI readiness assessment" },
          { requirement: "90-day roadmap", status: "FULL", evidence: "90-day roadmap workshop" },
          { requirement: "SOC2", status: "GAP", evidence: "Not yet attested; do not claim." },
        ],
        clarification_questions: ["Is SOC2 attestation required at bid or at kickoff?"],
      },
    },
    relatedLabs: [{ name: "SOW Generator (Lite)", href: "/sow-generator-lite" }],
    sections: [
      {
        heading: "What it does",
        body: "Builds an RFP response package from the source RFP plus a capability library. First extracts every requirement and a compliance matrix. Then drafts cover letter, summary, approach, staffing, timeline, risk, security, pricing framework, differentiators, case studies, and a submission checklist. From ARC's Operator AI RFP prompt.",
      },
      {
        heading: "Pipeline",
        body: "1. **Extract** — every requirement; mandatory vs optional; weights if present.\n2. **Matrix** — map capabilities and case studies; mark FULL / PARTIAL / GAP.\n3. **Questions** — list clarification questions and assumptions.\n4. **Draft** — response sections that only use supported capabilities.\n5. **Check** — submission checklist; human approves claims.",
      },
      {
        heading: "Prompt skeleton",
        body: "```\nAnalyze the supplied RFP and create a response package.\n\nFirst:\n- Extract every requirement.\n- Classify mandatory versus optional.\n- Identify evaluation criteria and weights where present.\n- Create a compliance matrix.\n- Map supplied capabilities and case studies to requirements.\n- Identify gaps, assumptions, risks, and clarification questions.\n\nThen generate: executive cover letter, executive summary, understanding of need,\nproposed approach, technical response, delivery methodology, staffing, timeline,\ngovernance, risk management, security and compliance, pricing framework,\ndifferentiators, case studies, compliance matrix, submission checklist.\n\nDo not claim capabilities not supported by the supplied capability library.\nMark unsupported requirements as GAP or PARTIAL.\n```",
      },
      {
        heading: "Guardrails",
        body: "Do not claim capabilities that are not in the library. GAP stays GAP. Pricing framework is structure only unless a real rate card is supplied. Human submits the bid.",
      },
    ],
  },
  {
    slug: "consulting-assessment",
    title: "Consulting Assessment",
    category: "Consulting",
    summary:
      "Generate a technical, CRO, AWS, DevOps, or AI-readiness assessment from operating intelligence. Findings grounded in evidence IDs.",
    tags: ["assessment", "ai-readiness", "aws", "consulting"],
    updated: UPDATED,
    difficulty: "intermediate",
    source: "content/consulting/consulting-assessment.md",
    hitl: true,
    stack: ["LLM", "JSON", "Markdown"],
    tools: [
      { name: "intel-loader", kind: "api", purpose: "Load operating objects and evidence for the account." },
      { name: "assessment-model", kind: "llm", purpose: "Emit JSON + Markdown for the chosen assessment type." },
      { name: "reviewer", kind: "human", purpose: "Confirm findings before the client sees them." },
    ],
    requiredInput: ["account_name", "assessment_type", "intelligence"],
    example: {
      label: "AI readiness",
      input: {
        account_name: "Northstar Fitness",
        assessment_type: "ai_readiness",
        intelligence: { data_classification: "missing", approved_tools: ["ChatGPT consumer"], production_agents: 0 },
      },
      output: {
        type: "ai_readiness",
        current_state: ["Consumer ChatGPT in use", "No data classification"],
        risks: ["Unapproved tools on client data"],
        recommendations: ["Name approved tools", "Classify data", "Pick one workflow to design"],
        roadmap: ["30 days: policy", "60 days: one workflow", "90 days: measure"],
      },
    },
    relatedLabs: [
      { name: "SOW Generator (Lite)", href: "/sow-generator-lite" },
      { name: "RAG Readiness Checker", href: "/rag-readiness-checker" },
    ],
    sections: [
      {
        heading: "What it does",
        body: "Produces a consulting-grade assessment of type technical, cro, aws, devops, or ai_readiness. Separates current-state findings, risks, gaps, recommendations, and roadmap. Grounds findings in evidence IDs when available. From ARC's Operator AI assessment prompt.",
      },
      {
        heading: "Pipeline",
        body: "1. **Select** — assessment type.\n2. **Ground** — attach evidence IDs to each finding.\n3. **Separate** — current state, risks, gaps, recommendations, roadmap.\n4. **Emit** — JSON + Markdown.\n5. **Label** — mark synthetic accounts as synthetic.",
      },
      {
        heading: "Prompt skeleton",
        body: "```\nGenerate a consulting-grade assessment from the supplied structured operational intelligence.\n\nAssessment types supported: technical, cro, aws, devops, ai_readiness.\n\nRules:\n- Use only supplied facts and explicitly labeled assumptions.\n- Ground findings in evidence IDs or operating objects when available.\n- Separate current-state findings, risks, gaps, recommendations, and roadmap.\n- Never invent confidential client facts.\n- Clearly label the account and assessment as synthetic when the source intelligence is synthetic.\n- Return: 1) structured JSON  2) polished Markdown.\n```",
      },
      {
        heading: "Guardrails",
        body: "No invented client facts. Synthetic stays labeled synthetic. Human reviews before delivery. Do not sell a near-term fix as transformation.",
      },
    ],
  },
  {
    slug: "kickoff-brief",
    title: "Deal → Kickoff Brief",
    category: "Consulting",
    summary:
      "Turn a signed SOW or email thread into a kickoff brief: scope, deliverables, budget, deadline, stakeholders, access, and open questions. Reds block approval.",
    tags: ["kickoff", "handoff", "agency", "hitl"],
    updated: UPDATED,
    difficulty: "intermediate",
    source: "content/consulting/kickoff-brief.md",
    hitl: true,
    stack: ["LLM", "project tool", "email"],
    tools: [
      { name: "contract-parser", kind: "llm", purpose: "Extract scope, budget, dates, stakeholders with confidence." },
      { name: "gap-flagger", kind: "validator", purpose: "Red any missing deadline, budget, or named owner." },
      { name: "pm-review", kind: "human", purpose: "Resolve reds before tasks are created." },
      { name: "task-writer", kind: "api", purpose: "Create project tasks only after approval." },
    ],
    requiredInput: ["source_documents"],
    example: {
      label: "Agency kickoff",
      input: {
        source_documents: ["SOW signed 2026-08-01. Deliverables: readiness snapshot, one workflow design. Deadline not stated. Budget: $24k."],
      },
      output: {
        scope: ["Readiness snapshot", "One workflow design"],
        budget: "$24k",
        deadline: null,
        flags: [{ field: "deadline", severity: "red", note: "No date in source. Blocks approval." }],
        open_questions: ["What is the hard stop date?"],
      },
    },
    relatedLabs: [{ name: "SOW Generator (Lite)", href: "/sow-generator-lite" }],
    sections: [
      {
        heading: "What it does",
        body: "Closes the sales-to-delivery handoff. Parses a signed contract, SOW, or email thread into a kickoff brief with confidence-scored fields. Red flags block approval. On approval, create project tasks and draft the client confirmation. Pattern from ARC's KickoffPilot portfolio candidate.",
      },
      {
        heading: "Pipeline",
        body: "1. **Extract** — scope, deliverables, budget, deadline, stakeholders, access, open questions.\n2. **Score** — confidence per field.\n3. **Flag** — reds (missing deadline/budget/owner) block; yellows need a note.\n4. **HITL** — PM resolves reds.\n5. **Publish** — tasks + drafted client confirmation. Never auto-create tasks on red.",
      },
      {
        heading: "Prompt skeleton",
        body: "```\nExtract a kickoff brief from the supplied contract / SOW / email thread.\n\nReturn JSON with: scope[], deliverables[], budget, deadline, stakeholders[],\naccess_needed[], open_questions[], and flags[] where each flag has field,\nseverity (red|yellow), confidence (0-1), and evidence excerpt.\n\nRules:\n- Do not invent a deadline, budget, or owner.\n- If a field is missing, set it null and add a red flag.\n- Evidence excerpts must be verbatim.\n- Reds block task creation.\n```",
      },
      {
        heading: "Guardrails",
        body: "Reds block approval. Never auto-create project tasks or send the client email. Do not fill gaps with guesses. This is a handoff tool, not a project manager.",
      },
    ],
  },
  {
    slug: "approval-routing",
    title: "Approval Routing (Draft, Don't Move Money)",
    category: "Operations",
    summary:
      "Classify an inbound request, check policy, and route Green/Yellow/Red to the approver of record. Routes and drafts. Never moves money.",
    tags: ["approvals", "ops", "hitl", "policy"],
    updated: UPDATED,
    difficulty: "starter",
    source: "content/operations/approval-routing.md",
    hitl: true,
    stack: ["LLM", "policy engine", "ticketing"],
    tools: [
      { name: "classifier", kind: "llm", purpose: "Type, amount, vendor, requester from the inbound request." },
      { name: "policy-check", kind: "validator", purpose: "Deterministic budget/policy rules. Not the model." },
      { name: "router", kind: "queue", purpose: "Send to approver of record with a one-click packet." },
      { name: "approver", kind: "human", purpose: "Approve, reject, or request info. Nothing executes without this." },
    ],
    requiredInput: ["request_text", "policy"],
    example: {
      label: "Vendor onboarding",
      input: {
        request_text: "Please onboard Acme Cloud, $1,200/mo, requested by ops.",
        policy: { vendor_onboarding_limit: 500, approver: "finance-lead" },
      },
      output: {
        type: "vendor_onboarding",
        amount: 1200,
        triage: "Red",
        reason: "Amount exceeds vendor_onboarding_limit of 500.",
        approver: "finance-lead",
        draft: "Packet ready. No payment initiated.",
      },
    },
    relatedLabs: [{ name: "Structured Data Extraction", href: "/structured-extraction" }],
    sections: [
      {
        heading: "What it does",
        body: "Routes POs, expenses, vendor onboarding, time-off, and contract sign-off. The model classifies and extracts. A deterministic policy engine triages Green/Yellow/Red. A human clicks Approve, Reject, or Request-info. Pattern from ARC's ClearDesk candidate: routes and drafts, never moves money.",
      },
      {
        heading: "Pipeline",
        body: "1. **Classify + extract** — type, amount, vendor, dates, requester.\n2. **Policy check** — deterministic rules, not the model.\n3. **Triage** — Green / Yellow / Red.\n4. **Route** — approver of record with the packet.\n5. **HITL** — one-click decision; audit the outcome and time-to-decision.",
      },
      {
        heading: "Prompt skeleton",
        body: "```\nClassify this inbound approval request.\nReturn JSON: { type, amount, vendor, requester, dates, confidence, excerpts[] }.\nDo not decide Green/Yellow/Red. Do not recommend paying anyone.\nThe policy engine will triage. A human will decide.\n```",
      },
      {
        heading: "Guardrails",
        body: "Never move money, never auto-approve Green without a human, never let the model override policy. Fintech-disqualifier sidestep is load-bearing: this tool drafts a packet, it does not pay.",
      },
    ],
  },
  {
    slug: "rag-over-your-docs",
    title: "RAG Over Your Docs",
    category: "Retrieval",
    summary:
      "A retrieval-augmented Q&A pipeline: chunk, embed, retrieve, and answer with citations over your own documents.",
    tags: ["rag", "embeddings", "retrieval", "qa"],
    updated: UPDATED,
    difficulty: "intermediate",
    source: "content/retrieval/rag-over-your-docs.md",
    hitl: false,
    stack: ["embeddings", "vector DB", "LLM"],
    tools: [
      { name: "chunker", kind: "validator", purpose: "Split docs into ~500-token chunks with overlap." },
      { name: "embedder", kind: "api", purpose: "Store vectors plus source metadata." },
      { name: "retriever", kind: "retriever", purpose: "Top-k by cosine similarity with a minimum threshold." },
      { name: "answer-model", kind: "llm", purpose: "Answer only from retrieved context, with citations." },
    ],
    requiredInput: ["question", "corpus_id"],
    example: {
      label: "Policy question",
      input: { corpus_id: "hr-handbook", question: "What is the parental leave duration?" },
      output: {
        answer: "Parental leave is 16 weeks. [source: handbook.pdf#c12]",
        citations: ["handbook.pdf#c12"],
        retrieved: 5,
        below_threshold: false,
      },
    },
    relatedLabs: [{ name: "RAG Readiness Checker", href: "/rag-readiness-checker" }],
    sections: [
      {
        heading: "What it does",
        body: "Answers questions grounded in a document set instead of the model's memory. Chunks source docs, embeds them, retrieves the top-k relevant chunks per query, and asks the model to answer only from retrieved context, with inline citations back to the source.",
      },
      {
        heading: "Pipeline",
        body: "1. **Ingest** — split docs into ~500-token chunks with ~50-token overlap.\n2. **Embed** — store vectors + source metadata in a vector DB.\n3. **Retrieve** — embed the query, pull top-k (start with k=5) by cosine similarity.\n4. **Answer** — prompt the model with the chunks and require citations.\n5. **Fallback** — if no chunk clears a similarity threshold, say 'not found in the docs' rather than guessing.",
      },
      {
        heading: "Prompt skeleton",
        body: "```\nAnswer the question using ONLY the context below.\nCite each claim as [source: <file>#<chunk>].\nIf the context doesn't contain the answer, say so.\n\nContext:\n{retrieved_chunks}\n\nQuestion: {user_question}\n```",
      },
      {
        heading: "Guardrails",
        body: "Require citations and reject answers without them. Set a minimum similarity threshold so off-topic questions return 'not found' instead of a hallucination. Log the retrieved chunk IDs with every answer so you can audit wrong results.",
      },
    ],
  },
  {
    slug: "rag-readiness-checker",
    title: "RAG Readiness Checker",
    category: "Retrieval",
    summary:
      "Score whether a corpus is ready for RAG before you embed it: rights, freshness, structure, PII, and eval questions.",
    tags: ["rag", "readiness", "governance", "checklist"],
    updated: UPDATED,
    difficulty: "starter",
    source: "content/retrieval/rag-readiness-checker.md",
    hitl: true,
    stack: ["checklist", "optional LLM"],
    tools: [
      { name: "corpus-inventory", kind: "api", purpose: "List sources, owners, last-updated, access rights." },
      { name: "readiness-model", kind: "llm", purpose: "Score each axis and name the blocking gaps." },
      { name: "owner-review", kind: "human", purpose: "Confirm rights and PII before anything is embedded." },
    ],
    requiredInput: ["corpus_inventory"],
    example: {
      label: "Shared drive dump",
      input: {
        corpus_inventory: [
          { name: "Q3 board deck", owner: "CFO", last_updated: "2025-11-01", rights: "internal", pii: "unknown" },
        ],
      },
      output: {
        score: 42,
        grade: "D",
        blockers: ["PII unknown", "Stale by > 6 months", "No gold questions for eval"],
        next: ["Classify PII", "Drop or refresh stale decks", "Write 10 gold Q&A pairs"],
      },
    },
    relatedLabs: [{ name: "RAG Over Your Docs", href: "/rag-over-your-docs" }],
    sections: [
      {
        heading: "What it does",
        body: "Answers 'should we even embed this?' before a RAG project starts. Scores rights, freshness, structure, PII, and whether you have gold questions to eval against. Listed as a free ARC Labs utility in the Master Blueprint.",
      },
      {
        heading: "Pipeline",
        body: "1. **Inventory** — sources, owners, dates, access.\n2. **Score** — rights, freshness, structure, PII, eval coverage (0-100).\n3. **Blockers** — name what would make retrieval unsafe or useless.\n4. **Next** — the smallest set of fixes before ingest.\n5. **Gate** — do not embed until blockers are cleared or explicitly accepted.",
      },
      {
        heading: "Prompt skeleton",
        body: "```\nScore this corpus for RAG readiness on five axes (0-20 each):\nrights, freshness, structure, PII handling, eval coverage.\nReturn JSON: { score, grade, axes, blockers[], next[] }.\nDo not recommend embedding if rights or PII are unknown.\n```",
      },
      {
        heading: "Guardrails",
        body: "Unknown PII or unknown rights is a blocker, not a warning. Do not treat a shared-drive dump as a knowledge base. Human accepts residual risk in writing.",
      },
    ],
  },
  {
    slug: "email-draft-and-route",
    title: "Email Draft & Route",
    category: "Automation",
    summary:
      "Classify inbound email, route it to the right queue, and draft a reply for human approval. Never auto-send.",
    tags: ["email", "classification", "automation", "human-in-the-loop"],
    updated: UPDATED,
    difficulty: "starter",
    source: "content/automation/email-draft-and-route.md",
    hitl: true,
    stack: ["LLM", "email provider", "ticketing"],
    tools: [
      { name: "classifier", kind: "llm", purpose: "Intent, priority, sentiment." },
      { name: "router", kind: "queue", purpose: "Map intent to a team queue." },
      { name: "drafter", kind: "llm", purpose: "Write a reply with one clear next step." },
      { name: "review-inbox", kind: "human", purpose: "Approve or edit before send." },
    ],
    requiredInput: ["subject", "body"],
    example: {
      label: "Billing question",
      input: { subject: "Invoice 1841 looks high", body: "We were charged twice for July. Can you check?" },
      output: {
        intent: "billing",
        priority: "high",
        queue: "finance-ops",
        draft: "Thanks for flagging invoice 1841. We will check for a duplicate July charge and reply with what we find.",
        auto_send: false,
      },
    },
    sections: [
      {
        heading: "What it does",
        body: "Reads an inbound email, assigns a category and priority, routes it to the owning team, and drafts a reply that lands in a review queue. A human approves or edits before anything sends.",
      },
      {
        heading: "Pipeline",
        body: "1. **Classify** — intent + priority + sentiment from subject and body.\n2. **Route** — map intent to a team/queue.\n3. **Draft** — generate a reply with the right tone and a single clear next step.\n4. **Queue** — write the draft to a review inbox with the classification attached.\n5. **Approve** — human sends or edits; capture edits as training signal.",
      },
      {
        heading: "Guardrails",
        body: "Never auto-send. Anything touching billing, legal, or account changes is flagged for mandatory human review. Redact secrets and PII from logs. If classification confidence is low, route to a general triage queue rather than guessing.",
      },
    ],
  },
  {
    slug: "meeting-to-crm",
    title: "Meeting Notes → CRM Update",
    category: "Automation",
    summary:
      "Turn a call transcript into a structured CRM update: next steps, deal stage, risks, and a follow-up draft.",
    tags: ["crm", "sales", "transcription", "automation"],
    updated: UPDATED,
    difficulty: "intermediate",
    source: "content/automation/meeting-to-crm.md",
    hitl: true,
    stack: ["transcript", "LLM", "CRM API"],
    tools: [
      { name: "summarizer", kind: "llm", purpose: "Extract decisions, objections, commitments." },
      { name: "field-mapper", kind: "llm", purpose: "Align to CRM fields as a proposed diff." },
      { name: "rep-review", kind: "human", purpose: "Confirm the diff before write-back." },
      { name: "crm-writer", kind: "api", purpose: "Patch the record only after confirm." },
    ],
    requiredInput: ["transcript", "current_record"],
    example: {
      label: "Discovery call",
      input: {
        transcript: "We need a readiness snapshot before board in September. Stage is still discovery.",
        current_record: { stage: "discovery", next_step: null },
      },
      output: {
        proposed: { stage: "discovery", next_step: "Send readiness snapshot outline by Friday", close_date: "2026-09-30" },
        evidence: ["We need a readiness snapshot before board in September."],
        follow_up_draft: "Thanks for the time. As discussed, we will send the readiness snapshot outline this week.",
      },
    },
    relatedLabs: [{ name: "Evidence → Operating Objects", href: "/evidence-to-operating-objects" }],
    sections: [
      {
        heading: "What it does",
        body: "Converts a sales-call transcript into fields your CRM actually stores: proposed next step, updated deal stage, identified risks, and a follow-up email draft. All as a structured object a human confirms before write-back. Same shape as ARC's FieldNote portfolio candidate.",
      },
      {
        heading: "Pipeline",
        body: "1. **Summarize** — extract decisions, objections, and commitments.\n2. **Map** — align to CRM fields (stage, next step, close date, risk).\n3. **Draft** — write a follow-up email referencing the specific commitments.\n4. **Stage** — present the proposed update as a diff against the current record.\n5. **Write-back** — on human confirm, patch the CRM via its API.",
      },
      {
        heading: "Guardrails",
        body: "Only propose a stage change the transcript supports; show the evidence line. Never overwrite a human-entered field silently. Always diff and confirm. Store the transcript reference with the update for auditability.",
      },
    ],
  },
  {
    slug: "content-repurpose",
    title: "Content Repurposing Chain",
    category: "Content",
    summary:
      "Turn one long-form source into channel-native derivatives: thread, newsletter blurb, and executive summary. No new claims.",
    tags: ["content", "marketing", "repurposing", "chain"],
    updated: UPDATED,
    difficulty: "starter",
    source: "content/content/content-repurpose.md",
    hitl: true,
    stack: ["LLM"],
    tools: [
      { name: "extractor", kind: "llm", purpose: "Thesis + 3-5 supporting points from the source only." },
      { name: "fan-out", kind: "llm", purpose: "Generate each derivative from the skeleton, not from each other." },
      { name: "claim-check", kind: "validator", purpose: "Reject claims that are not in the source." },
      { name: "editor", kind: "human", purpose: "Approve before publish." },
    ],
    requiredInput: ["source_text"],
    example: {
      label: "Labs launch post",
      input: { source_text: "ARC Labs ships free operator tools. Prompt Reviewer scores system prompts. No model call." },
      output: {
        skeleton: { thesis: "ARC Labs ships free operator tools", points: ["Prompt Reviewer scores prompts", "No model call"] },
        thread: ["ARC Labs ships free operator tools.", "Prompt Reviewer scores system prompts. No model call."],
        newsletter: "New from ARC Labs: Prompt Reviewer. Paste a system prompt, get a score. No model call.",
      },
    },
    sections: [
      {
        heading: "What it does",
        body: "Takes one canonical piece (a post, doc, or talk transcript) and produces several channel-specific versions that stay faithful to the source: a short social thread, a newsletter blurb, and a one-paragraph executive summary.",
      },
      {
        heading: "Pipeline",
        body: "1. **Extract** — pull the core thesis and 3–5 supporting points.\n2. **Fan out** — generate each derivative from the extracted skeleton, not from each other (avoids drift).\n3. **Constrain** — apply per-channel length and tone limits.\n4. **Check** — verify every derivative's claims trace back to the source.",
      },
      {
        heading: "Guardrails",
        body: "Generate each format from the shared skeleton, never by re-summarizing a summary. No new claims may appear that are not in the source. Keep links and attributions intact.",
      },
    ],
  },
  {
    slug: "structured-extraction",
    title: "Structured Data Extraction",
    category: "Extraction",
    summary:
      "Extract a validated JSON object from messy text (invoices, resumes, forms) with a schema and a bounded repair loop.",
    tags: ["extraction", "json", "schema", "validation"],
    updated: UPDATED,
    difficulty: "advanced",
    source: "content/extraction/structured-extraction.md",
    hitl: true,
    stack: ["LLM", "Zod / JSON Schema"],
    tools: [
      { name: "extract-model", kind: "llm", purpose: "Emit JSON matching the schema." },
      { name: "validator", kind: "validator", purpose: "Parse against Zod / JSON Schema." },
      { name: "repair", kind: "llm", purpose: "At most two retries with validator errors." },
      { name: "reviewer", kind: "human", purpose: "Handle needs_review fields after retries fail." },
    ],
    requiredInput: ["document_text", "schema_name"],
    example: {
      label: "Invoice",
      input: { document_text: "Invoice 1841 · Acme · July 2026 · $1,200", schema_name: "invoice" },
      output: { invoice_id: "1841", vendor: "Acme", period: "2026-07", amount: 1200, needs_review: [] },
    },
    relatedLabs: [{ name: "Evidence → Operating Objects", href: "/evidence-to-operating-objects" }],
    sections: [
      {
        heading: "What it does",
        body: "Pulls structured fields out of unstructured documents and guarantees the output matches a schema. The model emits JSON; a validator checks it; on failure the errors are fed back for a bounded repair attempt.",
      },
      {
        heading: "Pipeline",
        body: "1. **Define** — a strict schema (types, required fields, enums).\n2. **Extract** — prompt the model to emit JSON matching the schema.\n3. **Validate** — parse against the schema (e.g. Zod / JSON Schema).\n4. **Repair** — on validation error, return the errors to the model for up to 2 retries.\n5. **Escalate** — after retries fail, flag for human review with the raw output attached.",
      },
      {
        heading: "Guardrails",
        body: "Never accept unvalidated output downstream. Cap repair retries to avoid loops and cost blowups. For low-confidence fields (e.g. a total that doesn't reconcile), mark them `needs_review` rather than passing a bad value through.",
      },
    ],
  },
  {
    slug: "agentic-research-brief",
    title: "Agentic Research Brief",
    category: "Research",
    summary:
      "A plan-search-synthesize agent loop that produces a cited research brief with an explicit confidence note.",
    tags: ["agent", "research", "search", "synthesis"],
    updated: UPDATED,
    difficulty: "advanced",
    source: "content/research/agentic-research-brief.md",
    hitl: true,
    stack: ["LLM", "search", "citation store"],
    tools: [
      { name: "planner", kind: "llm", purpose: "Decompose into 3-6 sub-questions." },
      { name: "search", kind: "retriever", purpose: "Retrieve sources per sub-question." },
      { name: "synthesizer", kind: "llm", purpose: "Write the brief with citations and a confidence note." },
      { name: "analyst", kind: "human", purpose: "Accept or send back conflicts." },
    ],
    requiredInput: ["question"],
    example: {
      label: "MCP adoption",
      input: { question: "Where does MCP conformance usually break in the wild?" },
      output: {
        sub_questions: ["Handshake failures", "Tool schema drift", "Auth"],
        brief: "Public servers most often fail capability negotiation and tool schemas.",
        confidence: "medium",
        conflicts: [],
      },
    },
    relatedLabs: [
      { name: "MCP Conformance Scanner", href: "https://arc-website-pi-five.vercel.app/labs/mcp-conformance-scanner" },
    ],
    sections: [
      {
        heading: "What it does",
        body: "Answers an open research question by planning sub-questions, searching for each, and synthesizing a brief with citations and a stated confidence level. Flags where sources disagree instead of papering over it.",
      },
      {
        heading: "Pipeline",
        body: "1. **Plan** — decompose the question into 3–6 sub-questions.\n2. **Search** — retrieve sources per sub-question (web, docs, or internal).\n3. **Extract** — pull the relevant claim + citation from each source.\n4. **Synthesize** — write the brief, citing every claim.\n5. **Assess** — end with a confidence note and list unresolved conflicts.",
      },
      {
        heading: "Guardrails",
        body: "Every non-obvious claim must carry a citation. When sources conflict, present both and say so. Cap search depth and total tool calls to bound cost. State the confidence level explicitly so readers can calibrate.",
      },
    ],
  },
  {
    slug: "prompt-review-gate",
    title: "Prompt Review Gate",
    category: "Quality",
    summary:
      "Run ARC Prompt Reviewer as a CI gate: score clarity, ambiguity, injection surface, and failure modes before a prompt ships.",
    tags: ["prompts", "ci", "quality", "sister-tool"],
    updated: UPDATED,
    difficulty: "starter",
    source: "content/quality/prompt-review-gate.md",
    hitl: false,
    stack: ["Prompt Reviewer CLI", "GitHub Actions"],
    tools: [
      { name: "prompt-reviewer", kind: "validator", purpose: "Static review. No model call." },
      { name: "ci", kind: "api", purpose: "Fail the job when grade is below --min-grade." },
    ],
    requiredInput: ["prompt_path"],
    example: {
      label: "Support copilot prompt",
      input: { prompt_path: "prompts/support-copilot.md", min_grade: "B" },
      output: { score: 48, grade: "F", gate: "fail", top_gaps: ["No instruction priority", "Ambiguous 'be helpful'"] },
    },
    relatedLabs: [
      { name: "Prompt Reviewer", href: "https://arc-website-pi-five.vercel.app/labs/prompt-reviewer" },
    ],
    sections: [
      {
        heading: "What it does",
        body: "Wraps the free ARC Prompt Reviewer as a workflow step. Paste or path a system prompt, get a 0-100 score, letter grade, and concrete rewrites. Fail CI when the grade is below the bar. Static and reproducible. No model call.",
      },
      {
        heading: "Pipeline",
        body: "1. **Collect** — prompt file (and optional tool list) in the PR.\n2. **Review** — `npm run review -- path/to/prompt.txt --min-grade=B`.\n3. **Report** — Markdown/JSON on the PR.\n4. **Gate** — fail the check under the minimum grade.\n5. **Rewrite** — apply suggested blocks and re-run.",
      },
      {
        heading: "Prompt skeleton",
        body: "```\nnpm run review -- prompts/system.md --tools tools.txt --min-grade=B --json\n```",
      },
      {
        heading: "Guardrails",
        body: "A high grade means the prompt states the right defenses, not that a live model is unbreakable. Always red-team before production. Sister tool: github.com/aking-beep/prompt-reviewer.",
      },
    ],
  },
  {
    slug: "mcp-conformance-gate",
    title: "MCP Conformance Gate",
    category: "Quality",
    summary:
      "Point ARC's MCP Conformance Scanner at a server before it ships. Handshake, schemas, and a graded report with operator-ready fixes.",
    tags: ["mcp", "ci", "conformance", "sister-tool"],
    updated: UPDATED,
    difficulty: "starter",
    source: "content/quality/mcp-conformance-gate.md",
    hitl: false,
    stack: ["MCP Conformance Scanner", "CI"],
    tools: [
      { name: "scanner", kind: "validator", purpose: "Handshake, capability negotiation, tool/resource schemas." },
      { name: "ci", kind: "api", purpose: "Publish the graded report and fail on breaks." },
    ],
    requiredInput: ["server_url"],
    example: {
      label: "Public MCP server",
      input: { server_url: "https://mcp.example.com" },
      output: {
        handshake: "pass",
        capability_negotiation: "3 findings",
        tool_schemas: "pass",
        resource_schemas: "1 break",
        grade: "B-",
      },
    },
    relatedLabs: [
      { name: "MCP Conformance Scanner", href: "https://arc-website-pi-five.vercel.app/labs/mcp-conformance-scanner" },
    ],
    sections: [
      {
        heading: "What it does",
        body: "Runs the free ARC MCP Conformance Scanner as a workflow gate. Point it at a Model Context Protocol server and get a conformance report: what passes, what breaks, and what to fix first. Flagship ARC Labs tool.",
      },
      {
        heading: "Pipeline",
        body: "1. **Point** — server URL or local process.\n2. **Scan** — handshake, capability negotiation, schema checks.\n3. **Grade** — operator-ready findings, not a linter dump.\n4. **Share** — report link on the PR.\n5. **Gate** — fail CI on handshake or schema breaks.",
      },
      {
        heading: "Prompt skeleton",
        body: "```\n# Point the scanner at the server under test.\n# Fail the job if handshake or tool schemas break.\n# Attach the report URL to the PR.\n```",
      },
      {
        heading: "Guardrails",
        body: "A passing handshake is not production-ready by itself. Read the findings. Sister tool: github.com/aking-beep/mcp-conformance-scanner.",
      },
    ],
  },
];
