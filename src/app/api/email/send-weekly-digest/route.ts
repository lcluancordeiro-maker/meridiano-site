import { NextResponse } from "next/server";
import { createServiceRoleClient } from "@/lib/supabase/serviceRole";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { isEmailConfigured, sendEmail } from "@/lib/email/resend";
import { buildWeeklyDigestEmail, startOfWeekUTC, sumWeeklyXp } from "@/lib/weeklyDigest";

export const runtime = "nodejs";

function isValidCronSecret(headerValue: string | null): boolean {
  return Boolean(process.env.CRON_SECRET) && headerValue === process.env.CRON_SECRET;
}

/**
 * Sends a weekly activity digest (XP earned, exercises completed, current
 * streak) to every confirmed parent/guardian contact — one email per
 * `parent_consents` row with `confirmed_at` set. Meant to be called once a
 * week by an external scheduler (cron job, GitHub Actions workflow, Vercel
 * Cron, etc.), same pattern as /api/push/send-streak-reminders — see
 * docs/setup.md.
 */
export async function POST(request: Request) {
  if (!isSupabaseConfigured || !isEmailConfigured) {
    return NextResponse.json({ error: "not_configured" }, { status: 503 });
  }

  if (!isValidCronSecret(request.headers.get("x-cron-secret"))) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const supabase = createServiceRoleClient();
  if (!supabase) {
    return NextResponse.json({ error: "supabase_not_configured" }, { status: 503 });
  }

  const { data: consents, error: consentsError } = await supabase
    .from("parent_consents")
    .select("user_id, parent_email")
    .not("confirmed_at", "is", null);

  if (consentsError) {
    return NextResponse.json({ error: "query_failed" }, { status: 500 });
  }

  const now = new Date();
  const weekStartISO = startOfWeekUTC(now).toISOString();
  let sent = 0;
  let skipped = 0;

  for (const consent of consents ?? []) {
    const { data: gamification } = await supabase
      .from("gamification_state")
      .select("xp_log, streak_current")
      .eq("user_id", consent.user_id)
      .maybeSingle();

    if (!gamification) {
      skipped++;
      continue;
    }

    const { data: profile } = await supabase
      .from("profiles")
      .select("display_name")
      .eq("id", consent.user_id)
      .maybeSingle();

    const { count: exercisesCompletedThisWeek } = await supabase
      .from("topic_progress")
      .select("*", { count: "exact", head: true })
      .eq("user_id", consent.user_id)
      .eq("completed", true)
      .gte("updated_at", weekStartISO);

    const html = buildWeeklyDigestEmail({
      studentName: profile?.display_name || "seu filho(a)",
      weeklyXp: sumWeeklyXp((gamification.xp_log as Record<string, number>) ?? {}, now),
      exercisesCompletedThisWeek: exercisesCompletedThisWeek ?? 0,
      streakCurrent: gamification.streak_current ?? 0,
    });

    const ok = await sendEmail(consent.parent_email, "Resumo semanal do Meridiano Matemática", html);
    if (ok) sent++;
    else skipped++;
  }

  return NextResponse.json({ total: consents?.length ?? 0, sent, skipped });
}
