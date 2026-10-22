// Shared catalog types for ARC Labs AI Workflow Templates.

export interface CatalogSection {
  heading: string;
  /** Markdown-lite body: headings (##/###), lists (- / 1.), fenced code, **bold**, `code`. */
  body: string;
}

export type Difficulty = "starter" | "intermediate" | "advanced";

export type ToolKind = "llm" | "retriever" | "api" | "queue" | "human" | "validator";

export interface WorkflowTool {
  name: string;
  kind: ToolKind;
  purpose: string;
}

export interface WorkflowExample {
  label: string;
  input: Record<string, unknown>;
  output: Record<string, unknown>;
}

export interface RelatedLab {
  name: string;
  href: string;
}

export interface CatalogItem {
  slug: string;
  title: string;
  category: string;
  summary: string;
  tags: string[];
  updated: string;
  difficulty?: Difficulty;
  sections: CatalogSection[];
  /** Relative path to the canonical source file in the open content repo. */
  source?: string;
  /** True when a human must approve before any external side effect. */
  hitl: boolean;
  /** Suggested stack to wire the template into. */
  stack: string[];
  tools: WorkflowTool[];
  /** Top-level keys a dry-run payload must include. */
  requiredInput: string[];
  example: WorkflowExample;
  relatedLabs?: RelatedLab[];
}

export interface CatalogConfig {
  product: string;
  title: string;
  noun: string;
  nounPlural: string;
  apiPath: string;
  tagline: string;
  description: string;
  repo: string;
  site: string;
  updated: string;
  version: string;
}

export interface DryRunResult {
  ok: boolean;
  slug: string;
  title: string;
  missing: string[];
  extra: string[];
  hitl: boolean;
  tools: WorkflowTool[];
  steps: string[];
  note: string;
  exampleOutput: Record<string, unknown>;
}
