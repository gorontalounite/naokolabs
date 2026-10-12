"use client";

import {
  BookOpen,
  Clapperboard,
  History,
  Lightbulb,
  Palette,
  Settings,
  Sparkles,
  X,
  type LucideIcon,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { currentLabel, isActive, navItems, type NavIcon } from "@/lib/nav";

const icons: Record<NavIcon, LucideIcon> = {
  studio: Clapperboard,
  ide: Lightbulb,
  gaya: Palette,
  riwayat: History,
  panduan: BookOpen,
  paket: Sparkles,
  pengaturan: Settings,
};

export type ShellAccount = { name: string; workspace: string; preview: boolean };

export function AppShell({ children, account }: { children: React.ReactNode; account: ShellAccount }) {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMenuOpen(false);
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  const sidebar = (
    <>
      <Link href="/app" className="side-brand" onClick={() => setMenuOpen(false)}>
        <span className="side-logo" aria-hidden="true">N</span>
        <span>
          <strong>NaokoLabs</strong>
          <small>Studio Video</small>
        </span>
      </Link>

      <nav aria-label="Menu dashboard" className="side-nav">
        <p className="side-label">Menu utama</p>
        <ul>
          {navItems.map((item) => {
            const Icon = icons[item.icon];
            const active = isActive(pathname, item.href) || (item.href === "/app/riwayat" && pathname.startsWith("/app/video/"));
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={active ? "side-link is-active" : "side-link"}
                  aria-current={active ? "page" : undefined}
                  onClick={() => setMenuOpen(false)}
                >
                  <Icon size={20} strokeWidth={1.8} aria-hidden="true" />
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="quota-card">
        <p className="eyebrow">Kuota bulan ini</p>
        <p className="quota-value">Belum berlangganan</p>
        <div className="meter" aria-hidden="true"><span style={{ width: "0%" }} /></div>
        <Link href="/app/paket" className="btn btn-secondary btn-center" onClick={() => setMenuOpen(false)}>
          <Sparkles size={16} aria-hidden="true" /> Lihat paket
        </Link>
      </div>

      <Link href="/app/pengaturan?tab=profil" className="side-account" onClick={() => setMenuOpen(false)}>
        <span className="avatar" aria-hidden="true">{account.name.slice(0, 1).toUpperCase()}</span>
        <span>
          <strong>{account.name}</strong>
          <small>{account.preview ? "Mode pratinjau · data contoh" : account.workspace}</small>
        </span>
      </Link>
    </>
  );

  return (
    <div className="shell">
      <aside className="sidebar">{sidebar}</aside>

      <div className="shell-main">
        <header className="topbar">
          <Link href="/app" className="topbar-brand">
            <span className="side-logo" aria-hidden="true">N</span> NaokoLabs
          </Link>
          <p className="topbar-crumb">{currentLabel(pathname)}</p>
          <button type="button" className="menu-button" aria-expanded={menuOpen} aria-controls="mobile-menu" onClick={() => setMenuOpen(true)}>
            Menu
          </button>
        </header>

        <main className="content">{children}</main>
      </div>

      {menuOpen && (
        <div className="drawer-backdrop" onClick={() => setMenuOpen(false)}>
          <div id="mobile-menu" className="drawer" role="dialog" aria-modal="true" aria-label="Menu" onClick={(event) => event.stopPropagation()}>
            <button type="button" className="drawer-close" onClick={() => setMenuOpen(false)} aria-label="Tutup menu" autoFocus>
              <X size={22} aria-hidden="true" />
            </button>
            {sidebar}
          </div>
        </div>
      )}
    </div>
  );
}
