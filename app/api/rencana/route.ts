import { NextResponse, type NextRequest } from "next/server";
import { generatePlan } from "@/lib/ai/planner";
import { PlanRequestSchema } from "@/lib/ai/schema";

// Orkestrasi tahap rencana: validasi input → planner (brief, durasi, storyboard) → validasi rencana.
// Belum menyimpan ke database (BUILD-PLAN urutan F); klien menyimpan hasilnya di browser.
// Claude dengan structured output + satu kali perbaikan bisa lebih dari 60 detik.
export const maxDuration = 300;

export async function POST(request: NextRequest) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Format permintaan tidak valid." }, { status: 400 });
  }
  const parsed = PlanRequestSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Tulis ide video minimal 5 karakter." }, { status: 400 });
  const req = parsed.data;

  const result = await generatePlan(req);
  if (!result.ok) return NextResponse.json({ error: result.error }, { status: 502 });
  if (result.plan.status !== "ok") {
    const ask = result.plan.missingInputs.join(" ");
    return NextResponse.json({ error: ask || "Ide belum cukup jelas. Tambahkan siapa penontonnya atau apa yang ingin disampaikan." }, { status: 422 });
  }

  // Catat pemakaian token untuk usage_ledger (sementara di log server).
  if (result.usage) console.info("planner_usage", JSON.stringify({ ...result.usage, attempts: result.attempts, promptVersion: result.promptVersion }));

  return NextResponse.json({
    mode: result.mode,
    plan: result.plan,
    issues: result.issues,
    promptVersion: result.promptVersion,
  });
}
