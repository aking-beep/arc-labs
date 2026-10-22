#!/usr/bin/env tsx
import { CONFIG } from "../lib/catalog";
import { allCategories, getSkills, searchSkills, toCard } from "../lib/skills/load";

function usage(): never {
  console.error(`Usage:
  npm run catalog                 List every ${CONFIG.noun}
  npm run catalog -- <query>      Search ${CONFIG.nounPlural}
  npm run catalog -- --category="Engineering"
  npm run catalog -- --json`);
  process.exit(2);
}

const args = process.argv.slice(2);
if (args.includes("-h") || args.includes("--help")) usage();

let query = "";
let category: string | null = null;
let asJson = false;
for (const a of args) {
  if (a === "--json") asJson = true;
  else if (a.startsWith("--category=")) category = a.split("=")[1] ?? null;
  else if (a.startsWith("-")) usage();
  else query = a;
}

const results = searchSkills(query, category);
const cards = results.map(toCard);

if (asJson) {
  console.log(JSON.stringify(cards, null, 2));
} else {
  console.log(`${CONFIG.title} — ${results.length}/${getSkills().length} ${CONFIG.nounPlural}`);
  console.log(`Categories: ${allCategories().join(", ")}\n`);
  for (const r of cards) {
    console.log(`• ${r.title}  [${r.category} · ${r.difficulty}]`);
    console.log(`  ${r.summary}`);
    console.log(`  /${r.slug}  tags: ${r.tags.join(", ")}\n`);
  }
}
