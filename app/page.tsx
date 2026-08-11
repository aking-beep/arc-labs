import { CONFIG, allCategories, getSkills, toCard } from "@/lib/catalog";
import { Catalog } from "@/components/Catalog";
import { Subscribe } from "@/components/Subscribe";
import { SiteHeader } from "@/components/SiteHeader";

export default function Home() {
  const skills = getSkills();
  const cards = skills.map(toCard);
  const categories = allCategories();

  return (
    <main className="min-h-screen">
      <SiteHeader />

      <div className="mx-auto max-w-5xl px-4 py-10 space-y-8">
        <section className="space-y-4 animate-fade-up">
          <div className="pill w-fit border-brand/40 text-brand bg-brand/10">Free · Open repository</div>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight max-w-2xl">{CONFIG.tagline}</h1>
          <p className="text-sub max-w-2xl leading-relaxed">{CONFIG.description}</p>
          <p className="text-xs text-sub">
            {skills.length} skills across {categories.length} categories · Agent Skills{" "}
            <code className="font-mono">SKILL.md</code> spec · MIT
          </p>
        </section>

        <Catalog items={cards} categories={categories} noun={CONFIG.nounPlural} />

        <section className="card p-5 space-y-3">
          <div className="font-semibold text-sm">Get notified when new {CONFIG.nounPlural} land (optional)</div>
          <p className="text-xs text-sub">
            Everything here is free and browsable without an account. This is just for updates.
          </p>
          <Subscribe />
        </section>

        <footer className="pt-8 pb-16 text-xs text-sub border-t border-line">
          <p>
            ARC Labs builds free operator tools. Contributions welcome — open a PR on{" "}
            <a className="text-brand hover:underline" href={CONFIG.repo} target="_blank" rel="noreferrer">
              GitHub
            </a>
            .
          </p>
        </footer>
      </div>
    </main>
  );
}
