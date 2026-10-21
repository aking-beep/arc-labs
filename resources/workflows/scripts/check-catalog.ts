#!/usr/bin/env tsx
import { ITEMS } from "../lib/catalog/data";
import { dryRunTemplate } from "../lib/catalog/validate";
import { allCategories, getItem } from "../lib/catalog";

let failed = 0;
function fail(msg: string) {
  failed += 1;
  console.error("FAIL", msg);
}

const slugs = new Set<string>();
for (const item of ITEMS) {
  if (!item.slug) fail("item missing slug");
  if (slugs.has(item.slug)) fail(`duplicate slug ${item.slug}`);
  slugs.add(item.slug);
  if (!item.title || !item.summary || !item.category) fail(`${item.slug}: missing identity`);
  if (!item.sections.some((s) => s.heading.toLowerCase() === "what it does")) {
    fail(`${item.slug}: missing What it does`);
  }
  if (!item.sections.some((s) => s.heading.toLowerCase() === "pipeline")) {
    fail(`${item.slug}: missing Pipeline`);
  }
  if (!item.sections.some((s) => s.heading.toLowerCase() === "guardrails")) {
    fail(`${item.slug}: missing Guardrails`);
  }
  if (!item.tools.length) fail(`${item.slug}: no tools`);
  if (!item.requiredInput.length) fail(`${item.slug}: no requiredInput`);
  if (!item.example?.input || !item.example?.output) fail(`${item.slug}: missing example`);
  if (!item.source?.endsWith(".md")) fail(`${item.slug}: source must be a markdown path`);
  if (typeof item.hitl !== "boolean") fail(`${item.slug}: hitl must be boolean`);

  for (const key of item.requiredInput) {
    if (!(key in item.example.input)) fail(`${item.slug}: example.input missing ${key}`);
  }

  const result = dryRunTemplate(item.slug, item.example.input);
  if ("error" in result) fail(`${item.slug}: dry-run error ${result.error}`);
  else if (!result.ok) fail(`${item.slug}: dry-run missing ${result.missing.join(",")}`);

  const looked = getItem(item.slug);
  if (!looked) fail(`${item.slug}: getItem miss`);
}

if (allCategories().length < 3) fail("expected at least 3 categories");
if (ITEMS.length < 12) fail(`expected a full catalog, got ${ITEMS.length}`);

if (failed) {
  console.error(`\n${failed} check(s) failed across ${ITEMS.length} templates.`);
  process.exit(1);
}
console.log(`ok: ${ITEMS.length} templates, ${allCategories().length} categories, dry-runs pass.`);
