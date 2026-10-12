import { NextResponse } from "next/server";
import { plannerMode } from "@/lib/ai/planner";
import { githubEnabled } from "@/lib/produksi-server";
import { footageStorageEnabled } from "@/lib/supabase/admin";
import { transcriptionEnabled } from "@/lib/voice/transcribe";

// Status layanan untuk dashboard dan pemeriksaan deploy. Tidak pernah mengirim nilai kunci.
export const dynamic = "force-dynamic";

export function GET() {
  return NextResponse.json({
    planner: plannerMode(),
    transcription: transcriptionEnabled(),
    footage: footageStorageEnabled(),
    production: footageStorageEnabled() && githubEnabled(),
  });
}
