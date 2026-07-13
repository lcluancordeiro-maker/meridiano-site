import "server-only";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";

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
