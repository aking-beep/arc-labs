import React from "react";

function renderInline(text: string, keyBase: string): React.ReactNode[] {
  const nodes: React.ReactNode[] = [];
  const regex = /(\*\*[^*]+\*\*|`[^`]+`)/g;
  let last = 0;
  let m: RegExpExecArray | null;
  let idx = 0;
  while ((m = regex.exec(text)) !== null) {
    if (m.index > last) nodes.push(text.slice(last, m.index));
    const token = m[0];
    if (token.startsWith("**")) {
      nodes.push(
        <strong key={`${keyBase}-b-${idx}`} className="text-ink font-semibold">
          {token.slice(2, -2)}
        </strong>,
      );
    } else {
      nodes.push(
        <code key={`${keyBase}-c-${idx}`} className="rounded bg-bg border border-line px-1 py-0.5 text-[0.85em] font-mono">
          {token.slice(1, -1)}
        </code>,
      );
    }
    last = m.index + token.length;
    idx++;
  }
  if (last < text.length) nodes.push(text.slice(last));
  return nodes;
}

function isTableRow(line: string): boolean {
  const t = line.trim();
  return t.startsWith("|") && t.endsWith("|");
}

function isTableDivider(line: string): boolean {
  return /^\|?\s*:?-{3,}:?\s*(\|\s*:?-{3,}:?\s*)+\|?$/.test(line.trim());
}

function splitRow(line: string): string[] {
  return line
    .trim()
    .replace(/^\|/, "")
    .replace(/\|$/, "")
    .split("|")
    .map((c) => c.trim());
}

export function Markdown({ body }: { body: string }) {
  const lines = body.replace(/\r/g, "").split("\n");
  const blocks: React.ReactNode[] = [];
  let i = 0;
  let key = 0;

  while (i < lines.length) {
    const line = lines[i];

    if (line.trim() === "") {
      i++;
      continue;
    }

    if (line.trim().startsWith("```")) {
      const code: string[] = [];
      i++;
      while (i < lines.length && !lines[i].trim().startsWith("```")) {
        code.push(lines[i]);
        i++;
      }
      i++;
      blocks.push(
        <pre key={key++} className="rounded-xl bg-bg border border-line p-3 text-xs font-mono text-ink overflow-x-auto whitespace-pre">
          {code.join("\n")}
        </pre>,
      );
      continue;
    }

    if (line.startsWith("> ")) {
      const quote: string[] = [];
      while (i < lines.length && lines[i].startsWith(">")) {
        quote.push(lines[i].replace(/^>\s?/, ""));
        i++;
      }
      blocks.push(
        <blockquote key={key++} className="border-l-2 border-brand/50 pl-3 text-sub italic">
          {renderInline(quote.join(" "), `q-${key}`)}
        </blockquote>,
      );
      continue;
    }

    if (isTableRow(line) && i + 1 < lines.length && isTableDivider(lines[i + 1])) {
      const header = splitRow(line);
      i += 2;
      const rows: string[][] = [];
      while (i < lines.length && isTableRow(lines[i])) {
        rows.push(splitRow(lines[i]));
        i++;
      }
      blocks.push(
        <div key={key++} className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr>
                {header.map((h, n) => (
                  <th key={n} className="text-left text-ink font-semibold border-b border-line py-2 pr-3">
                    {renderInline(h, `th-${key}-${n}`)}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((row, r) => (
                <tr key={r} className="border-b border-line/60">
                  {row.map((c, n) => (
                    <td key={n} className="py-2 pr-3 align-top">
                      {renderInline(c, `td-${key}-${r}-${n}`)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>,
      );
      continue;
    }

    if (line.startsWith("### ")) {
      blocks.push(
        <h3 key={key++} className="text-ink font-semibold text-sm mt-4">
          {renderInline(line.slice(4), `h3-${key}`)}
        </h3>,
      );
      i++;
      continue;
    }
    if (line.startsWith("## ")) {
      blocks.push(
        <h2 key={key++} className="text-ink font-semibold text-base mt-5">
          {renderInline(line.slice(3), `h2-${key}`)}
        </h2>,
      );
      i++;
      continue;
    }
    if (line.startsWith("# ")) {
      blocks.push(
        <h1 key={key++} className="text-ink font-bold text-lg mt-2">
          {renderInline(line.slice(2), `h1-${key}`)}
        </h1>,
      );
      i++;
      continue;
    }

    if (/^[-*] /.test(line)) {
      const items: string[] = [];
      while (i < lines.length && /^[-*] /.test(lines[i])) {
        items.push(lines[i].replace(/^[-*] /, ""));
        i++;
      }
      blocks.push(
        <ul key={key++} className="list-disc pl-5 space-y-1">
          {items.map((it, n) => (
            <li key={n}>{renderInline(it, `ul-${key}-${n}`)}</li>
          ))}
        </ul>,
      );
      continue;
    }

    if (/^\d+\.\s/.test(line)) {
      const items: string[] = [];
      while (i < lines.length && /^\d+\.\s/.test(lines[i])) {
        items.push(lines[i].replace(/^\d+\.\s/, ""));
        i++;
      }
      blocks.push(
        <ol key={key++} className="list-decimal pl-5 space-y-1">
          {items.map((it, n) => (
            <li key={n}>{renderInline(it, `ol-${key}-${n}`)}</li>
          ))}
        </ol>,
      );
      continue;
    }

    const para: string[] = [];
    while (
      i < lines.length &&
      lines[i].trim() !== "" &&
      !/^([-*]|\d+\.)\s/.test(lines[i]) &&
      !lines[i].startsWith("#") &&
      !lines[i].trim().startsWith("```") &&
      !lines[i].startsWith(">") &&
      !(isTableRow(lines[i]) && i + 1 < lines.length && isTableDivider(lines[i + 1]))
    ) {
      para.push(lines[i]);
      i++;
    }
    blocks.push(
      <p key={key++} className="leading-relaxed">
        {renderInline(para.join(" "), `p-${key}`)}
      </p>,
    );
  }

  return <div className="space-y-2 text-sm text-sub">{blocks}</div>;
}
