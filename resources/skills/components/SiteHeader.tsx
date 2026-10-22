import Link from "next/link";
import { CONFIG } from "@/lib/catalog";
import { SKILLS_VERSION_LABEL } from "@/lib/version";

export function SiteHeader() {
  return (
    <header className="border-b border-line/80 backdrop-blur sticky top-0 z-20 bg-bg/80">
      <div className="mx-auto max-w-5xl px-4 py-3 flex items-center justify-between gap-3">
        <Link href="/" className="text-left">
          <div className="text-sm font-semibold tracking-tight">ARC Labs · {CONFIG.title}</div>
          <div className="text-[11px] text-sub">
            {SKILLS_VERSION_LABEL} · updated {CONFIG.updated}
          </div>
        </Link>
        <div className="flex items-center gap-2">
          <Link href="/docs" className="btn-ghost text-xs py-2">
            Docs
          </Link>
          <Link href="/roadmap" className="btn-ghost text-xs py-2">
            Roadmap
          </Link>
          <a href={CONFIG.repo} target="_blank" rel="noreferrer" className="btn-ghost text-xs py-2">
            GitHub
          </a>
        </div>
      </div>
    </header>
  );
}
