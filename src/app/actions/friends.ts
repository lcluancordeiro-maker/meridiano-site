"use server";

import { revalidatePath } from "next/cache";
import { getAuthedSupabase } from "@/lib/actionAuth";

export type FriendFormState = { error?: string; success?: string } | undefined;

/** Sends a friend request by email — same find_user_by_email() RPC the
 * chat's "start a conversation" flow uses, so it never leaks whether an
 * email has an account beyond confirming this one specific address. The
 * request stays "pending" until the other side accepts it, so neither
 * shows up on the other's leaderboard yet. */
export async function sendFriendRequest(_prevState: FriendFormState, formData: FormData): Promise<FriendFormState> {
  const auth = await getAuthedSupabase();
  if ("reason" in auth) {
    return auth.reason === "not-configured"
      ? { error: "A liga de amigos ainda não está disponível neste app." }
      : { error: "Faça login para adicionar um amigo." };
  }
  const { supabase, user } = auth;

  const email = String(formData.get("email") ?? "").trim();
  if (!email) return { error: "Informe o e-mail do seu amigo." };

  const { data: friendId, error: findError } = await supabase.rpc("find_user_by_email", { p_email: email });
  if (findError || !friendId) {
    return { error: "Não encontramos ninguém com esse e-mail no app." };
  }
  if (friendId === user.id) {
    return { error: "Você não pode adicionar a si mesmo." };
  }

  const { error } = await supabase.from("friend_connections").insert({ user_id: user.id, friend_id: friendId });
  if (error) {
    return error.code === "23505"
      ? { error: "Vocês já têm uma conexão (pendente ou aceita)." }
      : { error: "Não foi possível enviar o convite. Tente novamente." };
  }

  revalidatePath("/liga");
  return { success: "Convite enviado!" };
}

export async function acceptFriendRequest(connectionId: string): Promise<void> {
  const auth = await getAuthedSupabase();
  if ("reason" in auth) return;
  await auth.supabase.from("friend_connections").update({ status: "accepted" }).eq("id", connectionId);
  revalidatePath("/liga");
}

/** Rejects a pending request, cancels one you sent, or removes an
 * accepted friend — all the same operation (delete the row), and RLS
 * (friend_connections_delete_either) already restricts it to either side
 * of the connection. */
export async function removeFriendConnection(connectionId: string): Promise<void> {
  const auth = await getAuthedSupabase();
  if ("reason" in auth) return;
  await auth.supabase.from("friend_connections").delete().eq("id", connectionId);
  revalidatePath("/liga");
}
