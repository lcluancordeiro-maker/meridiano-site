"use client";

import { createClient } from "@/lib/supabase/client";
import { isFirstOccurrence } from "./firstTimeGate";

/** Fire-and-forget product analytics — a no-op when Supabase isn't
 * configured, and never throws or blocks the caller: a failed insert
 * (offline, RLS rejection) should never break the feature it's attached
 * to. Feeds `/admin/analytics` and, longer-term, decisions like whether
 * the social stack (chat/comunidades/lives) is worth its upkeep. */
export function trackEvent(eventName: string, metadata: Record<string, unknown> = {}): void {
  const supabase = createClient();
  if (!supabase) return;

  supabase.auth.getUser().then(({ data }) => {
    void supabase
      .from("analytics_events")
      .insert({ event_name: eventName, user_id: data.user?.id ?? null, metadata })
      .then(() => {});
  });
}

/** Like `trackEvent`, but only sends once per browser per event name —
 * for milestones like "first exercise completed" where later repeats
 * aren't interesting. */
export function trackFirstTimeEvent(eventName: string, metadata: Record<string, unknown> = {}): void {
  if (!isFirstOccurrence(eventName)) return;
  trackEvent(eventName, metadata);
}
