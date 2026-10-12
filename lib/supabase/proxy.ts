import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { authRequired, isSupabaseConfigured, supabaseAnonKey, supabaseUrl } from "./config";

// Memperbarui sesi di setiap request dan melindungi /app.
export async function updateSession(request: NextRequest) {
  if (!isSupabaseConfigured) return NextResponse.next({ request });

  let response = NextResponse.next({ request });
  const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll: () => request.cookies.getAll(),
      setAll(cookiesToSet, headers) {
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
        response = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) => response.cookies.set(name, value, options));
        Object.entries(headers).forEach(([key, value]) => response.headers.set(key, value));
      },
    },
  });

  // getUser() memverifikasi token ke Supabase Auth; jangan diganti getSession() untuk keputusan akses.
  const { data } = await supabase.auth.getUser();
  const path = request.nextUrl.pathname;

  if (authRequired && !data.user && (path === "/app" || path.startsWith("/app/"))) {
    const url = request.nextUrl.clone();
    url.pathname = "/masuk";
    url.search = "";
    url.searchParams.set("next", path);
    const redirect = NextResponse.redirect(url);
    response.cookies.getAll().forEach((cookie) => redirect.cookies.set(cookie));
    return redirect;
  }

  return response;
}
