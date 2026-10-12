// Panduan nada bicara; disisipkan di pesan pengguna, bukan system prompt, agar cache gaya tetap sama.
export const TONE_GUIDE: Record<string, string> = {
  edukasi: "Gaya bahasa: edukasi dan wawasan — runtut, jelas, ramah, tanpa menggurui.",
  promosi: "Gaya bahasa: promosi dan jualan — sorot keunggulan dan manfaat, ajakan beli yang jelas, tidak berlebihan.",
  hook: "Gaya bahasa: hook viral — pembuka memancing rasa ingin tahu, kalimat pendek, tetap jujur pada fakta.",
  santai: "Gaya bahasa: santai dan akrab — bahasa sehari-hari yang sopan, seperti ngobrol dengan teman.",
  formal: "Gaya bahasa: formal dan resmi — baku, sopan, cocok untuk instansi dan layanan publik.",
};
