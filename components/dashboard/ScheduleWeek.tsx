"use client";

import { ChevronLeft, ChevronRight, Link2, Plus } from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";
import { sampleVideos } from "@/lib/video-data";

const platforms = ["Semua", "Instagram", "TikTok", "Facebook"] as const;
const DAY = 24 * 60 * 60 * 1000;

function startOfWeek(date: Date) {
  const d = new Date(date);
  const diff = (d.getDay() + 6) % 7; // Senin sebagai awal minggu
  d.setDate(d.getDate() - diff);
  return d;
}

function sameDay(a: Date, b: Date) {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}

export function ScheduleWeek({ todayIso, pendingTitle }: { todayIso: string; pendingTitle?: string }) {
  const today = useMemo(() => {
    const [y, m, d] = todayIso.split("-").map(Number);
    return new Date(y, m - 1, d);
  }, [todayIso]);
  const [offset, setOffset] = useState(0);
  const [platform, setPlatform] = useState<(typeof platforms)[number]>("Semua");
  const [note, setNote] = useState("");

  const start = new Date(startOfWeek(today).getTime() + offset * 7 * DAY);
  const days = Array.from({ length: 7 }, (_, i) => new Date(start.getFullYear(), start.getMonth(), start.getDate() + i));
  const posts = sampleVideos.filter((v) => v.schedule && (platform === "Semua" || v.schedule.platform === platform));
  const monthLabel = start.toLocaleDateString("id-ID", { month: "long", year: "numeric" });

  return (
    <div className="stack">
      {pendingTitle && <p className="notice" role="status">Pilih hari untuk menjadwalkan <strong>{pendingTitle}</strong>.</p>}

      <div className="panel" style={{ padding: 16 }}>
        <div className="row" style={{ justifyContent: "space-between" }}>
          <div className="row">
            <button type="button" className="btn" onClick={() => setOffset(0)}>Hari ini</button>
            <button type="button" className="btn" aria-label="Minggu sebelumnya" onClick={() => setOffset(offset - 1)}><ChevronLeft size={18} aria-hidden="true" /></button>
            <button type="button" className="btn" aria-label="Minggu berikutnya" onClick={() => setOffset(offset + 1)}><ChevronRight size={18} aria-hidden="true" /></button>
            <h2 className="section-title" style={{ textTransform: "capitalize" }}>{monthLabel}</h2>
          </div>
          <Link href="/app" className="btn btn-primary"><Plus size={18} aria-hidden="true" /> Buat video</Link>
        </div>
      </div>

      <div className="panel row" style={{ padding: 16, justifyContent: "space-between" }}>
        <p><strong>Akun medsos (0):</strong> <span className="hint">Belum ada akun terhubung.</span></p>
        <Link href="/app/pengaturan?tab=medsos" className="btn"><Link2 size={18} aria-hidden="true" /> Hubungkan akun</Link>
      </div>

      <div className="chips" role="group" aria-label="Platform">
        {platforms.map((p) => (
          <button key={p} type="button" className="chip" aria-pressed={platform === p} onClick={() => setPlatform(p)}>{p}</button>
        ))}
      </div>

      <div className="week">
        {days.map((day) => {
          const dayPosts = posts.filter((v) => sameDay(new Date(v.schedule!.at), day));
          return (
            <section key={day.toISOString()} className="day" data-today={sameDay(day, today)} aria-label={day.toLocaleDateString("id-ID", { dateStyle: "full" })}>
              <div className="day-head">
                <span>{day.toLocaleDateString("id-ID", { weekday: "long" })}</span>
                <span className="hint">{day.toLocaleDateString("id-ID", { day: "numeric", month: "short" })}</span>
              </div>
              {dayPosts.map((v) => (
                <Link key={v.id} href={`/app/video/${v.id}`} className="post-chip">
                  <strong>{v.title}</strong>
                  <span className="hint">{new Date(v.schedule!.at).toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" })} WITA · {v.schedule!.platform}</span>
                </Link>
              ))}
              <button type="button" className="day-add" onClick={() => setNote("Penjadwalan aktif setelah akun Instagram, TikTok atau Facebook terhubung.")}>+ Tambah posting</button>
            </section>
          );
        })}
      </div>
      {note && <p className="notice" role="status">{note}</p>}
      <p className="hint">Waktu ditampilkan dalam WITA. Jadwal dijalankan server, jadi dashboard tidak perlu tetap terbuka.</p>
    </div>
  );
}
