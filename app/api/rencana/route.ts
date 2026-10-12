import { NextResponse, type NextRequest } from "next/server";
import { generatePlan } from "@/lib/ai/planner";
import { PlanRequestSchema } from "@/lib/ai/schema";
import { readSource, sourceFailureMessage, type SourceContent } from "@/lib/ai/source";

// Orkestrasi tahap rencana: validasi input → baca link (cache) → planner → validasi rencana.
// Belum menyimpan ke database (BUILD-PLAN urutan F); klien menyimpan hasilnya di browser.
export const maxDuration = 60;

export async function POST(request: NextRequest) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Format permintaan tidak valid." }, { status: 400 });
  }
  const parsed = PlanRequestSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Isian Studio tidak lengkap atau tidak valid." }, { status: 400 });
  const req = parsed.data;

  let source: SourceContent | null = null;
  let sourceCached = false;
  if (req.mode === "link" && !req.pastedText.trim()) {
    const result = await readSource(req.link);
    if (!result.ok) return NextResponse.json({ error: sourceFailureMessage[result.reason], needsPaste: result.reason !== "invalid_url" }, { status: 422 });
    source = result.content;
    sourceCached = result.cached;
  }

  const result = await generatePlan(req, source);
  if (!result.ok) return NextResponse.json({ error: result.error }, { status: 502 });

  // Catat pemakaian token untuk usage_ledger (sementara di log server).
  if (result.usage) console.info("planner_usage", JSON.stringify({ ...result.usage, attempts: result.attempts, promptVersion: result.promptVersion }));

  return NextResponse.json({
    mode: result.mode,
    plan: result.plan,
    issues: result.issues,
    promptVersion: result.promptVersion,
    source: source ? { title: source.title, url: source.url, cached: sourceCached } : null,
  });
}
