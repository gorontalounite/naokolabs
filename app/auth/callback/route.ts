import { NextResponse, type NextRequest } from "next/server";
import { safeNext } from "@/lib/safe-next";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { createClient } from "@/lib/supabase/server";

// Tujuan tautan email (magic link, konfirmasi, reset password) dan Google OAuth.
export async function GET(request: NextRequest) {
  const { searchParams, origin } = request.nextUrl;
  const code = searchParams.get("code");
  const next = safeNext(searchParams.get("next"));

  if (isSupabaseConfigured && code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) return NextResponse.redirect(`${origin}${next}`);
  }
  return NextResponse.redirect(`${origin}/masuk?error=link`);
}
