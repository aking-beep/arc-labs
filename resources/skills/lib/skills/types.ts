export type Difficulty = "starter" | "intermediate" | "advanced";

export interface SkillMeta {
  author: string;
  version: string;
  category: string;
  difficulty: Difficulty;
  tags: string[];
  updated: string;
}

export interface SkillPackage {
  /** Directory name and SKILL.md `name` field. */
  slug: string;
  name: string;
  title: string;
  description: string;
  license: string;
  compatibility: string;
  metadata: SkillMeta;
  /** Markdown body after frontmatter (no leading ---). */
  body: string;
  /** Full SKILL.md file contents. */
  raw: string;
  /** Relative path from repo root, e.g. skills/pr-review-summary/SKILL.md */
  source: string;
  /** Optional extra files in the skill directory (examples.md, reference.md). */
  extras: string[];
}

export interface SkillCard {
  slug: string;
  title: string;
  category: string;
  summary: string;
  tags: string[];
  difficulty: Difficulty;
  updated: string;
}
