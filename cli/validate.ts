#!/usr/bin/env tsx
import { readdirSync, readFileSync, statSync } from "node:fs";
import path from "node:path";
import { parseSkillMarkdown, validateSkillFields } from "../lib/skills/parse";
import { SKILLS_DIR } from "../lib/skills/load";

let failed = 0;
let passed = 0;

let entries: string[] = [];
try {
  entries = readdirSync(SKILLS_DIR);
} catch {
  console.error(`No skills/ directory at ${SKILLS_DIR}`);
  process.exit(1);
}

const seen = new Set<string>();

for (const slug of entries.sort()) {
  const dir = path.join(SKILLS_DIR, slug);
  if (!statSync(dir).isDirectory()) continue;
  const file = path.join(dir, "SKILL.md");
  let raw: string;
  try {
    raw = readFileSync(file, "utf8");
  } catch {
    console.error(`✗ ${slug}: missing SKILL.md`);
    failed++;
    continue;
  }
  const { skill, errors } = parseSkillMarkdown(raw, {
    slug,
    source: `skills/${slug}/SKILL.md`,
  });
  const extra = validateSkillFields({ name: skill.name, description: skill.description, dirName: slug });
  const all = [...errors, ...extra];
  if (seen.has(skill.name)) all.push({ field: "name", message: `duplicate name ${skill.name}` });
  seen.add(skill.name);
  if (!skill.body.includes("## Guardrails") && !skill.body.includes("## guardrails")) {
    all.push({ field: "body", message: "skill body should include a ## Guardrails section" });
  }
  if (all.length) {
    console.error(`✗ ${slug}`);
    for (const e of all) console.error(`    ${e.field}: ${e.message}`);
    failed++;
  } else {
    console.log(`✓ ${slug}`);
    passed++;
  }
}

console.log(`\n${passed} valid, ${failed} invalid`);
process.exit(failed ? 1 : 0);
