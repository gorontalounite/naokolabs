import "server-only";
import { createAdminClient } from "@/lib/supabase/admin";

// Antrean produksi di Supabase Storage (bucket privat "produksi"):
//   jobs/<id>.json   spesifikasi video + pemilik
//   status/<id>.json status terkini yang diperbarui worker
//   hasil/<id>.mp4   hasil render
export const JOB_BUCKET = "produksi";
export const REPO = process.env.GITHUB_REPO || "gorontalounite/naokolabs";

export type JobState = "antre" | "menyiapkan" | "render" | "mengunggah" | "selesai" | "gagal";
export type JobStatus = { state: JobState; message?: string; progress?: number; owner: string; updatedAt: string; result?: string };

export const isTerminal = (s: JobState) => s === "selesai" || s === "gagal";

export async function writeJson(path: string, value: unknown) {
  const body = new Blob([JSON.stringify(value)], { type: "application/json" });
  const { error } = await createAdminClient().storage.from(JOB_BUCKET).upload(path, body, { upsert: true, contentType: "application/json" });
  if (error) throw new Error(`Gagal menulis ${path}: ${error.message}`);
}

export async function readJson<T>(path: string): Promise<T | null> {
  const { data, error } = await createAdminClient().storage.from(JOB_BUCKET).download(path);
  if (error || !data) return null;
  try {
    return JSON.parse(await data.text()) as T;
  } catch {
    return null;
  }
}

export const setStatus = (id: string, status: Omit<JobStatus, "updatedAt">) => writeJson(`status/${id}.json`, { ...status, updatedAt: new Date().toISOString() });

export const githubEnabled = () => Boolean(process.env.GITHUB_DISPATCH_TOKEN);

async function gh(path: string, init?: RequestInit) {
  return fetch(`https://api.github.com/repos/${REPO}${path}`, {
    ...init,
    headers: { accept: "application/vnd.github+json", authorization: `Bearer ${process.env.GITHUB_DISPATCH_TOKEN}`, "x-github-api-version": "2022-11-28", "content-type": "application/json", ...(init?.headers ?? {}) },
  });
}

// Picu workflow render. workflow_dispatch hanya bisa dipicu bila render.yml ada di branch utama (workflowRef).
export async function dispatchRender(jobId: string) {
  const workflowRef = process.env.GITHUB_WORKFLOW_REF || "main";
  const codeRef = process.env.RENDER_CODE_REF || "claude";
  const res = await gh("/actions/workflows/render.yml/dispatches", { method: "POST", body: JSON.stringify({ ref: workflowRef, inputs: { job_id: jobId, code_ref: codeRef } }) });
  if (res.status !== 204) throw new Error(`GitHub menolak pemicu (${res.status}): ${(await res.text()).slice(0, 200)}`);
}

// Bila worker mati sebelum sempat melapor, tanya GitHub apakah run-nya sudah gagal.
export async function runConclusion(jobId: string): Promise<"gagal" | "berjalan" | "tidak-ada"> {
  const res = await gh("/actions/workflows/render.yml/runs?event=workflow_dispatch&per_page=30");
  if (!res.ok) return "tidak-ada";
  const { workflow_runs } = (await res.json()) as { workflow_runs: { display_title: string; status: string; conclusion: string | null }[] };
  const run = workflow_runs.find((r) => r.display_title.includes(jobId));
  if (!run) return "tidak-ada";
  if (run.status === "completed" && run.conclusion !== "success") return "gagal";
  return "berjalan";
}
