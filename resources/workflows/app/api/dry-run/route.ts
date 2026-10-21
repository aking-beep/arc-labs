import { NextResponse } from "next/server";
import { z } from "zod";
import { dryRunTemplate } from "@/lib/catalog/validate";
import { LIMITS, clientIp, rateLimit } from "@/lib/security/ratelimit";

export const runtime = "nodejs";

const bodySchema = z.object({
  slug: z.string().min(1).max(200),
  input: z.record(z.unknown()).optional(),
});

export async function POST(req: Request) {
  const ip = clientIp(req);
  const rl = await rateLimit(`dryrun:${ip}`, LIMITS.scan.limit, LIMITS.scan.windowMs);
  if (!rl.ok) {
    return NextResponse.json({ error: "Rate limited. Try again later." }, { status: 429 });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON." }, { status: 400 });
  }

  const parsed = bodySchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "slug is required." }, { status: 400 });
  }

  const result = dryRunTemplate(parsed.data.slug, parsed.data.input);
  if ("error" in result) {
    return NextResponse.json({ error: result.error }, { status: result.status });
  }
  return NextResponse.json(result);
}
