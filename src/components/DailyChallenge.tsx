"use client";

import Link from "next/link";
import { useState } from "react";
import { useTranslation } from "@/i18n/LanguageContext";
import { useDailyChallenge } from "@/lib/useDailyChallenge";
import { DAILY_CHALLENGE_BONUS_XP, hasAnsweredToday, recordDailyChallengeAttempt } from "@/lib/dailyChallenge";

function normalize(value: string): string {
  return value.trim().toLowerCase().replace(/\s+/g, "");
}

export default function DailyChallenge() {
  const { dict } = useTranslation();
  const { dailyChallenge: t } = dict;
  const { problem, state } = useDailyChallenge();
  const [selected, setSelected] = useState("");
  const [checked, setChecked] = useState(false);

  if (!problem) return null;

  const { exercise } = problem;
  const answeredToday = hasAnsweredToday(state);
  const todayKey = new Date().toISOString().slice(0, 10);
  const wasCorrectToday = state.history[todayKey];

  const isCorrect = checked && normalize(selected) === normalize(exercise.answer);

  function handleCheck() {
    if (!selected) return;
    setChecked(true);
    const correct = normalize(selected) === normalize(exercise.answer);
    recordDailyChallengeAttempt(correct);
  }

  const showResolved = answeredToday || checked;
  const resolvedCorrect = checked ? isCorrect : wasCorrectToday;

  return (
    <section className="border-b border-border bg-surface">
      <div className="mx-auto w-full max-w-5xl px-6 py-12 sm:py-16">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <span className="rounded-full bg-primary/10 px-3 py-1 font-display text-xs font-semibold uppercase tracking-wide text-primary">
              {t.heading}
            </span>
            <p className="mt-2 max-w-xl text-sm text-muted">{t.subtitle}</p>
          </div>
          {state.current > 0 && (
            <div className="flex items-center gap-2 rounded-full border border-border bg-background px-3 py-1.5 text-sm font-semibold text-foreground">
              <span>🔥</span>
              <span>
                {state.current} {state.current === 1 ? t.streakLabelSingular : t.streakLabelPlural}
              </span>
            </div>
          )}
        </div>

        <div className="mt-6 rounded-2xl border border-border bg-background p-6 sm:p-8">
          <p className="text-xs font-medium text-muted">
            {problem.levelName} · {problem.topicTitle}
          </p>
          <p className="mt-3 whitespace-pre-line font-display text-lg font-medium text-foreground">
            {exercise.prompt}
          </p>

          {!showResolved && (
            <>
              {exercise.type === "multiple-choice" ? (
                <div className="mt-5 grid gap-3 sm:grid-cols-2">
                  {exercise.options?.map((option) => (
                    <button
                      key={option}
                      onClick={() => setSelected(option)}
                      className={`rounded-xl border px-4 py-3 text-left text-sm font-medium transition-colors ${
                        selected === option
                          ? "border-primary bg-primary/5 text-primary"
                          : "border-border text-foreground hover:border-primary/50"
                      }`}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              ) : (
                <input
                  type="text"
                  value={selected}
                  onChange={(e) => setSelected(e.target.value)}
                  placeholder="Digite sua resposta"
                  className="mt-5 w-full rounded-xl border border-border px-4 py-3 text-sm font-medium text-foreground outline-none transition-colors focus:border-primary"
                />
              )}

              <div className="mt-6 flex justify-end">
                <button
                  onClick={handleCheck}
                  disabled={!selected}
                  className="rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-primary-dark disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Verificar
                </button>
              </div>
            </>
          )}

          {showResolved && (
            <div
              className={`mt-5 rounded-xl p-4 text-sm leading-relaxed ${
                resolvedCorrect ? "bg-success-bg text-success" : "bg-error-bg text-error"
              }`}
            >
              <p className="flex items-center gap-2 font-semibold">
                {resolvedCorrect ? "Certinho!" : `Resposta correta: ${exercise.answer}`}
                {checked && resolvedCorrect && (
                  <span className="rounded-full bg-white/60 px-2 py-0.5 text-xs font-bold text-success">
                    +{DAILY_CHALLENGE_BONUS_XP} XP
                  </span>
                )}
              </p>
              <p className="mt-1 text-foreground/80">{exercise.explanation}</p>
              <p className="mt-3 font-medium text-foreground/70">{t.comeBackTomorrow}</p>
            </div>
          )}
        </div>

        <p className="mt-3 text-sm text-muted">
          {t.moreAt}{" "}
          <Link href={`/trilha/${problem.levelId}/${problem.topicId}`} className="font-semibold text-primary hover:underline">
            {problem.topicTitle}
          </Link>
        </p>
      </div>
    </section>
  );
}
