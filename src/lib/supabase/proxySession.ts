import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { SUPABASE_ANON_KEY, SUPABASE_URL, isSupabaseConfigured } from "./config";

/** Refreshes the Supabase auth session cookie on every request. Called from
 * the project's proxy.ts (Next.js 16 renamed "Middleware" to "Proxy" — same
 * mechanism, new file/export name). No-op when Supabase isn't configured. */
export async function updateSession(request: NextRequest): Promise<NextResponse> {
  let response = NextResponse.next({ request });

  if (!isSupabaseConfigured) return response;

  const supabase = createServerClient(SUPABASE_URL!, SUPABASE_ANON_KEY!, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
        response = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) =>
          response.cookies.set(name, value, options)
        );
      },
    },
  });

  // Do not add logic between createServerClient and getUser() — a stray
  // early return here can make the session refresh silently stop working.
  await supabase.auth.getUser();

  return response;
}
