import { ITEMS } from "./data";
import type { CatalogItem, DryRunResult } from "./types";

function getItem(slug: string): CatalogItem | undefined {
  return ITEMS.find((i) => i.slug === slug);
}

function pipelineSteps(item: CatalogItem): string[] {
  const pipeline = item.sections.find((s) => s.heading.toLowerCase() === "pipeline");
  if (!pipeline) return item.tools.map((t) => t.name);
  return pipeline.body
    .split("\n")
    .map((line) => line.replace(/^\d+\.\s*/, "").trim())
    .filter(Boolean);
}

export function dryRunTemplate(
  slug: string,
  input: Record<string, unknown> | null | undefined,
): DryRunResult | { error: string; status: number } {
  const item = getItem(slug);
  if (!item) return { error: "Template not found.", status: 404 };

  const payload = input && typeof input === "object" ? input : {};
  const keys = Object.keys(payload);
  const missing = item.requiredInput.filter((k) => !(k in payload) || payload[k] == null || payload[k] === "");
  const extra = keys.filter((k) => !item.requiredInput.includes(k) && k !== "label");

  return {
    ok: missing.length === 0,
    slug: item.slug,
    title: item.title,
    missing,
    extra,
    hitl: item.hitl,
    tools: item.tools,
    steps: pipelineSteps(item),
    note: item.hitl
      ? "Structural dry-run only. No model is called and no side effect is executed. Keep the human gate before any write, send, or deploy."
      : "Structural dry-run only. No model is called. Wire your own model and tools to run this for real.",
    exampleOutput: item.example.output,
  };
}
