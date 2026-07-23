"use server";

import { revalidatePath } from "next/cache";
import { getAuthedSupabase } from "@/lib/actionAuth";

export type SubmitProblemFormState = { error?: string; success?: string } | undefined;

const VALID_DIFFICULTIES = ["facil", "medio", "dificil", "olimpiada"];

/** Submits a new problem to the community bank — live immediately, no
 * approval queue (see community_problems in supabase/schema.sql for why:
 * same trust model as chat/communities, backstopped by "reportar erro"
 * instead of pre-moderation). */
export async function submitCommunityProblem(
  _prevState: SubmitProblemFormState,
  formData: FormData
): Promise<SubmitProblemFormState> {
  const auth = await getAuthedSupabase();
  if ("reason" in auth) {
    return auth.reason === "not-configured"
      ? { error: "O banco de problemas da comunidade ainda não está disponível neste app." }
      : { error: "Faça login para enviar um problema." };
  }
  const { supabase, user } = auth;

  const prompt = String(formData.get("prompt") ?? "").trim();
  const answer = String(formData.get("answer") ?? "").trim();
  const explanation = String(formData.get("explanation") ?? "").trim();
  const topicTag = String(formData.get("topicTag") ?? "").trim();
  const difficulty = String(formData.get("difficulty") ?? "");

  if (!prompt || !answer || !topicTag) {
    return { error: "Preencha ao menos o enunciado, a resposta e o assunto." };
  }
  if (!VALID_DIFFICULTIES.includes(difficulty)) {
    return { error: "Selecione um nível de dificuldade." };
  }

  const { error } = await supabase.from("community_problems").insert({
    author_id: user.id,
    prompt,
    answer,
    explanation,
    topic_tag: topicTag,
    difficulty,
  });

  if (error) return { error: "Não foi possível enviar o problema. Tente novamente." };

  revalidatePath("/comunidade/problemas");
  return { success: "Problema enviado!" };
}

export async function toggleProblemUpvote(problemId: string): Promise<{ ok: boolean }> {
  const auth = await getAuthedSupabase();
  if ("reason" in auth) return { ok: false };
  const { supabase } = auth;

  const { error } = await supabase.rpc("toggle_community_problem_upvote", {
    p_problem_id: problemId,
  });
  revalidatePath("/comunidade/problemas");
  return { ok: !error };
}

export async function deleteCommunityProblem(problemId: string): Promise<{ ok: boolean }> {
  const auth = await getAuthedSupabase();
  if ("reason" in auth) return { ok: false };
  const { supabase } = auth;

  const { error } = await supabase.from("community_problems").delete().eq("id", problemId);
  revalidatePath("/comunidade/problemas");
  return { ok: !error };
}
