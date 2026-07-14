import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";

/**
 * Exports everything this app knows about the logged-in user as a single
 * JSON file — the LGPD/GDPR "data portability" right. Every query here
 * runs through the user's own (RLS-scoped) Supabase client, so it can only
 * ever return rows the user already has access to; no service-role client
 * needed.
 */
export async function GET() {
  if (!isSupabaseConfigured) {
    return NextResponse.json({ error: "not_configured" }, { status: 503 });
  }

  const supabase = await createClient();
  const user = supabase ? (await supabase.auth.getUser()).data.user : null;
  if (!supabase || !user) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const [
    profile,
    gamification,
    topicProgress,
    subscription,
    identityVerification,
    parentConsent,
    turmasCreated,
    turmaMemberships,
    conversations,
    sentDirectMessages,
    communitiesCreated,
    communityMemberships,
    sentCommunityMessages,
    hostedLives,
    blockedUsers,
    reportsFiled,
  ] = await Promise.all([
    supabase.from("profiles").select("*").eq("id", user.id).maybeSingle(),
    supabase.from("gamification_state").select("*").eq("user_id", user.id).maybeSingle(),
    supabase.from("topic_progress").select("*").eq("user_id", user.id),
    supabase.from("subscriptions").select("*").eq("user_id", user.id).maybeSingle(),
    supabase.from("identity_verifications").select("status, date_of_birth, verified_at").eq("user_id", user.id).maybeSingle(),
    supabase.from("parent_consents").select("parent_email, confirmed_at, created_at").eq("user_id", user.id).maybeSingle(),
    supabase.from("turmas").select("id, name, join_code, created_at").eq("teacher_user_id", user.id),
    supabase.from("turma_members").select("turma_id, joined_at").eq("student_user_id", user.id),
    supabase.rpc("list_my_conversations"),
    supabase.from("dm_messages").select("conversation_id, body, created_at").eq("sender_id", user.id),
    supabase.from("communities").select("id, name, join_code, is_public, created_at").eq("creator_id", user.id),
    supabase.from("community_members").select("community_id, role, joined_at").eq("user_id", user.id),
    supabase.from("community_messages").select("community_id, body, created_at").eq("sender_id", user.id),
    supabase.from("live_sessions").select("room_name, title, started_at, ended_at").eq("host_id", user.id),
    supabase.from("blocked_users").select("blocked_id, created_at").eq("blocker_id", user.id),
    supabase.from("message_reports").select("message_table, message_id, reason, status, created_at").eq("reporter_id", user.id),
  ]);

  const exportedAt = new Date().toISOString();

  const payload = {
    exportedAt,
    account: { id: user.id, email: user.email, createdAt: user.created_at },
    profile: profile.data,
    gamification: gamification.data,
    topicProgress: topicProgress.data ?? [],
    subscription: subscription.data,
    identityVerification: identityVerification.data,
    parentConsent: parentConsent.data,
    turmasCreated: turmasCreated.data ?? [],
    turmaMemberships: turmaMemberships.data ?? [],
    conversations: conversations.data ?? [],
    sentDirectMessages: sentDirectMessages.data ?? [],
    communitiesCreated: communitiesCreated.data ?? [],
    communityMemberships: communityMemberships.data ?? [],
    sentCommunityMessages: sentCommunityMessages.data ?? [],
    hostedLives: hostedLives.data ?? [],
    blockedUsers: blockedUsers.data ?? [],
    reportsFiled: reportsFiled.data ?? [],
  };

  return new NextResponse(JSON.stringify(payload, null, 2), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
      "Content-Disposition": `attachment; filename="meridiano-meus-dados-${exportedAt.slice(0, 10)}.json"`,
    },
  });
}
