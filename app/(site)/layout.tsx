import type { Metadata } from "next";
import { manrope, playfair } from "@/app/fonts";
import { headers } from "next/headers";
import "./site.css";

export async function generateMetadata(): Promise<Metadata> {
  const requestHeaders = await headers();
  const host = requestHeaders.get("host") ?? "localhost:3000";
  const protocol = requestHeaders.get("x-forwarded-proto") ?? "https";
  const metadataBase = new URL(`${protocol}://${host}`);
  const title = "NAOKOLABS — Brand yang jelas. Konten yang hidup.";
  const description = "Independent creative lab untuk identitas brand, social media, dan konten yang lebih matang.";

  return {
    metadataBase,
    title,
    description,
    icons: { icon: "/favicon.png", shortcut: "/favicon.png" },
    openGraph: { title, description, type: "website", images: [{ url: "/og.png", width: 1200, height: 630, alt: "NAOKOLABS — Brand yang jelas. Konten yang hidup." }] },
    twitter: { card: "summary_large_image", title, description, images: ["/og.png"] },
  };
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="id" className={`${manrope.variable} ${playfair.variable}`}><body>{children}</body></html>;
}
