import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import path from "node:path";
import { parseSkillMarkdown } from "./parse";
import type { SkillCard, SkillPackage } from "./types";

export const SKILLS_DIR = path.join(process.cwd(), "skills");

type SnapshotFile = {
  skills: { slug: string; raw: string; extras: string[] }[];
};

function extrasInDir(dir: string): string[] {
  return readdirSync(dir)
    .filter((f) => f !== "SKILL.md" && !f.startsWith("."))
    .sort();
}

function parseOne(slug: string, raw: string, extras: string[]): SkillPackage {
  const { skill, errors } = parseSkillMarkdown(raw, {
    slug,
    source: `skills/${slug}/SKILL.md`,
    extras,
  });
  if (errors.length) {
    const msg = errors.map((e) => `${e.field}: ${e.message}`).join("; ");
    throw new Error(`Invalid skill ${slug}: ${msg}`);
  }
  return skill;
}

function loadFromFs(): SkillPackage[] | null {
  if (!existsSync(SKILLS_DIR)) return null;
  const skills: SkillPackage[] = [];
  for (const slug of readdirSync(SKILLS_DIR).sort()) {
    const dir = path.join(SKILLS_DIR, slug);
    if (!statSync(dir).isDirectory()) continue;
    const skillPath = path.join(dir, "SKILL.md");
    if (!existsSync(skillPath)) continue;
    skills.push(parseOne(slug, readFileSync(skillPath, "utf8"), extrasInDir(dir)));
  }
  return skills;
}

function loadFromSnapshot(): SkillPackage[] | null {
  const snapPath = path.join(process.cwd(), "lib", "skills", "snapshot.json");
  if (!existsSync(snapPath)) return null;
  try {
    const snap = JSON.parse(readFileSync(snapPath, "utf8")) as SnapshotFile;
    return (snap.skills ?? []).map((s) => parseOne(s.slug, s.raw, s.extras ?? []));
  } catch {
    return null;
  }
}

export function loadAllSkills(): SkillPackage[] {
  const fromFs = loadFromFs();
  if (fromFs && fromFs.length) return fromFs;
  const fromSnap = loadFromSnapshot();
  if (fromSnap && fromSnap.length) return fromSnap;
  return [];
}

let cache: SkillPackage[] | null = null;

export function getSkills(): SkillPackage[] {
  if (!cache) cache = loadAllSkills();
  return cache;
}

export function getSkill(slug: string): SkillPackage | undefined {
  return getSkills().find((s) => s.slug === slug);
}

export function toCard(skill: SkillPackage): SkillCard {
  return {
    slug: skill.slug,
    title: skill.title,
    category: skill.metadata.category,
    summary: skill.description,
    tags: skill.metadata.tags,
    difficulty: skill.metadata.difficulty,
    updated: skill.metadata.updated,
  };
}

export function allCategories(skills = getSkills()): string[] {
  return Array.from(new Set(skills.map((s) => s.metadata.category))).sort();
}

export function allTags(skills = getSkills()): string[] {
  return Array.from(new Set(skills.flatMap((s) => s.metadata.tags))).sort();
}

export function searchSkills(query: string, category: string | null, skills = getSkills()): SkillPackage[] {
  const q = query.trim().toLowerCase();
  return skills.filter((s) => {
    if (category && s.metadata.category !== category) return false;
    if (!q) return true;
    const hay = [s.title, s.description, s.metadata.category, ...s.metadata.tags, s.body].join(" ").toLowerCase();
    return hay.includes(q);
  });
}
