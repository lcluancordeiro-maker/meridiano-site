import "server-only";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { isIdentityConfigured } from "@/lib/identity/config";

/** Whether the currently logged-in visitor has an active Premium
 * subscription. Always false when logged out or when Supabase/Stripe isn't
 * configured — the same graceful-degradation pattern used everywhere else
 * in this app. */
export async function isPremiumUser(): Promise<boolean> {
  if (!isSupabaseConfigured) return false;

  const supabase = await createClient();
  const user = supabase ? (await supabase.auth.getUser()).data.user : null;
  if (!supabase || !user) return false;

  const { data } = await supabase
    .from("subscriptions")
    .select("status, current_period_end")
    .eq("user_id", user.id)
    .maybeSingle();

  if (!data || data.status !== "active") return false;
  if (data.current_period_end && new Date(data.current_period_end) < new Date()) return false;

  return true;
}

/**
 * The current state of a user's access to social features (chat,
 * communities, lives) — all of which require a completed identity
 * verification, and additionally require confirmed parental consent when
 * the verified age is under 18.
 *
 * - "not_configured": Stripe Identity isn't set up in this deployment.
 * - "logged_out": no session.
 * - "unverified" | "pending" | "failed": no row yet, a check in progress,
 *   or a previous attempt that didn't complete — all show the same
 *   "start verification" prompt.
 * - "needs_parental_consent": identity confirmed as a minor; a
 *   parent/guardian must confirm via the emailed link before unlocking.
 * - "granted": fully unlocked.
 */
export type SocialAccessStatus =
  | "not_configured"
  | "logged_out"
  | "unverified"
  | "pending"
  | "failed"
  | "needs_parental_consent"
  | "granted";

export async function getSocialAccessStatus(): Promise<SocialAccessStatus> {
  if (!isSupabaseConfigured || !isIdentityConfigured) return "not_configured";

  const supabase = await createClient();
  const user = supabase ? (await supabase.auth.getUser()).data.user : null;
  if (!supabase || !user) return "logged_out";

  const { data: verification } = await supabase
    .from("identity_verifications")
    .select("status")
    .eq("user_id", user.id)
    .maybeSingle();

  if (!verification) return "unverified";
  if (verification.status === "pending") return "pending";
  if (verification.status === "failed") return "failed";
  if (verification.status === "verified") return "granted";

  if (verification.status === "verified_minor") {
    const { data: consent } = await supabase
      .from("parent_consents")
      .select("confirmed_at")
      .eq("user_id", user.id)
      .maybeSingle();
    return consent?.confirmed_at ? "granted" : "needs_parental_consent";
  }

  return "unverified";
}
