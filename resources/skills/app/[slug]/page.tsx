import Link from "next/link";
import { notFound } from "next/navigation";
import { CONFIG, getSkill, getSkills } from "@/lib/catalog";
import { Markdown } from "@/components/Markdown";
import { SkillActions } from "@/components/SkillActions";
import { SiteHeader } from "@/components/SiteHeader";

export const dynamicParams = false;

export function generateStaticParams() {
  return getSkills().map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const skill = getSkill(slug);
  return {
    title: skill ? `${skill.title} — ARC Labs ${CONFIG.title}` : CONFIG.title,
    description: skill?.description,
  };
}

export default async function ItemPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const skill = getSkill(slug);
  if (!skill) notFound();

  return (
    <main className="min-h-screen">
      <SiteHeader />
      <div className="mx-auto max-w-3xl px-4 py-10 space-y-6">
        <Link href="/" className="text-sm text-sub hover:text-ink">
          ← {CONFIG.title}
        </Link>

        <div className="space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <span className="pill text-brand border-brand/40 bg-brand/10">{skill.metadata.category}</span>
            <span className="pill">{skill.metadata.difficulty}</span>
            <span className="text-xs text-sub">updated {skill.metadata.updated}</span>
            <span className="text-xs text-sub">v{skill.metadata.version}</span>
          </div>
          <h1 className="text-3xl font-bold">{skill.title}</h1>
          <p className="text-sub leading-relaxed">{skill.description}</p>
          <div className="flex flex-wrap gap-1.5">
            {skill.metadata.tags.map((t) => (
              <span key={t} className="text-[11px] text-sub">
                #{t}
              </span>
            ))}
          </div>
          <a
            className="text-xs text-brand hover:underline"
            href={`${CONFIG.repo}/blob/main/${skill.source}`}
            target="_blank"
            rel="noreferrer"
          >
            View source in repo →
          </a>
        </div>

        <SkillActions slug={skill.slug} raw={skill.raw} />

        <section className="card p-5">
          <Markdown body={skill.body} />
        </section>

        {skill.extras.length > 0 && (
          <p className="text-xs text-sub">
            Extra files in this package: {skill.extras.join(", ")}
          </p>
        )}

        <div className="pt-2">
          <Link href="/" className="btn-ghost text-sm">
            ← Back to all {CONFIG.nounPlural}
          </Link>
        </div>
      </div>
    </main>
  );
}
