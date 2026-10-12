// Menu klien sesuai docs/UI-UX.md (navigasi klien).
export const navItems = [
  { href: "/app", label: "Beranda" },
  { href: "/app/pesanan", label: "Pesanan" },
  { href: "/app/buat", label: "Buat Konten" },
  { href: "/app/brand", label: "Brand & Aset" },
  { href: "/app/hasil", label: "Hasil Konten" },
  { href: "/app/kalender", label: "Posting & Kalender" },
  { href: "/app/akun-sosial", label: "Akun Sosial" },
  { href: "/app/pembayaran", label: "Pembayaran" },
  { href: "/app/bantuan", label: "Bantuan & Revisi" },
] as const;

export function isActive(pathname: string, href: string) {
  if (href === "/app") return pathname === "/app";
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function currentLabel(pathname: string) {
  const match = [...navItems].reverse().find((item) => isActive(pathname, item.href));
  if (match) return match.label;
  if (pathname.startsWith("/app/rencana")) return "Pesanan";
  if (pathname.startsWith("/app/posting")) return "Posting & Kalender";
  if (pathname.startsWith("/app/akun")) return "Akun";
  return "Beranda";
}
