import { NextResponse, type NextRequest } from "next/server";
import { MAX_AUDIO_BYTES, transcribe } from "@/lib/voice/transcribe";

// Voice-over pelanggan → transkrip + waktu per kalimat. File tidak disimpan.
export const maxDuration = 60;

export async function POST(request: NextRequest) {
  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return NextResponse.json({ error: "File terlalu besar atau rusak. Maksimal 4 MB." }, { status: 400 });
  }
  const file = form.get("file");
  if (!(file instanceof File)) return NextResponse.json({ error: "Pilih file audio." }, { status: 400 });
  if (!file.type.startsWith("audio/") && !/\.(mp3|m4a|wav|aac|ogg)$/i.test(file.name)) return NextResponse.json({ error: "Gunakan file audio MP3, M4A atau WAV." }, { status: 400 });
  if (file.size > MAX_AUDIO_BYTES) return NextResponse.json({ error: "File maksimal 4 MB. Simpan ulang sebagai MP3." }, { status: 413 });

  const result = await transcribe(file);
  if (!result.ok) return NextResponse.json({ error: result.error }, { status: result.status });
  return NextResponse.json({ voiceover: { fileName: result.fileName, transcript: result.transcript, seconds: result.seconds, segments: result.segments }, language: result.language });
}
