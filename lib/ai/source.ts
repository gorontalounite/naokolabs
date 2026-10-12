import { lookup } from "node:dns/promises";
import { isIP } from "node:net";
import { createMemoryCache } from "@/lib/cache";

// Membaca isi halaman dari link pelanggan di server.
// Isi halaman diperlakukan sebagai DATA untuk planner, tidak pernah sebagai instruksi.

export type SourceContent = { url: string; title: string; description: string; price: string; text: string };
export type SourceResult = { ok: true; content: SourceContent; cached: boolean } | { ok: false; reason: SourceFailure };
export type SourceFailure = "invalid_url" | "blocked_host" | "fetch_failed" | "not_html" | "too_large" | "empty" | "timeout";

const MAX_BYTES = 2 * 1024 * 1024;
const MAX_TEXT = 6000;
const TIMEOUT_MS = 8000;
const cache = createMemoryCache<SourceContent>(200, 6 * 60 * 60 * 1000);

export const sourceFailureMessage: Record<SourceFailure, string> = {
  invalid_url: "Link tidak valid. Gunakan link lengkap yang diawali https://",
  blocked_host: "Link ini tidak boleh dibaca oleh sistem.",
  fetch_failed: "Halaman tidak bisa dibuka (mungkin diblokir atau butuh login). Tempel isi teksnya di kolom yang tersedia.",
  not_html: "Link bukan halaman web. Tempel isi teksnya di kolom yang tersedia.",
  too_large: "Halaman terlalu besar untuk dibaca. Tempel bagian pentingnya saja.",
  empty: "Halaman tidak berisi teks yang bisa dibaca. Tempel isi teksnya di kolom yang tersedia.",
  timeout: "Halaman terlalu lama merespons. Coba lagi atau tempel isi teksnya.",
};

function normalizeUrl(raw: string): URL | null {
  try {
    const url = new URL(raw.trim());
    if (url.protocol !== "https:" && url.protocol !== "http:") return null;
    url.hash = "";
    return url;
  } catch {
    return null;
  }
}

function isPrivateAddress(ip: string) {
  if (isIP(ip) === 6) {
    const v = ip.toLowerCase();
    return v === "::1" || v.startsWith("fc") || v.startsWith("fd") || v.startsWith("fe80") || v === "::" || v.startsWith("::ffff:127.") || v.startsWith("::ffff:10.") || v.startsWith("::ffff:192.168.");
  }
  const [a, b] = ip.split(".").map(Number);
  return a === 10 || a === 127 || a === 0 || (a === 169 && b === 254) || (a === 172 && b >= 16 && b <= 31) || (a === 192 && b === 168) || (a === 100 && b >= 64 && b <= 127);
}

// Cegah SSRF: tolak host internal, termasuk nama domain yang mengarah ke IP privat.
async function hostAllowed(url: URL) {
  const host = url.hostname.replace(/^\[|\]$/g, "");
  if (host === "localhost" || host.endsWith(".local") || host.endsWith(".internal")) return false;
  if (isIP(host)) return !isPrivateAddress(host);
  try {
    const records = await lookup(host, { all: true });
    return records.length > 0 && records.every((r) => !isPrivateAddress(r.address));
  } catch {
    return false;
  }
}

const decode = (s: string) =>
  s.replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&quot;/g, '"').replace(/&#39;|&apos;/g, "'").replace(/&nbsp;/g, " ").replace(/&#(\d+);/g, (_, n) => String.fromCodePoint(Number(n)));

function meta(html: string, key: string) {
  const re = new RegExp(`<meta[^>]+(?:property|name)=["']${key}["'][^>]*content=["']([^"']*)["']|<meta[^>]+content=["']([^"']*)["'][^>]*(?:property|name)=["']${key}["']`, "i");
  const m = html.match(re);
  return decode((m?.[1] ?? m?.[2] ?? "").trim());
}

export function extractContent(url: string, html: string): SourceContent {
  const title = meta(html, "og:title") || decode(html.match(/<title[^>]*>([^<]*)<\/title>/i)?.[1]?.trim() ?? "");
  const description = meta(html, "og:description") || meta(html, "description");
  let price = meta(html, "product:price:amount") || meta(html, "og:price:amount");
  if (price) price = `${meta(html, "product:price:currency") || meta(html, "og:price:currency")} ${price}`.trim();
  if (!price) {
    const ld = html.match(/"price"\s*:\s*"?([\d.,]+)"?/);
    if (ld) price = ld[1];
  }
  const text = decode(
    html
      .replace(/<script[\s\S]*?<\/script>/gi, " ")
      .replace(/<style[\s\S]*?<\/style>/gi, " ")
      .replace(/<noscript[\s\S]*?<\/noscript>/gi, " ")
      .replace(/<(nav|footer|header|svg)[\s\S]*?<\/\1>/gi, " ")
      .replace(/<br\s*\/?>|<\/(p|div|li|h\d|tr)>/gi, "\n")
      .replace(/<[^>]+>/g, " "),
  )
    .replace(/[ \t\f\v]+/g, " ")
    .replace(/\n\s*\n+/g, "\n")
    .trim()
    .slice(0, MAX_TEXT);
  return { url, title, description, price, text };
}

export async function readSource(raw: string): Promise<SourceResult> {
  const url = normalizeUrl(raw);
  if (!url) return { ok: false, reason: "invalid_url" };
  const key = url.toString();
  const hit = cache.get(key);
  if (hit) return { ok: true, content: hit, cached: true };
  if (!(await hostAllowed(url))) return { ok: false, reason: "blocked_host" };

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
  try {
    // redirect manual: setiap lompatan diperiksa ulang agar tidak diarahkan ke host internal.
    let current = url;
    let res: Response | null = null;
    for (let hop = 0; hop < 4; hop++) {
      res = await fetch(current, { redirect: "manual", signal: controller.signal, headers: { "user-agent": "NaokoLabsBot/1.0 (+https://naokolabs.vercel.app)", accept: "text/html" } });
      const loc = res.headers.get("location");
      if (res.status >= 300 && res.status < 400 && loc) {
        const next = normalizeUrl(new URL(loc, current).toString());
        if (!next || !(await hostAllowed(next))) return { ok: false, reason: "blocked_host" };
        current = next;
        continue;
      }
      break;
    }
    if (!res || !res.ok) return { ok: false, reason: "fetch_failed" };
    if (!(res.headers.get("content-type") ?? "").includes("text/html")) return { ok: false, reason: "not_html" };
    const length = Number(res.headers.get("content-length") ?? 0);
    if (length > MAX_BYTES) return { ok: false, reason: "too_large" };
    const buf = await res.arrayBuffer();
    if (buf.byteLength > MAX_BYTES) return { ok: false, reason: "too_large" };
    const content = extractContent(current.toString(), new TextDecoder("utf-8").decode(buf));
    if (content.text.length < 80 && !content.description) return { ok: false, reason: "empty" };
    cache.set(key, content);
    return { ok: true, content, cached: false };
  } catch (error) {
    return { ok: false, reason: (error as Error).name === "AbortError" ? "timeout" : "fetch_failed" };
  } finally {
    clearTimeout(timer);
  }
}
