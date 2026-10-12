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

export const BriefSchema = z.object({
  goal: z.string().describe("Tujuan video: apa yang diharapkan terjadi setelah ditonton"),
  audience: z.string().describe("Siapa penontonnya dan apa yang mereka pedulikan"),
  keyMessage: z.string().describe("Satu pesan utama yang harus diingat penonton"),
  angle: z.string().describe("Sudut penyampaian yang membuat ide ini menarik"),
  points: z.array(z.string()).describe("Poin isi berurutan yang dibahas, tanpa poin tambahan yang tidak perlu"),
  cta: z.string().describe("Ajakan di akhir video"),
});

export const PlanSchema = z.object({
  status: z.enum(["ok", "needs_input", "unsupported"]),
  title: z.string(),
  style: z.enum(["motion-graphic", "explainer"]).describe("Gaya yang Anda pilih sesuai isi ide (D-23)"),
  brief: BriefSchema,
  duration: z.number().describe("Total durasi video dalam detik, ditentukan dari banyaknya isi ide"),
  durationReason: z.string().describe("Satu kalimat alasan durasi untuk ditampilkan ke pelanggan"),
  concept: z.string().describe("Satu kalimat ide utama"),
  hook: z.string().describe("Kalimat pembuka yang menahan penonton"),
  scenes: z.array(PlanSceneSchema),
  caption: z.string(),
  hashtags: z.array(z.string()),
  missingInputs: z.array(z.string()).describe("Informasi yang kurang dari klien"),
  sourcesUsed: z.array(z.string()).describe("Fakta dari ide atau brand kit pelanggan yang dipakai, untuk pemeriksaan"),
});

export type Plan = z.infer<typeof PlanSchema>;
export type PlanScene = z.infer<typeof PlanSceneSchema>;
export type Brief = z.infer<typeof BriefSchema>;

// Permintaan dari Studio ke server. Hanya ide singkat; durasi ditentukan planner (D-18).
export const VoiceoverSegmentSchema = z.object({ text: z.string().max(1000), start: z.number().min(0), end: z.number().min(0) });

// Voice-over jadi dari pelanggan: hasil transkripsi + waktu per kalimat (D-21).
export const VoiceoverSchema = z.object({
  fileName: z.string().max(200),
  transcript: z.string().trim().min(1).max(5000),
  seconds: z.number().min(3).max(65),
  segments: z.array(VoiceoverSegmentSchema).min(1).max(300),
});

export const PlanRequestSchema = z.object({
  idea: z.string().trim().max(1000).optional().default(""),
  tone: z.string().max(40),
  styleId: z.string().max(60).optional().default("auto"),
  exampleId: z.string().max(60).optional(),
  vo: z.boolean(),
  voice: z.string().max(60),
  music: z.boolean(),
  musicSource: z.enum(["none", "upload", "library"]).optional().default("none"),
  brand: z
    .object({ name: z.string().max(120), handle: z.string().max(60), tagline: z.string().max(200) })
    .partial()
    .optional(),
  assets: z
    .array(z.object({ id: z.string().max(200), name: z.string().max(200), kind: z.enum(["gambar", "video", "audio", "dokumen"]) }))
    .max(15)
    .optional()
    .default([]),
  voiceover: VoiceoverSchema.optional(),
}).refine((r) => r.idea.length >= 5 || !!r.voiceover, { message: "Tulis ide minimal 5 karakter atau unggah voice-over.", path: ["idea"] });

export type PlanRequest = z.infer<typeof PlanRequestSchema>;
export type Voiceover = z.infer<typeof VoiceoverSchema>;
export type VoiceoverSegment = z.infer<typeof VoiceoverSegmentSchema>;
