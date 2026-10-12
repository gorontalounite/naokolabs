"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { currentLabel, isActive, navItems } from "@/lib/nav";

export function AppShell({ children, footer }: { children: React.ReactNode; footer: string }) {
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

  const nav = (
    <nav aria-label="Menu dashboard">
      <ul className="nav-list">
        {navItems.map((item) => {
          const active = isActive(pathname, item.href);
          return (
            <li key={item.href}>
              <Link
                href={item.href}
                className={active ? "nav-link is-active" : "nav-link"}
                aria-current={active ? "page" : undefined}
                onClick={() => setMenuOpen(false)}
              >
                {item.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );

  return (
    <div className="shell">
      <aside className="sidebar">
        <Link href="/app" className="sidebar-brand">NaokoLabs</Link>
        {nav}
        <p className="sidebar-foot">{footer}</p>
      </aside>

      <div className="shell-main">
        <header className="topbar">
          <Link href="/app" className="topbar-brand">NaokoLabs</Link>
          <p className="topbar-crumb">{currentLabel(pathname)}</p>
          <button
            type="button"
            className="menu-button"
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            onClick={() => setMenuOpen(true)}
          >
            Menu
          </button>
          <Link href="/app/akun" className="account-button" aria-label="Akun">Akun</Link>
        </header>

        <main className="content">{children}</main>
      </div>

      {menuOpen && (
        <div className="drawer-backdrop" onClick={() => setMenuOpen(false)}>
          <div
            id="mobile-menu"
            className="drawer"
            role="dialog"
            aria-modal="true"
            aria-label="Menu"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="drawer-head">
              <span className="topbar-brand">NaokoLabs</span>
              <button type="button" className="menu-button" onClick={() => setMenuOpen(false)} autoFocus>
                Tutup
              </button>
            </div>
            {nav}
            <Link href="/app/akun" className="nav-link" style={{ marginTop: 12 }} onClick={() => setMenuOpen(false)}>Akun</Link>
          </div>
        </div>
      )}
    </div>
  );
}
