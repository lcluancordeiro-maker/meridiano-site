"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { generateJoinCode } from "@/lib/turmaCode";

export type TurmaFormState = { error?: string } | undefined;

const NOT_CONFIGURED_ERROR: TurmaFormState = { error: "Turmas ainda não estão disponíveis neste app." };
const MAX_JOIN_CODE_ATTEMPTS = 5;

export async function createTurma(_prevState: TurmaFormState, formData: FormData): Promise<TurmaFormState> {
  if (!isSupabaseConfigured) return NOT_CONFIGURED_ERROR;
  const supabase = await createClient();
  if (!supabase) return NOT_CONFIGURED_ERROR;

  const user = (await supabase.auth.getUser()).data.user;
  if (!user) return { error: "Faça login para criar uma turma." };

  const name = String(formData.get("name") ?? "").trim();
  if (!name) return { error: "Dê um nome para a turma." };

  let turmaId: string | undefined;
  for (let attempt = 0; attempt < MAX_JOIN_CODE_ATTEMPTS; attempt++) {
    const { data, error } = await supabase
      .from("turmas")
      .insert({ teacher_user_id: user.id, name, join_code: generateJoinCode() })
      .select("id")
      .single();

    if (!error) {
      turmaId = data?.id as string | undefined;
      break;
    }
    if (error.code !== "23505") {
      return { error: "Não foi possível criar a turma. Tente novamente." };
    }
    // Unique violation on join_code (astronomically rare) — retry with a new code.
  }

  if (!turmaId) {
    return { error: "Não foi possível gerar um código único. Tente novamente." };
  }

  redirect(`/turmas/${turmaId}`);
}

export async function joinTurma(_prevState: TurmaFormState, formData: FormData): Promise<TurmaFormState> {
  if (!isSupabaseConfigured) return NOT_CONFIGURED_ERROR;
  const supabase = await createClient();
  if (!supabase) return NOT_CONFIGURED_ERROR;

  const user = (await supabase.auth.getUser()).data.user;
  if (!user) return { error: "Faça login para entrar em uma turma." };

  const code = String(formData.get("code") ?? "").trim().toUpperCase();
  if (!code) return { error: "Informe o código da turma." };

  const { data: turmaId, error } = await supabase.rpc("join_turma_by_code", { p_join_code: code });
  if (error || !turmaId) {
    return { error: "Código inválido. Confira com o professor e tente de novo." };
  }

  redirect(`/turmas/${turmaId}`);
}

export async function createAssignment(_prevState: TurmaFormState, formData: FormData): Promise<TurmaFormState> {
  if (!isSupabaseConfigured) return NOT_CONFIGURED_ERROR;
  const supabase = await createClient();
  if (!supabase) return NOT_CONFIGURED_ERROR;

  const turmaId = String(formData.get("turmaId") ?? "");
  const levelId = String(formData.get("levelId") ?? "");
  const topicId = String(formData.get("topicId") ?? "");
  const difficulty = String(formData.get("difficulty") ?? "");

  if (!turmaId || !levelId || !topicId || !difficulty) {
    return { error: "Selecione nível, tópico e dificuldade." };
  }

  const { error } = await supabase
    .from("turma_assignments")
    .insert({ turma_id: turmaId, level_id: levelId, topic_id: topicId, difficulty });

  if (error) {
    return { error: "Não foi possível criar a tarefa. Tente novamente." };
  }

  redirect(`/turmas/${turmaId}`);
}
