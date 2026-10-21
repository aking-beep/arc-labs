import Link from "next/link";
import { notFound } from "next/navigation";
import { CONFIG, ITEMS, getItem } from "@/lib/catalog";
import { Markdown } from "@/components/Markdown";
import { CopyButton } from "@/components/CopyButton";
import { DryRun } from "@/components/DryRun";

export const dynamicParams = false;

export function generateStaticParams() {
  return ITEMS.map((i) => ({ slug: i.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const item = getItem(slug);
  return {
    title: item ? `${item.title} — ARC Labs ${CONFIG.title}` : CONFIG.title,
    description: item?.summary,
  };
}

function promptBody(item: ReturnType<typeof getItem>) {
  return item?.sections.find((s) => s.heading.toLowerCase().includes("prompt"))?.body ?? "";
}

export default async function ItemPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const item = getItem(slug);
  if (!item) notFound();

  const prompt = promptBody(item);
  const markdownExport = [
    `# ${item.title}`,
    "",
    item.summary,
    "",
    ...item.sections.flatMap((s) => [`## ${s.heading}`, "", s.body, ""]),
  ].join("\n");

  return (
    <main className="min-h-screen">
      <div className="mx-auto max-w-3xl px-4 py-10 space-y-6">
        <Link href="/" className="text-sm text-sub hover:text-ink">
          ← {CONFIG.title}
        </Link>

        <div className="space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <span className="pill text-brand border-brand/40 bg-brand/10">{item.category}</span>
            {item.difficulty && <span className="pill">{item.difficulty}</span>}
            {item.hitl ? (
              <span className="pill text-warn border-warn/40">HITL required</span>
            ) : (
              <span className="pill text-good border-good/40">CI-safe</span>
            )}
            <span className="text-xs text-sub">updated {item.updated}</span>
          </div>
          <h1 className="text-3xl font-bold">{item.title}</h1>
          <p className="text-sub leading-relaxed">{item.summary}</p>
          <div className="flex flex-wrap gap-1.5">
            {item.tags.map((t) => (
              <span key={t} className="text-[11px] text-sub">
                #{t}
              </span>
            ))}
          </div>
          <div className="flex flex-wrap gap-2 pt-1">
            <CopyButton text={markdownExport} label="Copy Markdown" />
            {prompt ? <CopyButton text={prompt.replace(/```/g, "").trim()} label="Copy prompt" /> : null}
            {item.source && (
              <a
                className="btn-ghost text-xs py-1.5 px-2.5"
                href={`${CONFIG.repo}/blob/main/${item.source}`}
                target="_blank"
                rel="noreferrer"
              >
                View source →
              </a>
            )}
          </div>
        </div>

        <section className="card p-5 space-y-3">
          <h2 className="text-ink font-semibold text-base">Tools in the pipeline</h2>
          <ul className="space-y-2">
            {item.tools.map((t) => (
              <li key={t.name} className="flex items-start gap-3 text-sm">
                <span className="pill text-[10px] uppercase tracking-wide">{t.kind}</span>
                <div>
                  <div className="text-ink font-medium">{t.name}</div>
                  <div className="text-xs text-sub">{t.purpose}</div>
                </div>
              </li>
            ))}
          </ul>
          <div className="text-xs text-sub">Stack: {item.stack.join(" · ")}</div>
        </section>

        {item.sections.map((s, n) => (
          <section key={n} className="card p-5 space-y-2">
            <div className="flex items-center justify-between gap-2">
              <h2 className="text-ink font-semibold text-base">{s.heading}</h2>
              {s.heading.toLowerCase().includes("prompt") ? (
                <CopyButton text={s.body.replace(/```/g, "").trim()} label="Copy" />
              ) : null}
            </div>
            <Markdown body={s.body} />
          </section>
        ))}

        <DryRun slug={item.slug} example={item.example} />

        {item.relatedLabs && item.relatedLabs.length > 0 && (
          <section className="card p-5 space-y-2">
            <h2 className="text-ink font-semibold text-base">Related</h2>
            <ul className="space-y-1.5 text-sm">
              {item.relatedLabs.map((r) => (
                <li key={r.href}>
                  <Link href={r.href} className="text-brand hover:underline">
                    {r.name} →
                  </Link>
                </li>
              ))}
            </ul>
          </section>
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
