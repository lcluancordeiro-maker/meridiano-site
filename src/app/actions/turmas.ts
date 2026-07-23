"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { getAuthedSupabase } from "@/lib/actionAuth";
import { generateJoinCode } from "@/lib/turmaCode";
import { parseRosterEmails } from "@/lib/lmsRoster";

export type TurmaFormState = { error?: string } | undefined;
export type ImportRosterFormState = { error?: string; success?: string } | undefined;

const NOT_CONFIGURED_ERROR: TurmaFormState = { error: "Turmas ainda não estão disponíveis neste app." };
const MAX_JOIN_CODE_ATTEMPTS = 5;

export async function createTurma(_prevState: TurmaFormState, formData: FormData): Promise<TurmaFormState> {
  const auth = await getAuthedSupabase();
  if ("reason" in auth) {
    return auth.reason === "not-configured"
      ? NOT_CONFIGURED_ERROR
      : { error: "Faça login para criar uma turma." };
  }
  const { supabase, user } = auth;

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
  const auth = await getAuthedSupabase();
  if ("reason" in auth) {
    return auth.reason === "not-configured"
      ? NOT_CONFIGURED_ERROR
      : { error: "Faça login para entrar em uma turma." };
  }
  const { supabase } = auth;

  const code = String(formData.get("code") ?? "").trim().toUpperCase();
  if (!code) return { error: "Informe o código da turma." };

  const { data: turmaId, error } = await supabase.rpc("join_turma_by_code", { p_join_code: code });
  if (error || !turmaId) {
    return { error: "Código inválido. Confira com o professor e tente de novo." };
  }

  redirect(`/turmas/${turmaId}`);
}

/** Imports a roster exported from Google Classroom or Clever (CSV or a
 * bare email list — see parseRosterEmails) by adding, one at a time, every
 * student whose e-mail already has an account. There's no real Classroom/
 * Clever OAuth here (no registered app in this sandbox) — this is the
 * practical v1: both platforms natively export a roster CSV, so a teacher
 * can do this today without either app being OAuth-approved. See
 * docs/lms-integration.md for the real-OAuth path this would grow into. */
export async function importTurmaRoster(
  _prevState: ImportRosterFormState,
  formData: FormData
): Promise<ImportRosterFormState> {
  const auth = await getAuthedSupabase();
  if ("reason" in auth) {
    return auth.reason === "not-configured"
      ? { error: "Turmas ainda não estão disponíveis neste app." }
      : { error: "Faça login para importar uma turma." };
  }
  const { supabase } = auth;

  const turmaId = String(formData.get("turmaId") ?? "");
  const roster = String(formData.get("roster") ?? "");
  if (!turmaId || !roster.trim()) {
    return { error: "Cole ou envie a lista exportada do Classroom/Clever." };
  }

  const { emails, skippedLines } = parseRosterEmails(roster);
  if (emails.length === 0) {
    return { error: "Nenhum e-mail válido encontrado no arquivo." };
  }

  let added = 0;
  let alreadyMember = 0;
  let notFound = 0;
  for (const email of emails) {
    const { data, error } = await supabase.rpc("add_turma_member_by_email", {
      p_turma_id: turmaId,
      p_email: email,
    });
    if (error) continue;
    if (data === "added") added++;
    else if (data === "already_member") alreadyMember++;
    else if (data === "not_found") notFound++;
  }

  const parts = [`${added} aluno(s) adicionado(s)`];
  if (alreadyMember > 0) parts.push(`${alreadyMember} já estavam na turma`);
  if (notFound > 0) parts.push(`${notFound} e-mail(s) ainda sem conta no app (podem entrar pelo código)`);
  if (skippedLines > 0) parts.push(`${skippedLines} linha(s) ignorada(s)`);

  return { success: parts.join(" · ") + "." };
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
