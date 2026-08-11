#!/usr/bin/env tsx
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { ITEMS } from "../lib/catalog/data";

const root = join(process.cwd(), "content");

for (const item of ITEMS) {
  const rel = item.source ?? `content/${item.category.toLowerCase()}/${item.slug}.md`;
  const path = rel.startsWith("content/") ? join(process.cwd(), rel) : join(root, rel);
  mkdirSync(dirname(path), { recursive: true });
  const body = [
    "---",
    `title: ${item.title}`,
    `category: ${item.category}`,
    `difficulty: ${item.difficulty ?? "intermediate"}`,
    `tags: [${item.tags.join(", ")}]`,
    `updated: ${item.updated}`,
    `hitl: ${item.hitl}`,
    `stack: [${item.stack.join(", ")}]`,
    "---",
    "",
    `# ${item.title}`,
    "",
    item.summary,
    "",
    ...item.sections.flatMap((s) => [`## ${s.heading}`, s.body, ""]),
    "## Tools",
    ...item.tools.map((t) => `- **${t.name}** (${t.kind}) — ${t.purpose}`),
    "",
    "## Example input",
    "```json",
    JSON.stringify(item.example.input, null, 2),
    "```",
    "",
    "## Example output",
    "```json",
    JSON.stringify(item.example.output, null, 2),
    "```",
    "",
  ].join("\n");
  writeFileSync(path, body);
  console.log("wrote", rel);
}
