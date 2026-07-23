"use server";

import { redirect } from "next/navigation";
import { getAuthedSupabase } from "@/lib/actionAuth";
import { getSocialAccessStatus } from "@/lib/entitlements";

export type ChatFormState = { error?: string } | undefined;

const NOT_GRANTED_ERROR: ChatFormState = { error: "Verifique sua identidade antes de usar o chat." };

async function requireSocialAccess() {
  const status = await getSocialAccessStatus();
  return status === "granted";
}

export async function startDirectConversation(_prevState: ChatFormState, formData: FormData): Promise<ChatFormState> {
  const auth = await getAuthedSupabase();
  if ("reason" in auth) {
    return auth.reason === "not-configured"
      ? { error: "O chat ainda não está disponível neste app." }
      : { error: "Faça login para usar o chat." };
  }
  const { supabase } = auth;
  if (!(await requireSocialAccess())) return NOT_GRANTED_ERROR;

  const email = String(formData.get("email") ?? "").trim();
  if (!email) return { error: "Informe o e-mail da pessoa com quem você quer conversar." };

  const { data: otherUserId, error: findError } = await supabase.rpc("find_user_by_email", { p_email: email });
  if (findError || !otherUserId) {
    return { error: "Não encontramos ninguém com esse e-mail no app." };
  }

  const { data: conversationId, error } = await supabase.rpc("find_or_create_direct_conversation", {
    p_other_user_id: otherUserId,
  });

  if (error || !conversationId) {
    return { error: "Não foi possível iniciar a conversa. Tente novamente." };
  }

  redirect(`/chat/${conversationId}`);
}

export async function createGroupConversation(_prevState: ChatFormState, formData: FormData): Promise<ChatFormState> {
  const auth = await getAuthedSupabase();
  if ("reason" in auth) {
    return auth.reason === "not-configured"
      ? { error: "O chat ainda não está disponível neste app." }
      : { error: "Faça login para criar um grupo." };
  }
  const { supabase } = auth;
  if (!(await requireSocialAccess())) return NOT_GRANTED_ERROR;

  const title = String(formData.get("title") ?? "").trim();
  const emailsRaw = String(formData.get("emails") ?? "");
  const emails = emailsRaw
    .split(",")
    .map((e) => e.trim())
    .filter(Boolean);

  if (!title) return { error: "Dê um nome para o grupo." };
  if (emails.length === 0) return { error: "Informe pelo menos um e-mail para adicionar ao grupo." };

  const memberIds: string[] = [];
  for (const email of emails) {
    const { data: otherUserId } = await supabase.rpc("find_user_by_email", { p_email: email });
    if (otherUserId) memberIds.push(otherUserId as string);
  }

  if (memberIds.length === 0) {
    return { error: "Não encontramos ninguém com os e-mails informados." };
  }

  const { data: conversationId, error } = await supabase.rpc("create_group_conversation", {
    p_title: title,
    p_member_ids: memberIds,
  });

  if (error || !conversationId) {
    return { error: "Não foi possível criar o grupo. Tente novamente." };
  }

  redirect(`/chat/${conversationId}`);
}
