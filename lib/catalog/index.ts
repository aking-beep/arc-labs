import { allCategories, allTags, getSkill, getSkills, searchSkills, toCard } from "@/lib/skills/load";
import type { SkillPackage } from "@/lib/skills/types";
import { CONFIG } from "./config";
import type { CatalogItem } from "./types";

export { CONFIG };
export { getSkills, getSkill, allCategories, allTags, searchSkills, toCard };

/** @deprecated Prefer SkillPackage from lib/skills. Kept so existing pages compile during the 0.2 cutover. */
export function toCatalogItem(skill: SkillPackage): CatalogItem {
  return {
    slug: skill.slug,
    title: skill.title,
    category: skill.metadata.category,
    summary: skill.description,
    tags: skill.metadata.tags,
    updated: skill.metadata.updated,
    difficulty: skill.metadata.difficulty,
    source: skill.source,
    sections: [{ heading: "Skill", body: skill.body }],
  };
}

export function getItem(slug: string): CatalogItem | undefined {
  const s = getSkill(slug);
  return s ? toCatalogItem(s) : undefined;
}
