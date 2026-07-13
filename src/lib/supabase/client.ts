"use client";

import { createBrowserClient } from "@supabase/ssr";
import type { SupabaseClient } from "@supabase/supabase-js";
import { SUPABASE_ANON_KEY, SUPABASE_URL, isSupabaseConfigured } from "./config";

let cached: SupabaseClient | null = null;

/** Browser Supabase client, or null when no project is configured yet
 * (the app then runs in local-only / guest mode). */
export function createClient(): SupabaseClient | null {
  if (!isSupabaseConfigured) return null;
  if (!cached) {
    cached = createBrowserClient(SUPABASE_URL!, SUPABASE_ANON_KEY!);
  }
  return cached;
}
