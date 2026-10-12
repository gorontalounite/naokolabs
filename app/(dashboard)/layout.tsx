import type { Metadata } from "next";
import { manrope } from "@/app/fonts";
import "./dashboard.css";

export const metadata: Metadata = {
  title: { default: "Studio Video — NAOKOLABS", template: "%s · NaokoLabs" },
  description: "Ubah ide singkat menjadi video brand siap posting.",
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
