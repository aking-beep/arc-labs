import type { Difficulty, SkillMeta, SkillPackage } from "./types";

const NAME_RE = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const DIFFICULTIES: Difficulty[] = ["starter", "intermediate", "advanced"];

export interface ParseError {
  field: string;
  message: string;
}

function unquote(value: string): string {
  const v = value.trim();
  if ((v.startsWith('"') && v.endsWith('"')) || (v.startsWith("'") && v.endsWith("'"))) {
    return v.slice(1, -1);
  }
  return v;
}

/** Minimal YAML frontmatter parser for Agent Skills SKILL.md files. */
export function splitFrontmatter(raw: string): { yaml: string; body: string } | null {
  const text = raw.replace(/^\uFEFF/, "");
  if (!text.startsWith("---")) return null;
  const rest = text.slice(3);
  const nl = rest.startsWith("\r\n") ? 2 : rest.startsWith("\n") ? 1 : 0;
  const after = rest.slice(nl);
  const end = after.search(/\r?\n---\r?\n/);
  if (end < 0) return null;
  const yaml = after.slice(0, end);
  const close = after.slice(end).match(/^\r?\n---\r?\n/);
  const body = after.slice(end + (close ? close[0].length : 0)).replace(/^\r?\n/, "");
  return { yaml, body };
}

function parseYamlBlock(yaml: string): Record<string, unknown> {
  const out: Record<string, unknown> = {};
  let nested: Record<string, string> | null = null;
  let nestedKey: string | null = null;

  for (const line of yaml.split(/\r?\n/)) {
    if (!line.trim() || line.trim().startsWith("#")) continue;
    const nestedMatch = line.match(/^  ([A-Za-z0-9_-]+):\s*(.*)$/);
    if (nested && nestedMatch) {
      nested[nestedMatch[1]] = unquote(nestedMatch[2]);
      continue;
    }
    const top = line.match(/^([A-Za-z0-9_-]+):\s*(.*)$/);
    if (!top) continue;
    if (nested && nestedKey) {
      out[nestedKey] = nested;
      nested = null;
      nestedKey = null;
    }
    const key = top[1];
    const value = top[2];
    if (value === "" || value === "|" || value === ">") {
      nested = {};
      nestedKey = key;
    } else {
      out[key] = unquote(value);
    }
  }
  if (nested && nestedKey) out[nestedKey] = nested;
  return out;
}

function titleFromBody(body: string, fallback: string): string {
  const m = body.match(/^#\s+(.+)$/m);
  return (m?.[1] ?? fallback).trim();
}

function asMeta(raw: unknown): SkillMeta {
  const obj = raw && typeof raw === "object" ? (raw as Record<string, string>) : {};
  const difficulty = DIFFICULTIES.includes(obj.difficulty as Difficulty)
    ? (obj.difficulty as Difficulty)
    : "starter";
  const tags = (obj.tags ?? "")
    .split(",")
    .map((t) => t.trim())
    .filter(Boolean);
  return {
    author: obj.author?.trim() || "ARC Transformation Group",
    version: obj.version?.trim() || "1.0",
    category: obj.category?.trim() || "General",
    difficulty,
    tags,
    updated: obj.updated?.trim() || new Date().toISOString().slice(0, 10),
  };
}

export function validateSkillFields(input: {
  name: string;
  description: string;
  dirName?: string;
}): ParseError[] {
  const errors: ParseError[] = [];
  if (!input.name) errors.push({ field: "name", message: "name is required" });
  else if (input.name.length > 64) errors.push({ field: "name", message: "name must be ≤ 64 characters" });
  else if (!NAME_RE.test(input.name)) {
    errors.push({
      field: "name",
      message: "name must be lowercase alphanumeric with single hyphens (no leading/trailing hyphen)",
    });
  }
  if (input.dirName && input.dirName !== input.name) {
    errors.push({ field: "name", message: `name "${input.name}" must match directory "${input.dirName}"` });
  }
  if (!input.description) errors.push({ field: "description", message: "description is required" });
  else if (input.description.length > 1024) {
    errors.push({ field: "description", message: "description must be ≤ 1024 characters" });
  }
  return errors;
}

export function parseSkillMarkdown(
  raw: string,
  opts: { slug: string; source: string; extras?: string[] },
): { skill: SkillPackage; errors: ParseError[] } {
  const split = splitFrontmatter(raw);
  if (!split) {
    return {
      skill: emptySkill(opts, raw),
      errors: [{ field: "frontmatter", message: "SKILL.md must start with YAML frontmatter (---)" }],
    };
  }
  const data = parseYamlBlock(split.yaml);
  const name = String(data.name ?? opts.slug);
  const description = String(data.description ?? "");
  const errors = validateSkillFields({ name, description, dirName: opts.slug });
  const skill: SkillPackage = {
    slug: opts.slug,
    name,
    title: titleFromBody(split.body, name),
    description,
    license: String(data.license ?? "MIT"),
    compatibility: String(data.compatibility ?? ""),
    metadata: asMeta(data.metadata),
    body: split.body.trim() + "\n",
    raw: raw.replace(/\r\n/g, "\n"),
    source: opts.source,
    extras: opts.extras ?? [],
  };
  return { skill, errors };
}

function emptySkill(opts: { slug: string; source: string; extras?: string[] }, raw: string): SkillPackage {
  return {
    slug: opts.slug,
    name: opts.slug,
    title: opts.slug,
    description: "",
    license: "MIT",
    compatibility: "",
    metadata: asMeta({}),
    body: raw,
    raw,
    source: opts.source,
    extras: opts.extras ?? [],
  };
}
