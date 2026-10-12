import type { Metadata } from "next";
import { Manrope } from "next/font/google";
import "./dashboard.css";

const manrope = Manrope({ subsets: ["latin"], weight: ["400", "500", "600", "700", "800"], variable: "--font-manrope" });

export const metadata: Metadata = {
  title: { default: "Studio Video — NAOKOLABS", template: "%s · NaokoLabs" },
  description: "Buat, setujui, dan jadwalkan video brand dari satu dashboard.",
  icons: { icon: "/favicon.png", shortcut: "/favicon.png" },
  robots: { index: false, follow: false },
};

export default function DashboardRootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="id" className={manrope.variable}>
      <body>{children}</body>
    </html>
  );
}
