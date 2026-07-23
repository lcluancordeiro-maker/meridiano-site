"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import {
  advanceLiveQuiz,
  endLiveQuiz,
  getLiveQuizQuestion,
  startLiveQuiz,
  submitLiveQuizAnswer,
} from "@/app/actions/liveQuiz";
import { liveQuizQuestionDeadline } from "@/lib/liveQuiz";
import { useTranslation } from "@/i18n/LanguageContext";

type SessionStatus = "lobby" | "question" | "finished";

type SessionState = {
  status: SessionStatus;
  currentQuestionIndex: number;
  questionStartedAt: string | null;
};

type Participant = { student_user_id: string; display_name: string | null; score: number };

type QuestionView = { index: number; totalQuestions: number; prompt: string; options: string[] };

type AnswerResult = { isCorrect: boolean; points: number; correctAnswer: string } | null;

const MEDALS: Record<number, string> = { 1: "🥇", 2: "🥈", 3: "🥉" };

export default function LiveQuizRoom({
  sessionId,
  isHost,
  currentUserId,
  turmaId,
  turmaName,
  joinCode,
  questionSeconds,
  totalQuestions,
  initialSession,
  initialParticipants,
}: {
  sessionId: string;
  isHost: boolean;
  currentUserId: string;
  turmaId: string;
  turmaName: string;
  joinCode: string | null;
  questionSeconds: number;
  totalQuestions: number;
  initialSession: SessionState;
  initialParticipants: Participant[];
}) {
  const { dict } = useTranslation();
  const t = dict.liveQuiz;

  const [session, setSession] = useState<SessionState>(initialSession);
  const [participants, setParticipants] = useState<Participant[]>(initialParticipants);
  // Keyed by question index rather than reset via an effect: a fresh index
  // simply has no entry yet, so there's nothing to "clear" when the host
  // advances — see the fetch effect below and handleAnswer.
  const [questionsByIndex, setQuestionsByIndex] = useState<Record<number, QuestionView>>({});
  const [answersByIndex, setAnswersByIndex] = useState<Record<number, { selected: string; result: AnswerResult }>>({});
  const [submitting, setSubmitting] = useState(false);
  const [hostActionPending, setHostActionPending] = useState(false);
  const [now, setNow] = useState(() => Date.now());

  const question = questionsByIndex[session.currentQuestionIndex] ?? null;
  const currentAnswer = answersByIndex[session.currentQuestionIndex];
  const selected = currentAnswer?.selected ?? null;
  const result = currentAnswer?.result ?? null;

  useEffect(() => {
    const supabase = createClient();
    if (!supabase) return;

    const channel = supabase
      .channel(`live-quiz:${sessionId}`)
      .on(
        "postgres_changes",
        { event: "UPDATE", schema: "public", table: "live_quiz_sessions", filter: `id=eq.${sessionId}` },
        (payload) => {
          const row = payload.new as {
            status: SessionStatus;
            current_question_index: number;
            question_started_at: string | null;
          };
          setSession({
            status: row.status,
            currentQuestionIndex: row.current_question_index,
            questionStartedAt: row.question_started_at,
          });
        }
      )
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "live_quiz_participants", filter: `session_id=eq.${sessionId}` },
        (payload) => {
          const row = payload.new as Participant;
          setParticipants((prev) => (prev.some((p) => p.student_user_id === row.student_user_id) ? prev : [...prev, row]));
        }
      )
      .on(
        "postgres_changes",
        { event: "UPDATE", schema: "public", table: "live_quiz_participants", filter: `session_id=eq.${sessionId}` },
        (payload) => {
          const row = payload.new as Participant;
          setParticipants((prev) => prev.map((p) => (p.student_user_id === row.student_user_id ? row : p)));
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [sessionId]);

  useEffect(() => {
    if (session.status !== "question") return;
    const index = session.currentQuestionIndex;
    let cancelled = false;

    getLiveQuizQuestion(sessionId, index).then((view) => {
      if (cancelled || "error" in view) return;
      setQuestionsByIndex((prev) => (prev[index] ? prev : { ...prev, [index]: view }));
    });

    return () => {
      cancelled = true;
    };
  }, [sessionId, session.status, session.currentQuestionIndex]);

  useEffect(() => {
    if (session.status !== "question") return;
    const interval = setInterval(() => setNow(Date.now()), 250);
    return () => clearInterval(interval);
  }, [session.status]);

  const deadline = session.questionStartedAt ? liveQuizQuestionDeadline(session.questionStartedAt, questionSeconds) : null;
  const secondsLeft = deadline ? Math.max(0, Math.ceil((deadline - now) / 1000)) : questionSeconds;

  const rankedParticipants = [...participants].sort((a, b) => b.score - a.score);

  async function handleStart() {
    setHostActionPending(true);
    await startLiveQuiz(sessionId);
    setHostActionPending(false);
  }

  async function handleAdvance() {
    setHostActionPending(true);
    await advanceLiveQuiz(sessionId);
    setHostActionPending(false);
  }

  async function handleEnd() {
    setHostActionPending(true);
    await endLiveQuiz(sessionId);
    setHostActionPending(false);
  }

  async function handleAnswer(option: string) {
    if (selected || submitting) return;
    const index = session.currentQuestionIndex;
    setAnswersByIndex((prev) => ({ ...prev, [index]: { selected: option, result: null } }));
    setSubmitting(true);
    const outcome = await submitLiveQuizAnswer(sessionId, index, option);
    setSubmitting(false);
    if (!("error" in outcome)) {
      setAnswersByIndex((prev) => ({ ...prev, [index]: { selected: option, result: outcome } }));
    }
  }

  return (
    <div className="mx-auto w-full max-w-2xl px-6 py-16">
      <Link href={`/turmas/${turmaId}`} className="text-sm font-medium text-primary hover:underline">
        {t.backToTurma}
      </Link>
      <h1 className="mt-4 font-display text-3xl font-semibold text-foreground">{turmaName}</h1>
      <p className="mt-1 text-sm text-muted">{t.questionCounter.replace("{current}", String(session.currentQuestionIndex + 1)).replace("{total}", String(totalQuestions))}</p>

      {session.status === "lobby" && (
        <section className="mt-8 rounded-xl border border-border bg-surface p-6">
          {isHost && joinCode && (
            <p className="text-sm text-muted">
              {t.joinCodePrefix}: <span className="font-mono text-2xl font-bold text-foreground">{joinCode}</span>
            </p>
          )}
          <h2 className="mt-4 font-display text-lg font-semibold text-foreground">
            {t.lobbyHeading} ({participants.length})
          </h2>
          <ul className="mt-3 flex flex-wrap gap-2">
            {participants.map((p) => (
              <li key={p.student_user_id} className="rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary">
                {p.display_name ?? "—"}
              </li>
            ))}
          </ul>
          {isHost ? (
            <button
              type="button"
              onClick={handleStart}
              disabled={hostActionPending || participants.length === 0}
              className="mt-6 rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-primary-dark disabled:cursor-not-allowed disabled:opacity-50"
            >
              {t.startButton}
            </button>
          ) : (
            <p className="mt-6 text-sm text-muted">{t.waitingForHost}</p>
          )}
        </section>
      )}

      {session.status === "question" && (
        <section className="mt-8">
          <div className="flex items-center justify-between">
            <span className="rounded-full bg-primary/10 px-3 py-1 text-sm font-semibold text-primary">
              {t.secondsLeft.replace("{seconds}", String(secondsLeft))}
            </span>
          </div>

          {!question ? (
            <p className="mt-6 text-sm text-muted">{t.loadingQuestion}</p>
          ) : (
            <>
              <p className="mt-4 font-display text-xl font-semibold text-foreground">{question.prompt}</p>
              <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
                {question.options.map((option) => {
                  const isSelected = selected === option;
                  const showResult = isSelected && result;
                  return (
                    <button
                      key={option}
                      type="button"
                      disabled={isHost || Boolean(selected) || submitting}
                      onClick={() => handleAnswer(option)}
                      className={`rounded-xl border p-4 text-left text-sm font-medium transition-colors disabled:cursor-not-allowed ${
                        showResult
                          ? result?.isCorrect
                            ? "border-success bg-success-bg text-success"
                            : "border-error bg-error-bg text-error"
                          : isSelected
                            ? "border-primary bg-primary/5 text-foreground"
                            : "border-border text-foreground hover:border-primary"
                      }`}
                    >
                      {option}
                    </button>
                  );
                })}
              </div>
            </>
          )}

          {!isHost && result && (
            <p className="mt-4 rounded-xl border border-border bg-surface p-4 text-sm">
              {result.isCorrect ? t.answerCorrect.replace("{points}", String(result.points)) : t.answerWrong.replace("{answer}", result.correctAnswer)}
            </p>
          )}
          {!isHost && !result && selected && <p className="mt-4 text-sm text-muted">{t.waitingForHostAdvance}</p>}

          {isHost && (
            <div className="mt-6 flex gap-3">
              <button
                type="button"
                onClick={handleAdvance}
                disabled={hostActionPending}
                className="rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-primary-dark disabled:cursor-not-allowed disabled:opacity-50"
              >
                {session.currentQuestionIndex + 1 >= totalQuestions ? t.finishButton : t.nextButton}
              </button>
              <button
                type="button"
                onClick={handleEnd}
                disabled={hostActionPending}
                className="rounded-lg border border-border px-6 py-3 text-sm font-semibold text-foreground transition-colors hover:border-primary disabled:cursor-not-allowed disabled:opacity-50"
              >
                {t.endButton}
              </button>
            </div>
          )}

          <LiveQuizLeaderboard
            participants={rankedParticipants}
            currentUserId={currentUserId}
            heading={t.leaderboardHeading}
            youLabel={t.youLabel}
          />
        </section>
      )}

      {session.status === "finished" && (
        <section className="mt-8">
          <h2 className="font-display text-xl font-semibold text-foreground">{t.finishedHeading}</h2>
          <LiveQuizLeaderboard
            participants={rankedParticipants}
            currentUserId={currentUserId}
            heading={t.leaderboardHeading}
            youLabel={t.youLabel}
          />
          <Link
            href={`/turmas/${turmaId}`}
            className="mt-6 inline-block rounded-lg border border-border px-6 py-3 text-sm font-semibold text-foreground transition-colors hover:border-primary"
          >
            {t.backToTurma}
          </Link>
        </section>
      )}
    </div>
  );
}

function LiveQuizLeaderboard({
  participants,
  currentUserId,
  heading,
  youLabel,
}: {
  participants: Participant[];
  currentUserId: string;
  heading: string;
  youLabel: string;
}) {
  if (participants.length === 0) return null;
  return (
    <div className="mt-8">
      <h3 className="font-display text-lg font-semibold text-foreground">{heading}</h3>
      <ol className="mt-3 flex flex-col gap-2">
        {participants.map((p, i) => {
          const rank = i + 1;
          const isMe = p.student_user_id === currentUserId;
          return (
            <li
              key={p.student_user_id}
              className={`flex items-center justify-between rounded-xl border px-4 py-3 text-sm ${
                isMe ? "border-primary bg-primary/5" : "border-border bg-surface"
              }`}
            >
              <span className="flex items-center gap-3">
                <span className="w-8 text-center font-display font-semibold text-muted">{MEDALS[rank] ?? `${rank}º`}</span>
                <span className="font-medium text-foreground">
                  {p.display_name ?? "—"}
                  {isMe ? ` (${youLabel})` : ""}
                </span>
              </span>
              <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">{p.score}</span>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
