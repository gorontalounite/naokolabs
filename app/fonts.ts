import localFont from "next/font/local";

// Font disimpan di repo (OFL) agar build tidak bergantung pada unduhan Google Fonts.
export const manrope = localFont({
  src: [{ path: "./fonts/manrope-latin-wght-normal.woff2", weight: "200 800", style: "normal" }],
  variable: "--font-manrope",
  display: "swap",
});

export const playfair = localFont({
  src: [
    { path: "./fonts/playfair-display-latin-wght-normal.woff2", weight: "400 900", style: "normal" },
    { path: "./fonts/playfair-display-latin-wght-italic.woff2", weight: "400 900", style: "italic" },
  ],
  variable: "--font-playfair",
  display: "swap",
});
