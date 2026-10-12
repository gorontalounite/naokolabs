"use server";

import { redirect } from "next/navigation";
import { safeNext } from "@/lib/safe-next";
import { isSupabaseConfigured, siteUrl } from "@/lib/supabase/config";
import { createClient } from "@/lib/supabase/server";

export type AuthState = { error?: string; message?: string };

const MIN_PASSWORD = 8;

function readEmail(formData: FormData) {
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ? email : null;
}

function callbackUrl(next: string) {
  return `${siteUrl()}/auth/callback?next=${encodeURIComponent(next)}`;
}

function notConfigured(): AuthState {
  return { error: "Login belum aktif. Supabase NaokoLabs belum disambungkan." };
}

export async function signInWithPassword(_: AuthState, formData: FormData): Promise<AuthState> {
  if (!isSupabaseConfigured) return notConfigured();
  const email = readEmail(formData);
  const password = String(formData.get("password") ?? "");
  if (!email) return { error: "Masukkan email yang valid." };
  if (!password) return { error: "Masukkan password." };

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) return { error: "Email atau password salah, atau email belum dikonfirmasi." };
  redirect(safeNext(formData.get("next")));
}

export async function signUpWithPassword(_: AuthState, formData: FormData): Promise<AuthState> {
  if (!isSupabaseConfigured) return notConfigured();
  const email = readEmail(formData);
  const password = String(formData.get("password") ?? "");
  const fullName = String(formData.get("full_name") ?? "").trim();
  if (!fullName) return { error: "Masukkan nama." };
  if (!email) return { error: "Masukkan email yang valid." };
  if (password.length < MIN_PASSWORD) return { error: `Password minimal ${MIN_PASSWORD} karakter.` };

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: { data: { full_name: fullName }, emailRedirectTo: callbackUrl(safeNext(formData.get("next"))) },
  });
  if (error) return { error: "Pendaftaran gagal. Coba lagi atau gunakan metode lain." };
  if (data.session) redirect(safeNext(formData.get("next")));
  return { message: "Cek email Anda untuk mengonfirmasi akun." };
}

export async function sendMagicLink(_: AuthState, formData: FormData): Promise<AuthState> {
  if (!isSupabaseConfigured) return notConfigured();
  const email = readEmail(formData);
  if (!email) return { error: "Masukkan email yang valid." };

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: { emailRedirectTo: callbackUrl(safeNext(formData.get("next"))) },
  });
  if (error) return { error: "Tautan belum terkirim. Tunggu sebentar lalu coba lagi." };
  return { message: "Tautan masuk sudah dikirim. Buka email Anda di perangkat ini." };
}

export async function sendPasswordReset(_: AuthState, formData: FormData): Promise<AuthState> {
  if (!isSupabaseConfigured) return notConfigured();
  const email = readEmail(formData);
  if (!email) return { error: "Masukkan email yang valid." };

  const supabase = await createClient();
  await supabase.auth.resetPasswordForEmail(email, { redirectTo: callbackUrl("/app/akun/password") });
  // Pesan sama untuk email terdaftar maupun tidak, agar tidak membocorkan akun.
  return { message: "Jika email terdaftar, tautan atur ulang password sudah dikirim." };
}

export async function signInWithGoogle(formData: FormData) {
  if (!isSupabaseConfigured) redirect("/masuk?error=config");
  const supabase = await createClient();
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: { redirectTo: callbackUrl(safeNext(formData.get("next"))) },
  });
  if (error || !data.url) redirect("/masuk?error=google");
  redirect(data.url);
}
