import { GITHUB_REPO, SITE_LAB, SKILLS_UPDATED, SKILLS_VERSION } from "@/lib/version";
import type { CatalogConfig } from "./types";

export const CONFIG: CatalogConfig = {
  product: "ARC Skills",
  title: "ARC Skills",
  noun: "skill",
  nounPlural: "skills",
  apiPath: "skills",
  tagline: "Open, copy-pasteable agent skills for real operator work.",
  description:
    "A free, open library of production-ready agent skills. Each one is a self-contained SKILL.md package — name, description, steps, and guardrails — written to drop into Claude, Cursor, or any Agent Skills runtime. No account, no lock-in.",
  repo: GITHUB_REPO,
  site: SITE_LAB,
  updated: SKILLS_UPDATED,
  version: SKILLS_VERSION,
};
