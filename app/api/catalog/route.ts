import { NextResponse } from "next/server";
import { CONFIG, allCategories, getSkill, getSkills, searchSkills, toCard } from "@/lib/catalog";

export const runtime = "nodejs";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const slug = searchParams.get("slug");
  const format = searchParams.get("format");

  if (slug) {
    const skill = getSkill(slug);
    if (!skill) return NextResponse.json({ error: "Not found" }, { status: 404 });
    if (format === "raw" || format === "md") {
      return new NextResponse(skill.raw, {
        status: 200,
        headers: {
          "content-type": "text/markdown; charset=utf-8",
          "content-disposition": `inline; filename="SKILL.md"`,
        },
      });
    }
    return NextResponse.json({
      item: {
        ...toCard(skill),
        license: skill.license,
        compatibility: skill.compatibility,
        source: skill.source,
        extras: skill.extras,
        body: skill.body,
      },
    });
  }

  const category = searchParams.get("category");
  const q = searchParams.get("q") ?? "";
  const items = searchSkills(q, category).map(toCard);
  return NextResponse.json({
    product: CONFIG.product,
    version: CONFIG.version,
    spec: "https://agentskills.io/specification",
    count: items.length,
    total: getSkills().length,
    categories: allCategories(),
    items,
  });
}
