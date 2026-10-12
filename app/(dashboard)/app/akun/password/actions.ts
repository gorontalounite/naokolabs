"use server";

import { redirect } from "next/navigation";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { createClient } from "@/lib/supabase/server";

export type PasswordState = { error?: string };

export async function updatePassword(_: PasswordState, formData: FormData): Promise<PasswordState> {
  if (!isSupabaseConfigured) return { error: "Login belum aktif." };
  const password = String(formData.get("password") ?? "");
  const confirm = String(formData.get("confirm") ?? "");
  if (password.length < 8) return { error: "Password minimal 8 karakter." };
  if (password !== confirm) return { error: "Konfirmasi password tidak sama." };

  const supabase = await createClient();
  const { error } = await supabase.auth.updateUser({ password });
  if (error) return { error: "Password gagal diubah. Minta tautan atur ulang baru." };
  redirect("/app/akun");
}
