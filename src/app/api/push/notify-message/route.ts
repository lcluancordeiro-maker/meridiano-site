import { NextResponse } from "next/server";
import type { SupabaseClient } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/server";
import { createServiceRoleClient } from "@/lib/supabase/serviceRole";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { isPushConfigured } from "@/lib/push/config";
import { sendPushNotification } from "@/lib/push/server";

export const runtime = "nodejs";

async function notifyRecipients(
  serviceRole: SupabaseClient,
  userIds: string[],
  payload: { title: string; body: string; url: string }
) {
  if (userIds.length === 0) return;

  const { data: subscriptions } = await serviceRole
    .from("push_subscriptions")
    .select("id, endpoint, p256dh, auth")
    .in("user_id", userIds);

  for (const sub of subscriptions ?? []) {
    const stillValid = await sendPushNotification(
      { endpoint: sub.endpoint, keys: { p256dh: sub.p256dh, auth: sub.auth } },
      payload
    );
    if (!stillValid) {
      await serviceRole.from("push_subscriptions").delete().eq("id", sub.id);
    }
  }
}

/**
 * Fire-and-forget endpoint called right after a chat/community message is
 * inserted (from the client, alongside the direct Realtime insert — see
 * ChatThread.tsx/CommunityThread.tsx) to push-notify the other
 * participants/members. Trusts the caller's own session, not the request
 * body, for who the sender is: it re-fetches the message through the
 * caller's own (RLS-scoped) client and requires sender_id to match the
 * logged-in user, so nobody can spam push notifications by guessing another
 * message's id.
 */
export async function POST(request: Request) {
  if (!isSupabaseConfigured || !isPushConfigured) {
    return NextResponse.json({ error: "not_configured" }, { status: 503 });
  }

  const supabase = await createClient();
  const user = supabase ? (await supabase.auth.getUser()).data.user : null;
  if (!supabase || !user) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const serviceRole = createServiceRoleClient();
  if (!serviceRole) {
    return NextResponse.json({ error: "not_configured" }, { status: 503 });
  }

  const body = await request.json().catch(() => null);
  const table = body?.table;
  const messageId = body?.messageId;
  if (table !== "dm_messages" && table !== "community_messages") {
    return NextResponse.json({ error: "invalid_table" }, { status: 400 });
  }
  if (typeof messageId !== "string") {
    return NextResponse.json({ error: "missing_message_id" }, { status: 400 });
  }

  if (table === "dm_messages") {
    const { data: message } = await supabase
      .from("dm_messages")
      .select("id, conversation_id, sender_id, body")
      .eq("id", messageId)
      .maybeSingle();

    if (!message || message.sender_id !== user.id) {
      return NextResponse.json({ error: "not_found" }, { status: 404 });
    }

    const { data: participants } = await supabase.rpc("get_conversation_participants", {
      p_conversation_id: message.conversation_id,
    });
    const participantRows = (participants as { user_id: string; display_name: string | null }[] | null) ?? [];
    const senderName = participantRows.find((p) => p.user_id === user.id)?.display_name ?? "Alguém";
    const recipientIds = participantRows.filter((p) => p.user_id !== user.id).map((p) => p.user_id);

    await notifyRecipients(serviceRole, recipientIds, {
      title: senderName,
      body: message.body.slice(0, 120),
      url: `/chat/${message.conversation_id}`,
    });
  } else {
    const { data: message } = await supabase
      .from("community_messages")
      .select("id, community_id, sender_id, body")
      .eq("id", messageId)
      .maybeSingle();

    if (!message || message.sender_id !== user.id) {
      return NextResponse.json({ error: "not_found" }, { status: 404 });
    }

    const [{ data: members }, { data: community }] = await Promise.all([
      supabase.rpc("get_community_members", { p_community_id: message.community_id }),
      supabase.from("communities").select("name").eq("id", message.community_id).maybeSingle(),
    ]);
    const memberRows = (members as { user_id: string; display_name: string | null }[] | null) ?? [];
    const senderName = memberRows.find((m) => m.user_id === user.id)?.display_name ?? "Alguém";
    const recipientIds = memberRows.filter((m) => m.user_id !== user.id).map((m) => m.user_id);

    await notifyRecipients(serviceRole, recipientIds, {
      title: community?.name ? `${senderName} em ${community.name}` : senderName,
      body: message.body.slice(0, 120),
      url: `/comunidades/${message.community_id}`,
    });
  }

  return NextResponse.json({ ok: true });
}
