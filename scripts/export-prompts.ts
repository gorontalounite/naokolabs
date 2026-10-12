// Menyusun system prompt lengkap (bagian bersama sudah disisipkan) ke docs/STYLE-PROMPTS.md
// agar mudah dibaca di GitHub. Jalankan ulang setiap kali prompt diubah: npm run prompts:export
import { writeFileSync } from "node:fs";
import { REFERENCE_DIRECTIONS } from "../lib/ai/prompts/reference-directions";
import { GLOBAL_RULES, PROMPT_VERSION } from "../lib/ai/prompts/global";
import { PLANNER_STAGE } from "../lib/ai/prompts/planner";
import { STYLE_PROMPTS } from "../lib/ai/prompts/styles/index";
import { references } from "../lib/references";
import { videoStyles } from "../lib/video-data";

const fence = (text: string) => "```xml\n" + text + "\n```";
const out: string[] = [];
out.push("# System prompt gaya video");
out.push("");
out.push(`Dibuat otomatis dari kode (versi prompt ${PROMPT_VERSION}). Jangan edit file ini; ubah file di \`lib/ai/prompts/\` lalu jalankan \`npm run prompts:export\`.`);
out.push("");
out.push("Urutan yang dikirim ke Claude: 1) aturan global + tahap rencana, 2) system prompt gaya, 3) arahan video referensi (bila dipilih), 4) ide pelanggan.");
out.push("");
out.push("## Daftar isi");
videoStyles.forEach((s, i) => out.push(`${i + 1}. [${s.name}](#${s.id})`));
out.push("- [Aturan global dan tahap rencana](#aturan-global)");
out.push("");
for (const s of videoStyles) {
  out.push(`<a id="${s.id}"></a>`);
  out.push(`## ${s.name}`);
  out.push("");
  out.push(`File: \`lib/ai/prompts/styles/${s.id}.ts\``);
  out.push("");
  out.push(fence(STYLE_PROMPTS[s.id] ?? "(belum ada)"));
  for (const r of references.filter((x) => x.style === s.id)) {
    out.push("");
    out.push(`### Referensi: ${r.title} (${r.file})`);
    out.push("");
    out.push(`**Prompt:** ${r.prompt}`);
    out.push("");
    out.push(fence(REFERENCE_DIRECTIONS[r.id] ?? "(belum ada)"));
  }
  out.push("");
}
out.push('<a id="aturan-global"></a>');
out.push("## Aturan global dan tahap rencana");
out.push("");
out.push("Dikirim di depan system prompt gaya, sama untuk semua gaya.");
out.push("");
out.push(fence(`${GLOBAL_RULES}\n\n${PLANNER_STAGE}`));
out.push("");
writeFileSync("docs/STYLE-PROMPTS.md", out.join("\n"));
console.log("docs/STYLE-PROMPTS.md ditulis");
