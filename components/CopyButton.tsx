"use client";

import { useState } from "react";

export function CopyButton({
  text,
  label = "Copy SKILL.md",
  className = "btn-primary text-sm",
}: {
  text: string;
  label?: string;
  className?: string;
}) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {
      /* ignore */
    }
  }

  return (
    <button type="button" className={className} onClick={copy}>
      {copied ? "Copied" : label}
    </button>
  );
}
