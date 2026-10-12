// Cache sederhana dalam memori server (per instance). Menghindari membaca link yang sama berulang.
// Pada tahap penyimpanan akun, diganti/ditambah tabel Supabase source_cache (lihat supabase/migrations).
type Entry<T> = { value: T; expires: number };

export function createMemoryCache<T>(maxEntries: number, ttlMs: number) {
  const store = new Map<string, Entry<T>>();
  return {
    get(key: string): T | undefined {
      const hit = store.get(key);
      if (!hit) return undefined;
      if (hit.expires < Date.now()) {
        store.delete(key);
        return undefined;
      }
      // Pindahkan ke belakang agar yang jarang dipakai terbuang dulu (LRU sederhana).
      store.delete(key);
      store.set(key, hit);
      return hit.value;
    },
    set(key: string, value: T) {
      if (store.size >= maxEntries) store.delete(store.keys().next().value as string);
      store.set(key, { value, expires: Date.now() + ttlMs });
    },
  };
}
