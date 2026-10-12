"use client";

import { createClient } from "@supabase/supabase-js";
import { supabaseAnonKey, supabaseUrl } from "@/lib/supabase/config";

export type StoredFootage = { path: string; kind: "gambar" | "video"; name: string };
export type UploadResult = { ok: true; byKey: Record<string, StoredFootage> } | { ok: false; disabled?: boolean; error: string };

type Item = { key: string; file: File };

// Unggah footage ke Supabase Storage lewat URL bertanda tangan dari server.
export async function uploadFootage(items: Item[], onProgress?: (done: number, total: number) => void): Promise<UploadResult> {
  if (items.length === 0) return { ok: true, byKey: {} };
  const res = await fetch("/api/aset/masuk", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ files: items.map(({ file }) => ({ name: file.name, size: file.size, type: file.type })) }),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) return { ok: false, disabled: !!data.disabled, error: data.error ?? "Unggahan footage gagal." };

  const storage = createClient(supabaseUrl, supabaseAnonKey, { auth: { persistSession: false } }).storage.from("footage");
  const byKey: Record<string, StoredFootage> = {};
  for (let i = 0; i < items.length; i++) {
    const meta = data.files[i] as { name: string; path: string; token: string; kind: "gambar" | "video" };
    const { error } = await storage.uploadToSignedUrl(meta.path, meta.token, items[i].file, { contentType: items[i].file.type });
    if (error) return { ok: false, error: `Mengunggah ${meta.name} gagal. Periksa koneksi lalu coba lagi.` };
    byKey[items[i].key] = { path: meta.path, kind: meta.kind, name: meta.name };
    onProgress?.(i + 1, items.length);
  }
  return { ok: true, byKey };
}

export async function footageUrls(paths: string[]): Promise<Record<string, string>> {
  if (paths.length === 0) return {};
  try {
    const res = await fetch("/api/aset/baca", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ paths }) });
    const data = await res.json();
    return res.ok ? (data.urls ?? {}) : {};
  } catch {
    return {};
  }
}
