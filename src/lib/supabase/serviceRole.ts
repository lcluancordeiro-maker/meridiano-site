import "server-only";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { SUPABASE_URL, isSupabaseConfigured } from "./config";

const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

/** Server-only Supabase client authenticated as service_role — bypasses Row
 * Level Security entirely. Never import this outside of trusted server code
 * (e.g. the Stripe webhook); it must never reach the browser bundle. Returns
 * null when Supabase or the service role key isn't configured. */
export function createServiceRoleClient(): SupabaseClient | null {
  if (!isSupabaseConfigured || !SERVICE_ROLE_KEY) return null;

  return createClient(SUPABASE_URL!, SERVICE_ROLE_KEY, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}
