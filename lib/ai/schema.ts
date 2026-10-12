import { z } from "zod";

// Bentuk jawaban planner. Dipakai dua kali: dikirim ke Claude sebagai format output
// (structured outputs) dan dipakai server untuk memeriksa jawaban.
// Batas angka (jumlah kata, durasi) sengaja tidak ditaruh di schema; diperiksa di validate.ts
// agar pesan kesalahannya jelas dan bisa dikembalikan ke model untuk diperbaiki.

export const PlanSceneSchema = z.object({
  purpose: z.string().describe("Satu hal yang dipahami penonton setelah adegan ini"),
  seconds: z.number().describe("Perkiraan durasi adegan dalam detik"),
  screenText: z.string().describe("Teks di layar, maksimal 2 baris dipisah \\n, maksimal 8 kata per baris"),
  narration: z.string().describe("Kalimat narasi yang dibacakan persis; kosong bila tanpa voice-over"),
  visual: z.string().describe("Apa yang tampil dan urutan pentingnya"),
  motion: z.object({
    enter: z.string(),
    action: z.string(),
    exit: z.string(),
  }),
  sound: z.string().describe("Cue suara yang menandai aksi utama, atau kosong"),
  assetId: z.string().nullable().describe("ID aset klien yang dipakai, atau null bila placeholder"),
});

export const PlanSchema = z.object({
  status: z.enum(["ok", "needs_input", "unsupported"]),
  title: z.string(),
  concept: z.string().describe("Satu kalimat ide utama"),
  hook: z.string().describe("Kalimat pembuka yang menahan penonton"),
  scenes: z.array(PlanSceneSchema),
  caption: z.string(),
  hashtags: z.array(z.string()),
  missingInputs: z.array(z.string()).describe("Informasi yang kurang dari klien"),
  sourcesUsed: z.array(z.string()).describe("Fakta dari bahan klien yang dipakai, untuk pemeriksaan"),
});

export type Plan = z.infer<typeof PlanSchema>;
export type PlanScene = z.infer<typeof PlanSceneSchema>;

// Permintaan dari Studio ke server.
export const PlanRequestSchema = z.object({
  mode: z.enum(["link", "naskah", "ide"]),
  link: z.string().max(2000).optional().default(""),
  script: z.string().max(8000).optional().default(""),
  idea: z.string().max(500).optional().default(""),
  pastedText: z.string().max(8000).optional().default(""),
  duration: z.union([z.literal(15), z.literal(30), z.literal(60)]),
  tone: z.string().max(40),
  styleId: z.string().max(60),
  vo: z.boolean(),
  voice: z.string().max(60),
  music: z.boolean(),
  subtitles: z.boolean(),
  brand: z
    .object({ name: z.string().max(120), handle: z.string().max(60), tagline: z.string().max(200) })
    .partial()
    .optional(),
  assets: z
    .array(z.object({ id: z.string().max(200), name: z.string().max(200), kind: z.enum(["gambar", "video", "audio", "dokumen"]) }))
    .max(15)
    .optional()
    .default([]),
});

export type PlanRequest = z.infer<typeof PlanRequestSchema>;
