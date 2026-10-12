import { NextResponse } from "next/server";
import { plannerMode } from "@/lib/ai/planner";
import { githubEnabled } from "@/lib/produksi-server";
import { supabaseAnonKey, supabaseUrl } from "@/lib/supabase/config";
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
    // Rincian ya/tidak per variabel (nilai tidak pernah dikirim), untuk mencari variabel yang belum terbaca.
    env: {
      NEXT_PUBLIC_SUPABASE_URL: Boolean(supabaseUrl),
      NEXT_PUBLIC_SUPABASE_ANON_KEY: Boolean(supabaseAnonKey),
      SUPABASE_SERVICE_ROLE_KEY: Boolean(process.env.SUPABASE_SERVICE_ROLE_KEY),
      GITHUB_DISPATCH_TOKEN: githubEnabled(),
    },
  });
}
