import type { Plan } from "@/lib/ai/schema";
import type { LocalVideoMeta } from "@/lib/video-store";

type Meta = { tone: string; exampleTitle?: string; brand: string; assetNames: Record<string, string>; plannerMode: "contoh" | "ai"; warnings: string[]; idea: string; footage?: LocalVideoMeta["footage"]; audio?: LocalVideoMeta["audio"]; voiceover?: { fileName: string; seconds: number } };

// Ubah jawaban planner menjadi video lokal yang dipakai halaman detail video.
export function planToVideo(plan: Plan, meta: Meta): LocalVideoMeta {
  const id = `v-${Date.now().toString(36)}`;
  return {
    local: true,
    id,
    title: plan.title,
    brand: meta.brand || "Brand Anda",
    styleId: plan.style,
    duration: plan.scenes.reduce((n, s) => n + s.seconds, 0),
    tone: meta.tone,
    status: "rencana",
    planVersion: 1,
    createdAt: new Date().toISOString().slice(0, 10),
    caption: [plan.caption, plan.hashtags.map((h) => `#${h.replace(/^#/, "")}`).join(" ")].filter(Boolean).join("\n\n"),
    scenes: plan.scenes.map((s, i) => ({
      id: `s${i + 1}`,
      seconds: s.seconds,
      screenText: s.screenText,
      narration: s.narration,
      visual: s.visual,
      purpose: s.purpose,
      motion: [s.motion.enter, s.motion.action, s.motion.exit].filter(Boolean).join(" → "),
      sound: s.sound,
      icon: s.icon,
      assetId: s.assetId && meta.assetNames[s.assetId] ? s.assetId : undefined,
      asset: s.assetId && meta.assetNames[s.assetId] ? { label: meta.assetNames[s.assetId], placeholder: false } : { label: "Visual sementara", placeholder: true },
    })),
    plannerMode: meta.plannerMode,
    concept: plan.concept,
    hook: plan.hook,
    hashtags: plan.hashtags,
    missingInputs: plan.missingInputs,
    warnings: meta.warnings,
    idea: meta.idea,
    audio: meta.audio,
    footage: meta.footage,
    voiceover: meta.voiceover,
    exampleTitle: meta.exampleTitle,
    brief: plan.brief,
    durationReason: plan.durationReason,
  };
}
