// Menu dashboard video (docs/DECISIONS.md D-15).
export const navItems = [
  { href: "/app", label: "Studio Video", icon: "studio" },
  { href: "/app/ide", label: "Ide Konten", icon: "ide" },
  { href: "/app/gaya", label: "Katalog Gaya", icon: "gaya" },
  { href: "/app/riwayat", label: "Riwayat Video", icon: "riwayat" },
  { href: "/app/jadwal", label: "Jadwal & Auto-Post", icon: "jadwal" },
  { href: "/app/panduan", label: "Panduan", icon: "panduan" },
  { href: "/app/paket", label: "Paket & Kuota", icon: "paket" },
  { href: "/app/pengaturan", label: "Pengaturan & Brand Kit", icon: "pengaturan" },
] as const;

export type NavIcon = (typeof navItems)[number]["icon"];

export function isActive(pathname: string, href: string) {
  if (href === "/app") return pathname === "/app";
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function currentLabel(pathname: string) {
  if (pathname.startsWith("/app/video/")) return "Riwayat Video";
  const match = [...navItems].reverse().find((item) => isActive(pathname, item.href));
  return match?.label ?? "Studio Video";
}
