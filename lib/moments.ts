// Momen jualan dan hari peringatan dengan tanggal tetap di Indonesia.
// Hari raya bertanggal kalender Hijriah/Imlek tidak dimasukkan karena tanggalnya berubah tiap tahun
// dan harus mengikuti penetapan resmi.

type Moment = { month: number; day: number; name: string; angle: string };

const fixedMoments: Moment[] = [
  { month: 1, day: 1, name: "Tahun Baru", angle: "Resolusi dan promo awal tahun" },
  { month: 2, day: 14, name: "Hari Valentine", angle: "Paket berdua, hadiah untuk orang terdekat" },
  { month: 3, day: 8, name: "Hari Perempuan Internasional", angle: "Cerita perempuan di balik bisnis" },
  { month: 4, day: 21, name: "Hari Kartini", angle: "Apresiasi perempuan di tim dan pelanggan" },
  { month: 5, day: 2, name: "Hari Pendidikan Nasional", angle: "Konten edukasi dan tips" },
  { month: 6, day: 1, name: "Hari Lahir Pancasila", angle: "Nilai kebersamaan dalam brand" },
  { month: 8, day: 17, name: "HUT RI", angle: "Promo kemerdekaan dan produk lokal" },
  { month: 10, day: 16, name: "Hari Pangan Sedunia", angle: "Bahan lokal dan cerita produk" },
  { month: 10, day: 22, name: "Hari Santri", angle: "Ucapan dan nilai kebersamaan" },
  { month: 10, day: 28, name: "Hari Sumpah Pemuda", angle: "Semangat anak muda dan karya lokal" },
  { month: 11, day: 10, name: "Hari Pahlawan", angle: "Pahlawan di sekitar kita" },
  { month: 11, day: 11, name: "Promo 11.11", angle: "Flash sale dan bundling" },
  { month: 12, day: 12, name: "Promo 12.12", angle: "Promo akhir tahun" },
  { month: 12, day: 22, name: "Hari Ibu", angle: "Terima kasih untuk ibu" },
  { month: 12, day: 25, name: "Natal", angle: "Ucapan dan paket hadiah" },
];

export type UpcomingMoment = { name: string; angle: string; date: Date; daysLeft: number };

const DAY = 24 * 60 * 60 * 1000;

export function upcomingMoments(from: Date, limit = 6): UpcomingMoment[] {
  const today = new Date(from.getFullYear(), from.getMonth(), from.getDate());
  const items: UpcomingMoment[] = [];

  for (const year of [today.getFullYear(), today.getFullYear() + 1]) {
    for (const m of fixedMoments) {
      const date = new Date(year, m.month - 1, m.day);
      if (date >= today) items.push({ name: m.name, angle: m.angle, date, daysLeft: Math.round((date.getTime() - today.getTime()) / DAY) });
    }
    // Gajian: tanggal 25 setiap bulan.
    for (let month = 0; month < 12; month++) {
      const date = new Date(year, month, 25);
      if (date >= today) {
        const label = date.toLocaleDateString("id-ID", { month: "short" });
        items.push({ name: `Gajian ${label}`, angle: "Promo tanggal muda", date, daysLeft: Math.round((date.getTime() - today.getTime()) / DAY) });
      }
    }
  }

  return items.sort((a, b) => a.date.getTime() - b.date.getTime()).slice(0, limit);
}

export function formatShortDate(date: Date) {
  return date.toLocaleDateString("id-ID", { day: "numeric", month: "short" });
}
