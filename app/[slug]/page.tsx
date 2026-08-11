import Link from "next/link";
import { notFound } from "next/navigation";
import { CONFIG, ITEMS, getItem } from "@/lib/catalog";
import { Markdown } from "@/components/Markdown";

export const dynamicParams = false;

export function generateStaticParams() {
  return ITEMS.map((i) => ({ slug: i.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }) {
  const item = getItem(params.slug);
  return {
    title: item ? `${item.title} — ARC Labs ${CONFIG.title}` : CONFIG.title,
    description: item?.summary,
  };
}

export default function ItemPage({ params }: { params: { slug: string } }) {
  const item = getItem(params.slug);
  if (!item) notFound();

  return (
    <main className="min-h-screen">
      <div className="mx-auto max-w-3xl px-4 py-10 space-y-6">
        <Link href="/" className="text-sm text-sub hover:text-ink">← {CONFIG.title}</Link>

        <div className="space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <span className="pill text-brand border-brand/40 bg-brand/10">{item.category}</span>
            {item.difficulty && <span className="pill">{item.difficulty}</span>}
            <span className="text-xs text-sub">updated {item.updated}</span>
          </div>
          <h1 className="text-3xl font-bold">{item.title}</h1>
          <p className="text-sub leading-relaxed">{item.summary}</p>
          <div className="flex flex-wrap gap-1.5">
            {item.tags.map((t) => (
              <span key={t} className="text-[11px] text-sub">#{t}</span>
            ))}
          </div>
          {item.source && (
            <a className="text-xs text-brand hover:underline" href={`${CONFIG.repo}/blob/main/${item.source}`} target="_blank" rel="noreferrer">
              View source in repo →
            </a>
          )}
        </div>

        {item.sections.map((s, n) => (
          <section key={n} className="card p-5 space-y-2">
            <h2 className="text-ink font-semibold text-base">{s.heading}</h2>
            <Markdown body={s.body} />
          </section>
        ))}

        <div className="pt-2">
          <Link href="/" className="btn-ghost text-sm">← Back to all {CONFIG.nounPlural}</Link>
        </div>
      </div>
    </main>
  );
}
