"use client";

import { createBrowserClient } from "@supabase/ssr";
import type { SupabaseClient } from "@supabase/supabase-js";
import { SUPABASE_ANON_KEY, SUPABASE_URL, isSupabaseConfigured } from "./config";

let cached: SupabaseClient | null = null;

/** Browser Supabase client, or null when no project is configured yet
 * (the app then runs in local-only / guest mode). `auth.experimental.passkey`
 * enables `signInWithPasskey`/`registerPasskey`/`auth.passkey.*` — the
 * WebAuthn ceremony that lets a device's platform authenticator (Face ID,
 * Touch ID, Windows Hello, Android biometrics) stand in for a password. It's
 * marked experimental in the Supabase SDK; calls throw a clear error if the
 * flag is off. */
export function createClient(): SupabaseClient | null {
  if (!isSupabaseConfigured) return null;
  if (!cached) {
    cached = createBrowserClient(SUPABASE_URL!, SUPABASE_ANON_KEY!, {
      auth: { experimental: { passkey: true } },
    });
  }
  return cached;
}
