import Link from "next/link";
import { CONFIG, allCategories, getSkills } from "@/lib/catalog";
import { SiteHeader } from "@/components/SiteHeader";
import { SPEC_URL } from "@/lib/version";

export const metadata = {
  title: `Docs — ARC Labs ${CONFIG.title}`,
  description: `How to browse, install, and contribute to ${CONFIG.title}.`,
};

export default function DocsPage() {
  const skills = getSkills();
  const categories = allCategories();

  return (
    <main className="min-h-screen">
      <SiteHeader />
      <div className="mx-auto max-w-3xl px-4 py-10 space-y-8">
        <Link href="/" className="text-sm text-sub hover:text-ink">
          ← {CONFIG.title}
        </Link>
        <h1 className="text-3xl font-bold">Docs</h1>
        <p className="text-sub leading-relaxed">{CONFIG.description}</p>

        <section className="card p-5 space-y-2">
          <h2 className="font-semibold">What&apos;s in the catalog</h2>
          <p className="text-sm text-sub">
            {skills.length} {CONFIG.nounPlural} across {categories.length} categories: {categories.join(", ")}.
            Each package is a directory with a <code className="font-mono text-xs">SKILL.md</code> that follows the{" "}
            <a className="text-brand hover:underline" href={SPEC_URL} target="_blank" rel="noreferrer">
              Agent Skills specification
            </a>
            .
          </p>
        </section>

        <section className="card p-5 space-y-2">
          <h2 className="font-semibold">Install a skill</h2>
          <ol className="list-decimal pl-5 text-sm text-sub space-y-1.5">
            <li>Open the skill and read <strong className="text-ink">When to use</strong> and <strong className="text-ink">Guardrails</strong> first.</li>
            <li>
              Copy <code className="font-mono text-xs">SKILL.md</code> into your runtime:
              <ul className="list-disc pl-5 mt-1 space-y-0.5">
                <li>
                  Cursor personal: <code className="font-mono text-xs">~/.cursor/skills/&lt;slug&gt;/SKILL.md</code>
                </li>
                <li>
                  Cursor project: <code className="font-mono text-xs">.cursor/skills/&lt;slug&gt;/SKILL.md</code>
                </li>
                <li>
                  Claude Code: <code className="font-mono text-xs">.claude/skills/&lt;slug&gt;/SKILL.md</code>
                </li>
              </ul>
            </li>
            <li>Keep the guardrails verbatim. Adapt trigger phrases to how your users actually ask.</li>
          </ol>
        </section>

        <section className="card p-5 space-y-2">
          <h2 className="font-semibold">API</h2>
          <p className="text-sm text-sub">Read-only JSON, no key required:</p>
          <pre className="rounded-xl bg-bg border border-line p-3 text-xs font-mono whitespace-pre-wrap">{`GET /api/catalog
GET /api/catalog?category=Engineering
GET /api/catalog?q=review
GET /api/catalog?slug=pr-review-summary
GET /api/catalog?slug=pr-review-summary&format=raw`}</pre>
        </section>

        <section className="card p-5 space-y-2">
          <h2 className="font-semibold">CLI</h2>
          <pre className="rounded-xl bg-bg border border-line p-3 text-xs font-mono whitespace-pre-wrap">{`npm run catalog
npm run catalog -- "incident"
npm run catalog -- --category="Engineering"
npm run catalog -- --json
npm run validate`}</pre>
        </section>

        <section className="card p-5 space-y-2">
          <h2 className="font-semibold">Contributing</h2>
          <p className="text-sm text-sub">
            Add a directory under <code className="font-mono text-xs">skills/&lt;slug&gt;/</code> with a valid{" "}
            <code className="font-mono text-xs">SKILL.md</code> (YAML frontmatter: <code className="font-mono text-xs">name</code> +{" "}
            <code className="font-mono text-xs">description</code>, plus a <code className="font-mono text-xs">## Guardrails</code>{" "}
            section). Run <code className="font-mono text-xs">npm run validate</code> and open a PR. See{" "}
            <code className="font-mono text-xs">CONTRIBUTING.md</code>.
          </p>
        </section>
      </div>
    </main>
  );
}
