import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./dashboard.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: { default: "Dashboard Content — NAOKOLABS", template: "%s · Dashboard Content" },
  description: "Pesan, setujui, dan jadwalkan konten dari satu dashboard.",
  icons: { icon: "/favicon.png", shortcut: "/favicon.png" },
  robots: { index: false, follow: false },
};

export default function DashboardRootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="id" className={inter.variable}>
      <body>{children}</body>
    </html>
  );
}
