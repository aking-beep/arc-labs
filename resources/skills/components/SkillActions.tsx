"use client";

import { CopyButton } from "./CopyButton";

export function SkillActions({
  slug,
  raw,
}: {
  slug: string;
  raw: string;
}) {
  const cursorPath = `~/.cursor/skills/${slug}/SKILL.md`;
  const projectPath = `.cursor/skills/${slug}/SKILL.md`;
  const claudePath = `.claude/skills/${slug}/SKILL.md`;

  function download() {
    const blob = new Blob([raw], { type: "text/markdown;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "SKILL.md";
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="card p-5 space-y-4">
      <div className="font-semibold text-sm">Install this skill</div>
      <p className="text-xs text-sub leading-relaxed">
        Copy the file into your agent runtime. Cursor loads personal skills from{" "}
        <code className="font-mono text-[11px] text-ink">{cursorPath}</code> and project skills from{" "}
        <code className="font-mono text-[11px] text-ink">{projectPath}</code>. Claude Code looks in{" "}
        <code className="font-mono text-[11px] text-ink">{claudePath}</code>.
      </p>
      <div className="flex flex-wrap gap-2">
        <CopyButton text={raw} label="Copy SKILL.md" />
        <button type="button" className="btn-ghost text-sm" onClick={download}>
          Download SKILL.md
        </button>
        <CopyButton text={cursorPath} label="Copy Cursor path" className="btn-ghost text-sm" />
      </div>
    </div>
  );
}
