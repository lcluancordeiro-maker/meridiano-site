"use server";

import { redirect } from "next/navigation";
import { getAuthedSupabase } from "@/lib/actionAuth";
import { generateJoinCode } from "@/lib/turmaCode";
import { getTopic, type Difficulty } from "@/data/curriculum";
import {
  LIVE_QUIZ_QUESTION_SECONDS,
  computeLiveQuizPoints,
  isLiveQuizAnswerCorrect,
  isLiveQuizAnswerTooLate,
  pickLiveQuizExercises,
} from "@/lib/liveQuiz";

export type LiveQuizFormState = { error?: string } | undefined;
export type LiveQuizQuestionView =
  | { error: string }
  | { index: number; totalQuestions: number; prompt: string; options: string[]; difficulty: Difficulty };
export type LiveQuizAnswerResult = { error: string } | { isCorrect: boolean; points: number; correctAnswer: string };

const NOT_CONFIGURED_ERROR: LiveQuizFormState = { error: "Quiz ao vivo ainda não está disponível neste app." };
const MAX_JOIN_CODE_ATTEMPTS = 5;

/** Starts a live quiz session from a task already assigned to the turma
 * (turma_assignments) — reuses its level/topic/difficulty instead of
 * making the teacher pick them again, and keeps the question pool
 * server-side only (question_ids are stored, never the exercises
 * themselves — see supabase/schema.sql). */
export async function hostLiveQuiz(_prevState: LiveQuizFormState, formData: FormData): Promise<LiveQuizFormState> {
  const auth = await getAuthedSupabase();
  if ("reason" in auth) {
    return auth.reason === "not-configured" ? NOT_CONFIGURED_ERROR : { error: "Faça login para iniciar um quiz." };
  }
  const { supabase, user } = auth;

  const turmaId = String(formData.get("turmaId") ?? "");
  const assignmentId = String(formData.get("assignmentId") ?? "");
  if (!turmaId || !assignmentId) return { error: "Selecione uma tarefa da turma para o quiz." };

  const { data: assignment } = await supabase
    .from("turma_assignments")
    .select("level_id, topic_id, difficulty")
    .eq("id", assignmentId)
    .eq("turma_id", turmaId)
    .maybeSingle();
  if (!assignment) return { error: "Tarefa não encontrada." };

  const topic = getTopic(assignment.level_id, assignment.topic_id);
  const pool = pickLiveQuizExercises(topic?.exercises ?? [], assignment.difficulty as Difficulty);
  if (pool.length === 0) {
    return { error: "Este tópico não tem exercícios de múltipla escolha nessa dificuldade." };
  }

  let sessionId: string | undefined;
  for (let attempt = 0; attempt < MAX_JOIN_CODE_ATTEMPTS; attempt++) {
    const { data, error } = await supabase
      .from("live_quiz_sessions")
      .insert({
        turma_id: turmaId,
        host_user_id: user.id,
        join_code: generateJoinCode(),
        level_id: assignment.level_id,
        topic_id: assignment.topic_id,
        difficulty: assignment.difficulty,
        question_ids: pool.map((exercise) => exercise.id),
        question_seconds: LIVE_QUIZ_QUESTION_SECONDS,
      })
      .select("id")
      .single();

    if (!error) {
      sessionId = data?.id as string | undefined;
      break;
    }
    if (error.code !== "23505") return { error: "Não foi possível iniciar o quiz. Tente novamente." };
    // Unique violation on join_code (astronomically rare) — retry with a new code.
  }

  if (!sessionId) return { error: "Não foi possível gerar um código único. Tente novamente." };
  redirect(`/quiz-ao-vivo/${sessionId}`);
}

export async function joinLiveQuiz(_prevState: LiveQuizFormState, formData: FormData): Promise<LiveQuizFormState> {
  const auth = await getAuthedSupabase();
  if ("reason" in auth) {
    return auth.reason === "not-configured" ? NOT_CONFIGURED_ERROR : { error: "Faça login para entrar no quiz." };
  }
  const { supabase } = auth;

  const code = String(formData.get("code") ?? "").trim().toUpperCase();
  if (!code) return { error: "Informe o código do quiz." };

  const { data: sessionId, error } = await supabase.rpc("join_live_quiz_by_code", { p_join_code: code });
  if (error || !sessionId) {
    return { error: "Código inválido. Confira com o professor e tente de novo." };
  }

  redirect(`/quiz-ao-vivo/${sessionId}`);
}

/** Host-only controls below: each just updates live_quiz_sessions, relying
 * on its RLS update policy (auth.uid() = host_user_id) as the real
 * authorization check — the .eq("host_user_id", ...) here only narrows
 * the query, it isn't what makes this safe. Every connected client
 * (host and students alike) observes the resulting row change through
 * the same postgres_changes subscription. */
export async function startLiveQuiz(sessionId: string): Promise<{ error?: string } | undefined> {
  const auth = await getAuthedSupabase();
  if ("reason" in auth) return { error: "not_authorized" };
  const { supabase, user } = auth;

  const { error } = await supabase
    .from("live_quiz_sessions")
    .update({ status: "question", current_question_index: 0, question_started_at: new Date().toISOString() })
    .eq("id", sessionId)
    .eq("host_user_id", user.id)
    .eq("status", "lobby");

  if (error) return { error: "start_failed" };
}

export async function advanceLiveQuiz(sessionId: string): Promise<{ error?: string } | undefined> {
  const auth = await getAuthedSupabase();
  if ("reason" in auth) return { error: "not_authorized" };
  const { supabase, user } = auth;

  const { data: session } = await supabase
    .from("live_quiz_sessions")
    .select("current_question_index, question_ids")
    .eq("id", sessionId)
    .eq("host_user_id", user.id)
    .maybeSingle();
  if (!session) return { error: "not_found" };

  const totalQuestions = (session.question_ids as string[]).length;
  const nextIndex = session.current_question_index + 1;

  const { error } =
    nextIndex >= totalQuestions
      ? await supabase
          .from("live_quiz_sessions")
          .update({ status: "finished", ended_at: new Date().toISOString() })
          .eq("id", sessionId)
          .eq("host_user_id", user.id)
      : await supabase
          .from("live_quiz_sessions")
          .update({ current_question_index: nextIndex, question_started_at: new Date().toISOString() })
          .eq("id", sessionId)
          .eq("host_user_id", user.id);

  if (error) return { error: "advance_failed" };
}

export async function endLiveQuiz(sessionId: string): Promise<{ error?: string } | undefined> {
  const auth = await getAuthedSupabase();
  if ("reason" in auth) return { error: "not_authorized" };
  const { supabase, user } = auth;

  const { error } = await supabase
    .from("live_quiz_sessions")
    .update({ status: "finished", ended_at: new Date().toISOString() })
    .eq("id", sessionId)
    .eq("host_user_id", user.id);

  if (error) return { error: "end_failed" };
}

/** Fetches only the currently-visible question's prompt/options — never
 * the answer, and never a question ahead of current_question_index, so
 * a participant can't peek at future questions by guessing an index.
 * The host may also fetch any past index (for a recap), students may
 * not: only their own current one, matched exactly. */
export async function getLiveQuizQuestion(sessionId: string, questionIndex: number): Promise<LiveQuizQuestionView> {
  const auth = await getAuthedSupabase();
  if ("reason" in auth) return { error: "not_authorized" };
  const { supabase, user } = auth;

  const { data: session } = await supabase
    .from("live_quiz_sessions")
    .select("host_user_id, status, current_question_index, level_id, topic_id, question_ids")
    .eq("id", sessionId)
    .maybeSingle();
  if (!session) return { error: "not_found" };

  const isHost = session.host_user_id === user.id;
  if (!isHost) {
    const { data: participant } = await supabase
      .from("live_quiz_participants")
      .select("student_user_id")
      .eq("session_id", sessionId)
      .eq("student_user_id", user.id)
      .maybeSingle();
    if (!participant) return { error: "not_a_participant" };
    if (questionIndex !== session.current_question_index) return { error: "question_not_available" };
  }

  if (session.status === "lobby" || questionIndex > session.current_question_index) {
    return { error: "question_not_available" };
  }

  const questionIds = session.question_ids as string[];
  const topic = getTopic(session.level_id, session.topic_id);
  const exercise = topic?.exercises.find((e) => e.id === questionIds[questionIndex]);
  if (!exercise) return { error: "question_not_found" };

  return {
    index: questionIndex,
    totalQuestions: questionIds.length,
    prompt: exercise.prompt,
    options: exercise.options ?? [],
    difficulty: exercise.difficulty,
  };
}

/** Grades the answer server-side (the only place the curriculum's real
 * answer is available) and persists it through record_live_quiz_answer,
 * which atomically updates the participant's score and rejects a
 * duplicate submission for the same question. */
export async function submitLiveQuizAnswer(
  sessionId: string,
  questionIndex: number,
  answer: string
): Promise<LiveQuizAnswerResult> {
  const auth = await getAuthedSupabase();
  if ("reason" in auth) return { error: "not_authorized" };
  const { supabase } = auth;

  const { data: session } = await supabase
    .from("live_quiz_sessions")
    .select("status, current_question_index, question_started_at, level_id, topic_id, question_ids, question_seconds")
    .eq("id", sessionId)
    .maybeSingle();

  if (!session || session.status !== "question" || session.current_question_index !== questionIndex) {
    return { error: "question_closed" };
  }

  const elapsedMs = Date.now() - new Date(session.question_started_at as string).getTime();
  if (isLiveQuizAnswerTooLate(elapsedMs, session.question_seconds)) {
    return { error: "too_late" };
  }

  const questionIds = session.question_ids as string[];
  const topic = getTopic(session.level_id, session.topic_id);
  const exercise = topic?.exercises.find((e) => e.id === questionIds[questionIndex]);
  if (!exercise) return { error: "question_not_found" };

  const isCorrect = isLiveQuizAnswerCorrect(answer, exercise.answer);
  const points = computeLiveQuizPoints(isCorrect, elapsedMs, session.question_seconds);

  const { error } = await supabase.rpc("record_live_quiz_answer", {
    p_session_id: sessionId,
    p_question_index: questionIndex,
    p_is_correct: isCorrect,
    p_points: points,
  });
  if (error) return { error: "submit_failed" };

  return { isCorrect, points, correctAnswer: exercise.answer };
}
