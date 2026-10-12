import "server-only";
import { createClient } from "@supabase/supabase-js";
import { supabaseUrl } from "./config";

// Client service role: hanya untuk server (route API). Kunci tidak pernah dikirim ke browser.
export function footageStorageEnabled() {
  return Boolean(supabaseUrl && process.env.SUPABASE_SERVICE_ROLE_KEY);
}

export function createAdminClient() {
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!supabaseUrl || !key) throw new Error("Penyimpanan footage belum dikonfigurasi");
  return createClient(supabaseUrl, key, { auth: { persistSession: false, autoRefreshToken: false } });
}
