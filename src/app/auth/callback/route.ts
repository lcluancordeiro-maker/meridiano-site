import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

/** OAuth redirect target (Google/Microsoft login via Supabase). Exchanges the
 * `code` query param for a session cookie, then sends the user onward. */
export async function GET(request: Request): Promise<NextResponse> {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const intent = searchParams.get("intent");

  if (code) {
    const supabase = await createClient();
    if (supabase) {
      const { data, error } = await supabase.auth.exchangeCodeForSession(code);
      if (!error) {
        // `intent=signup` (only set for the "Continuar com ..." buttons on
        // /cadastro) plus created_at === last_sign_in_at tells apart a
        // brand-new OAuth account from an existing user who happened to
        // click through the signup page — only the former gets sent to the
        // placement quiz instead of the (still empty) progress dashboard.
        const user = data.user;
        const isNewAccount =
          intent === "signup" && !!user && user.created_at === user.last_sign_in_at;
        return NextResponse.redirect(
          `${origin}${isNewAccount ? "/diagnostico?boasVindas=1" : "/progresso"}`
        );
      }
    }
  }

  return NextResponse.redirect(`${origin}/entrar?erro=oauth`);
}
