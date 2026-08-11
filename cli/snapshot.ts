#!/usr/bin/env tsx
import { mkdirSync, writeFileSync } from "node:fs";
import path from "node:path";
import { loadAllSkills } from "../lib/skills/load";

const outDir = path.join(process.cwd(), "lib", "skills");
mkdirSync(outDir, { recursive: true });
const skills = loadAllSkills();
const payload = skills.map((s) => ({
  slug: s.slug,
  raw: s.raw,
  extras: s.extras,
}));
const out = path.join(outDir, "snapshot.json");
writeFileSync(out, JSON.stringify({ generatedAt: new Date().toISOString(), skills: payload }, null, 2));
console.log(`Wrote ${skills.length} skills to ${path.relative(process.cwd(), out)}`);
