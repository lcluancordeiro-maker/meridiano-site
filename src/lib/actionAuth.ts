import type { SupabaseClient, User } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/server";

export type AuthedSupabase =
  | { supabase: SupabaseClient; user: User }
  | { reason: "not-configured" | "not-logged-in" };

/** The "is Supabase configured → get a client → is someone logged in" guard
 * that most authed server actions need before doing their real work —
 * previously copy-pasted at the top of ~15 action functions across
 * account/auth/chat/communities/identity/leaderboard/lives/turmas.ts, each
 * with its own three near-identical checks. Callers still decide what to
 * return on failure (an error message, void, or a redirect all vary by
 * action) — this only centralizes how "authed" is determined, so there's
 * one place to get that logic right instead of fifteen. */
export async function getAuthedSupabase(): Promise<AuthedSupabase> {
  const supabase = await createClient();
  if (!supabase) return { reason: "not-configured" };
  const user = (await supabase.auth.getUser()).data.user;
  if (!user) return { reason: "not-logged-in" };
  return { supabase, user };
}
