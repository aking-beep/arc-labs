"use client";

import { useState } from "react";
import type { WorkflowExample } from "@/lib/catalog/types";

type Result = {
  ok: boolean;
  missing: string[];
  extra: string[];
  hitl: boolean;
  steps: string[];
  note: string;
  exampleOutput: Record<string, unknown>;
  error?: string;
};

export function DryRun({
  slug,
  example,
}: {
  slug: string;
  example: WorkflowExample;
}) {
  const [json, setJson] = useState(() => JSON.stringify(example.input, null, 2));
  const [result, setResult] = useState<Result | null>(null);
  const [loading, setLoading] = useState(false);

  async function run() {
    setLoading(true);
    setResult(null);
    let input: Record<string, unknown> = {};
    try {
      input = JSON.parse(json) as Record<string, unknown>;
    } catch {
      setResult({
        ok: false,
        missing: [],
        extra: [],
        hitl: true,
        steps: [],
        note: "",
        exampleOutput: {},
        error: "Input is not valid JSON.",
      });
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("/api/dry-run", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ slug, input }),
      });
      const data = (await res.json()) as Result & { error?: string };
      if (!res.ok) {
        setResult({
          ok: false,
          missing: [],
          extra: [],
          hitl: true,
          steps: [],
          note: "",
          exampleOutput: {},
          error: data.error || "Dry-run failed.",
        });
      } else {
        setResult(data);
      }
    } catch {
      setResult({
        ok: false,
        missing: [],
        extra: [],
        hitl: true,
        steps: [],
        note: "",
        exampleOutput: {},
        error: "Network error.",
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="card p-5 space-y-3">
      <div className="flex items-center justify-between gap-2">
        <h2 className="text-ink font-semibold text-base">Structural dry-run</h2>
        <span className="text-[11px] text-sub">No model call. Validates required fields only.</span>
      </div>
      <p className="text-xs text-sub">
        Prefills the example payload for <span className="text-ink">{example.label}</span>. Edit it, then run.
      </p>
      <textarea
        className="input font-mono text-xs min-h-[160px]"
        value={json}
        onChange={(e) => setJson(e.target.value)}
        spellCheck={false}
      />
      <button type="button" className="btn-primary text-sm" onClick={run} disabled={loading}>
        {loading ? "Checking…" : "Run dry-run"}
      </button>
      {result && (
        <div className="rounded-xl border border-line bg-bg p-4 space-y-2 text-sm">
          {result.error ? (
            <p className="text-bad">{result.error}</p>
          ) : (
            <>
              <p className={result.ok ? "text-good" : "text-bad"}>
                {result.ok ? "Payload has the required fields." : `Missing: ${result.missing.join(", ")}`}
              </p>
              {result.hitl && (
                <p className="text-warn text-xs">Human gate required before any send, write, or deploy.</p>
              )}
              {result.steps.length > 0 && (
                <ol className="list-decimal pl-5 text-xs text-sub space-y-1">
                  {result.steps.map((s) => (
                    <li key={s}>{s}</li>
                  ))}
                </ol>
              )}
              <p className="text-xs text-sub">{result.note}</p>
              <pre className="rounded-xl bg-panel2 border border-line p-3 text-xs font-mono overflow-x-auto whitespace-pre">
                {JSON.stringify(result.exampleOutput, null, 2)}
              </pre>
            </>
          )}
        </div>
      )}
    </section>
  );
}
