"use server";

import { redirect } from "next/navigation";
import { getAuthedSupabase } from "@/lib/actionAuth";
import { getSocialAccessStatus, isPremiumUser } from "@/lib/entitlements";
import { generateJoinCode } from "@/lib/turmaCode";

export type CommunityFormState = { error?: string } | undefined;

const NOT_GRANTED_ERROR: CommunityFormState = { error: "Verifique sua identidade antes de usar comunidades." };
const FREE_MEMBER_CAP = 20;
const FREE_COMMUNITY_LIMIT = 1;

export async function createCommunity(_prevState: CommunityFormState, formData: FormData): Promise<CommunityFormState> {
  const auth = await getAuthedSupabase();
  if ("reason" in auth) {
    return auth.reason === "not-configured"
      ? { error: "Comunidades ainda não estão disponíveis neste app." }
      : { error: "Faça login para criar uma comunidade." };
  }
  const { supabase, user } = auth;
  if ((await getSocialAccessStatus()) !== "granted") return NOT_GRANTED_ERROR;

  const name = String(formData.get("name") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  const isPublic = formData.get("isPublic") === "on";

  if (!name) return { error: "Dê um nome para a comunidade." };

  const premium = await isPremiumUser();

  if (!premium) {
    const { count } = await supabase
      .from("communities")
      .select("id", { count: "exact", head: true })
      .eq("creator_id", user.id);
    if ((count ?? 0) >= FREE_COMMUNITY_LIMIT) {
      return { error: `No plano gratuito você pode criar até ${FREE_COMMUNITY_LIMIT} comunidade. Assine o Premium para criar mais.` };
    }
  }

  let communityId: string | undefined;
  for (let attempt = 0; attempt < 5; attempt++) {
    const { data, error } = await supabase.rpc("create_community", {
      p_name: name,
      p_description: description || null,
      p_is_public: isPublic,
      p_join_code: generateJoinCode(),
      p_member_cap: premium ? null : FREE_MEMBER_CAP,
    });
    if (!error) {
      communityId = data as string | undefined;
      break;
    }
    if (error.code !== "23505") {
      return { error: "Não foi possível criar a comunidade. Tente novamente." };
    }
  }

  if (!communityId) return { error: "Não foi possível gerar um código único. Tente novamente." };

  redirect(`/comunidades/${communityId}`);
}

export async function joinCommunity(_prevState: CommunityFormState, formData: FormData): Promise<CommunityFormState> {
  const auth = await getAuthedSupabase();
  if ("reason" in auth) {
    return auth.reason === "not-configured"
      ? { error: "Comunidades ainda não estão disponíveis neste app." }
      : { error: "Faça login para entrar em uma comunidade." };
  }
  const { supabase } = auth;
  if ((await getSocialAccessStatus()) !== "granted") return NOT_GRANTED_ERROR;

  const code = String(formData.get("code") ?? "").trim().toUpperCase();
  if (!code) return { error: "Informe o código da comunidade." };

  const { data: communityId, error } = await supabase.rpc("join_community", { p_join_code: code });
  if (error || !communityId) {
    return { error: "Código inválido ou comunidade lotada. Confira e tente de novo." };
  }

  redirect(`/comunidades/${communityId}`);
}

export async function joinCommunityByCode(code: string, formData: FormData): Promise<void> {
  const scoped = new FormData();
  for (const [key, value] of formData.entries()) scoped.append(key, value);
  scoped.set("code", code);
  await joinCommunity(undefined, scoped);
}
