import Link from "next/link";
import { CONFIG } from "@/lib/catalog";
import { SiteHeader } from "@/components/SiteHeader";

const ITEMS: { label: string; done: boolean; note: string }[] = [
  { label: "Agent Skills SKILL.md packages as the source of truth", done: true, note: "Shipped in 0.2" },
  { label: "Library drawn from ARC Labs tools and operator SOPs", done: true, note: "20 skills across 10 categories" },
  { label: "Searchable, filterable browse UI", done: true, note: "Shipped in 0.1" },
  { label: "Copy / download SKILL.md + install paths", done: true, note: "Shipped in 0.2" },
  { label: "Read-only JSON + raw Markdown API", done: true, note: "Shipped in 0.2" },
  { label: "CLI catalog + spec validator in CI", done: true, note: "Shipped in 0.2" },
  { label: "Community contribution guide + PR template", done: true, note: "Shipped in 0.2" },
  { label: "Open in Cursor / Claude deep links", done: false, note: "Next" },
  { label: "Versioned skills + per-skill changelog", done: false, note: "Later" },
  { label: "Skill bundles by role (eng, ops, growth)", done: false, note: "Later" },
];

export default function RoadmapPage() {
  return (
    <main className="min-h-screen">
      <SiteHeader />
      <div className="mx-auto max-w-3xl px-4 py-10 space-y-8">
        <Link href="/" className="text-sm text-sub hover:text-ink">
          ← {CONFIG.title}
        </Link>
        <h1 className="text-3xl font-bold">Roadmap</h1>
        <ul className="space-y-3">
          {ITEMS.map((item) => (
            <li key={item.label} className="card p-4 flex items-start gap-3">
              <span className={item.done ? "text-good" : "text-sub"}>{item.done ? "✓" : "○"}</span>
              <div>
                <div className="font-medium text-sm">{item.label}</div>
                <div className="text-xs text-sub mt-0.5">{item.note}</div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </main>
  );
}
