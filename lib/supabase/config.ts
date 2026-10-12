// Supabase project NaokoLabs (organisasi terpisah dari Gorontalo Unite).
// Tanpa variabel ini, dashboard berjalan dalam mode pratinjau dengan data contoh.
export const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
export const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);


// Sakelar sementara: AUTH_REQUIRED=false membuka /app tanpa login (mode pratinjau, data contoh).
// Hapus variabel ini di Vercel saat login diaktifkan untuk klien.
export const authRequired = isSupabaseConfigured && process.env.AUTH_REQUIRED !== "false";
