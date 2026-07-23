import { NextResponse } from "next/server";
import { createServiceRoleClient } from "@/lib/supabase/serviceRole";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { isPushConfigured } from "@/lib/push/config";
import { isValidCronSecret, sendPushNotification } from "@/lib/push/server";

export const runtime = "nodejs";

function yesterdayISODate(): string {
  const d = new Date();
  d.setUTCDate(d.getUTCDate() - 1);
  return d.toISOString().slice(0, 10);
}

/**
 * Sends a "your streak is about to break" push to every user whose streak
 * was last extended yesterday (so it breaks tonight if they don't practice
 * today). Meant to be called once a day by an external scheduler (cron job,
 * GitHub Actions workflow, Vercel Cron, etc.) — see README for setup.
 */
export async function POST(request: Request) {
  if (!isSupabaseConfigured || !isPushConfigured) {
    return NextResponse.json({ error: "push_not_configured" }, { status: 503 });
  }

  if (!isValidCronSecret(request.headers.get("x-cron-secret"))) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const supabase = createServiceRoleClient();
  if (!supabase) {
    return NextResponse.json({ error: "supabase_not_configured" }, { status: 503 });
  }

  const { data: atRiskUsers, error: gamificationError } = await supabase
    .from("gamification_state")
    .select("user_id, streak_current")
    .eq("streak_last_active_date", yesterdayISODate())
    .gt("streak_current", 0);

  if (gamificationError) {
    return NextResponse.json({ error: "query_failed" }, { status: 500 });
  }

  let sent = 0;
  let expired = 0;

  for (const row of atRiskUsers ?? []) {
    const { data: subscriptions } = await supabase
      .from("push_subscriptions")
      .select("id, endpoint, p256dh, auth")
      .eq("user_id", row.user_id);

    for (const sub of subscriptions ?? []) {
      const stillValid = await sendPushNotification(
        { endpoint: sub.endpoint, keys: { p256dh: sub.p256dh, auth: sub.auth } },
        {
          title: "Sua sequência está em risco!",
          body: `Você está com ${row.streak_current} dia(s) seguidos — pratique hoje para não perder a sequência.`,
          url: "/progresso",
        }
      );

      if (stillValid) {
        sent++;
      } else {
        expired++;
        await supabase.from("push_subscriptions").delete().eq("id", sub.id);
      }
    }
  }

  return NextResponse.json({ atRiskUsers: atRiskUsers?.length ?? 0, sent, expired });
}
