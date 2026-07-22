"use server";

import { getAuthedSupabase } from "@/lib/actionAuth";

export type HistoryMessage = { role: "user" | "assistant"; content: string };

/** Fetches the full transcript of a past Gauss conversation for /historico
 * — done on demand (not upfront with the conversation list) so opening
 * /historico doesn't pull every message the student has ever exchanged
 * with the tutor. RLS (gauss_messages_own) already scopes this to the
 * caller's own conversations; the empty array on failure/mismatch just
 * means "nothing to show", not a security boundary by itself. */
export async function getConversationMessages(conversationId: string): Promise<HistoryMessage[]> {
  const auth = await getAuthedSupabase();
  if ("reason" in auth) return [];
  const { supabase } = auth;

  const { data, error } = await supabase
    .from("gauss_messages")
    .select("role, content")
    .eq("conversation_id", conversationId)
    .order("created_at", { ascending: true });

  if (error || !data) return [];
  return data as HistoryMessage[];
}
