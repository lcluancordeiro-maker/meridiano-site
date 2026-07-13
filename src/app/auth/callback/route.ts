import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

/** OAuth redirect target (Google/Microsoft login via Supabase). Exchanges the
 * `code` query param for a session cookie, then sends the user onward. */
export async function GET(request: Request): Promise<NextResponse> {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");

  if (code) {
    const supabase = await createClient();
    if (supabase) {
      const { error } = await supabase.auth.exchangeCodeForSession(code);
      if (!error) {
        return NextResponse.redirect(`${origin}/progresso`);
      }
    }
  }

  return NextResponse.redirect(`${origin}/entrar?erro=oauth`);
}
