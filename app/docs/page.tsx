import Link from "next/link";
import { CONFIG, ITEMS, allCategories } from "@/lib/catalog";

export const metadata = {
  title: `Docs — ARC Labs ${CONFIG.title}`,
  description: `How to browse, use, and contribute to ${CONFIG.title}.`,
};

export default function DocsPage() {
  return (
    <main className="min-h-screen">
      <div className="mx-auto max-w-3xl px-4 py-10 space-y-8">
        <Link href="/" className="text-sm text-sub hover:text-ink">← {CONFIG.title}</Link>
        <h1 className="text-3xl font-bold">Docs</h1>
        <p className="text-sub leading-relaxed">{CONFIG.description}</p>

        <section className="card p-5 space-y-2">
          <h2 className="font-semibold">What&apos;s in the catalog</h2>
          <p className="text-sm text-sub">
            {ITEMS.length} {CONFIG.nounPlural} across {allCategories().length} categories:{" "}
            {allCategories().join(", ")}. Each entry is self-contained and written to be copied and adapted directly
            into your own work.
          </p>
        </section>

        <section className="card p-5 space-y-2">
          <h2 className="font-semibold">How to use a {CONFIG.noun}</h2>
          <ol className="list-decimal pl-5 text-sm text-sub space-y-1.5">
            <li>Open any entry and read it top to bottom — the sections build on each other.</li>
            <li>Copy the parts you need into your prompt, codebase, diagram, or design doc.</li>
            <li>Keep the guardrails, trade-offs, and failure notes — that&apos;s the hard-won part.</li>
            <li>Adapt names, thresholds, and specifics to your context.</li>
          </ol>
        </section>

        <section className="card p-5 space-y-2">
          <h2 className="font-semibold">API</h2>
          <p className="text-sm text-sub">Read-only JSON, no key required:</p>
          <pre className="rounded-xl bg-bg border border-line p-3 text-xs font-mono whitespace-pre-wrap">
{`GET /api/catalog                     # list all
GET /api/catalog?category=<name>     # filter by category
GET /api/catalog?slug=<slug>         # a single ${CONFIG.noun}`}
          </pre>
          <p className="text-xs text-sub">Every field is also available in the open content repo.</p>
        </section>

        <section className="card p-5 space-y-2">
          <h2 className="font-semibold">CLI</h2>
          <pre className="rounded-xl bg-bg border border-line p-3 text-xs font-mono whitespace-pre-wrap">
{`npm run catalog                      # list every ${CONFIG.noun}
npm run catalog -- "search term"     # search
npm run catalog -- --category="Name"
npm run catalog -- --json            # machine-readable`}
          </pre>
        </section>

        <section className="card p-5 space-y-2">
          <h2 className="font-semibold">Contributing</h2>
          <p className="text-sm text-sub">
            Everything is open. Add a new entry to{" "}
            <code className="font-mono text-xs">lib/catalog/data.ts</code>, mirror it as a Markdown file under{" "}
            <code className="font-mono text-xs">content/</code>, and open a PR on{" "}
            <a className="text-brand hover:underline" href={CONFIG.repo} target="_blank" rel="noreferrer">GitHub</a>.
          </p>
        </section>
      </div>
    </main>
  );
}
