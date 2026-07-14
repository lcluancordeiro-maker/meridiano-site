"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";

async function requireUser() {
  if (!isSupabaseConfigured) return null;
  const supabase = await createClient();
  if (!supabase) return null;
  const user = (await supabase.auth.getUser()).data.user;
  if (!user) return null;
  return { supabase, user };
}

export async function blockUser(otherUserId: string, conversationId: string): Promise<void> {
  const ctx = await requireUser();
  if (!ctx) return;
  await ctx.supabase.from("blocked_users").insert({ blocker_id: ctx.user.id, blocked_id: otherUserId });
  revalidatePath(`/chat/${conversationId}`);
}

export async function unblockUser(otherUserId: string): Promise<void> {
  const ctx = await requireUser();
  if (!ctx) return;
  await ctx.supabase.from("blocked_users").delete().eq("blocker_id", ctx.user.id).eq("blocked_id", otherUserId);
  revalidatePath("/chat/bloqueados");
}

export async function reportMessage(messageTable: "dm_messages" | "community_messages", messageId: string): Promise<void> {
  const ctx = await requireUser();
  if (!ctx) return;
  await ctx.supabase.rpc("report_message", {
    p_message_table: messageTable,
    p_message_id: messageId,
    p_reason: null,
  });
}

export async function removeCommunityMember(communityId: string, userId: string): Promise<void> {
  const ctx = await requireUser();
  if (!ctx) return;
  await ctx.supabase.rpc("remove_community_member", { p_community_id: communityId, p_user_id: userId });
  revalidatePath(`/comunidades/${communityId}`);
}

export async function leaveCommunity(communityId: string): Promise<void> {
  const ctx = await requireUser();
  if (!ctx) return;
  await ctx.supabase.rpc("leave_community", { p_community_id: communityId });
  redirect("/comunidades");
}

export async function removeConversationParticipant(conversationId: string, userId: string): Promise<void> {
  const ctx = await requireUser();
  if (!ctx) return;
  await ctx.supabase.rpc("remove_conversation_participant", { p_conversation_id: conversationId, p_user_id: userId });
  revalidatePath(`/chat/${conversationId}`);
}

export async function leaveGroupConversation(conversationId: string): Promise<void> {
  const ctx = await requireUser();
  if (!ctx) return;
  await ctx.supabase.rpc("leave_group_conversation", { p_conversation_id: conversationId });
  redirect("/chat");
}
