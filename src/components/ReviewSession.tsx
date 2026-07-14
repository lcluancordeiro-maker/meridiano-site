"use client";

import { useState } from "react";
import Link from "next/link";
import { DIFFICULTY_LABELS, getTopic, type Exercise } from "@/data/curriculum";
import { getDueReviews, recordReviewResult } from "@/lib/reviewSchedule";
import { DIFFICULTY_XP, recordCorrectAnswer } from "@/lib/gamification";
import ProgressBar from "./ProgressBar";

type DueItem = {
  levelId: string;
  topicId: string;
  topicTitle: string;
  exercise: Exercise;
};

function normalize(value: string): string {
  return value.trim().toLowerCase().replace(/\s+/g, "");
}

/** Resolves the currently-due schedule entries into their full exercise data,
 * dropping any entry whose topic/exercise no longer exists in the curriculum
 * (e.g. content that was renamed or removed since the entry was scheduled).
 * Captured once, at session start — reviewing an item removes it from the
 * live due-schedule immediately, and we don't want that to reshuffle the
 * batch the student is in the middle of working through. */
function buildDueItems(): DueItem[] {
  return getDueReviews()
    .map((entry) => {
      const topic = getTopic(entry.levelId, entry.topicId);
      const exercise = topic?.exercises.find((e) => e.id === entry.exerciseId);
      if (!topic || !exercise) return null;
      return { levelId: entry.levelId, topicId: entry.topicId, topicTitle: topic.title, exercise };
    })
    .filter((item): item is DueItem => item !== null);
}

export default function ReviewSession() {
  const [items] = useState<DueItem[]>(buildDueItems);
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState("");
  const [checked, setChecked] = useState(false);
  const [reviewedCount, setReviewedCount] = useState(0);

  if (items.length === 0) {
    return (
      <div className="rounded-2xl border border-border bg-surface p-8 text-center">
        <p className="font-display text-3xl">🎉</p>
        <h2 className="mt-3 font-display text-xl font-semibold text-foreground">
          Nada pendente por aqui!
        </h2>
        <p className="mt-2 text-sm text-muted">
          Quando você errar um exercício em qualquer trilha, ele volta a
          aparecer aqui depois de um tempo, pra ajudar a fixar o conteúdo.
        </p>
        <Link
          href="/#niveis"
          className="mt-6 inline-block rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-primary-dark"
        >
          Ir para as trilhas
        </Link>
      </div>
    );
  }

  if (index >= items.length) {
    return (
      <div className="rounded-2xl border border-border bg-surface p-8 text-center">
        <p className="font-display text-3xl">✅</p>
        <h2 className="mt-3 font-display text-xl font-semibold text-foreground">
          Revisão concluída!
        </h2>
        <p className="mt-2 text-sm text-muted">
          Você revisou {reviewedCount} exercício{reviewedCount === 1 ? "" : "s"}. Volte
          mais tarde para a próxima leva.
        </p>
        <Link
          href="/progresso"
          className="mt-6 inline-block rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-primary-dark"
        >
          Ver progresso
        </Link>
      </div>
    );
  }

  const current = items[index];
  const exercise = current.exercise;
  const xpPerCorrect = DIFFICULTY_XP[exercise.difficulty];
  const isCorrect = checked && normalize(selected) === normalize(exercise.answer);

  function handleCheck() {
    if (!selected) return;
    const correct = normalize(selected) === normalize(exercise.answer);
    setChecked(true);
    if (correct) {
      recordCorrectAnswer(exercise.difficulty);
    }
    recordReviewResult(current.levelId, current.topicId, exercise.difficulty, exercise.id, correct);
  }

  function handleNext() {
    setReviewedCount((c) => c + 1);
    setIndex((i) => i + 1);
    setSelected("");
    setChecked(false);
  }

  return (
    <div className="rounded-2xl border border-border bg-surface p-6 sm:p-8">
      <div className="flex items-center justify-between text-xs font-medium text-muted">
        <span>
          Revisão {index + 1} de {items.length}
        </span>
        <span>
          {current.topicTitle} · {DIFFICULTY_LABELS[exercise.difficulty]}
        </span>
      </div>
      <div className="mt-3">
        <ProgressBar value={index / items.length} />
      </div>

      <p className="mt-6 whitespace-pre-line font-display text-lg font-medium text-foreground">
        {exercise.prompt}
      </p>

      {exercise.type === "multiple-choice" ? (
        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          {exercise.options?.map((option) => {
            const isSelected = selected === option;
            const showCorrect = checked && normalize(option) === normalize(exercise.answer);
            const showWrong = checked && isSelected && !showCorrect;
            return (
              <button
                key={option}
                disabled={checked}
                onClick={() => setSelected(option)}
                className={`rounded-xl border px-4 py-3 text-left text-sm font-medium transition-colors ${
                  showCorrect
                    ? "border-success bg-success-bg text-success"
                    : showWrong
                    ? "border-error bg-error-bg text-error"
                    : isSelected
                    ? "border-primary bg-primary/5 text-primary"
                    : "border-border text-foreground hover:border-primary/50"
                }`}
              >
                {option}
              </button>
            );
          })}
        </div>
      ) : (
        <div className="mt-5">
          <input
            type="text"
            inputMode="text"
            disabled={checked}
            value={selected}
            onChange={(e) => setSelected(e.target.value)}
            placeholder="Digite sua resposta"
            className={`w-full rounded-xl border px-4 py-3 text-sm font-medium outline-none transition-colors ${
              checked
                ? isCorrect
                  ? "border-success bg-success-bg text-success"
                  : "border-error bg-error-bg text-error"
                : "border-border text-foreground focus:border-primary"
            }`}
          />
        </div>
      )}

      {checked && (
        <div
          className={`mt-4 rounded-xl p-4 text-sm leading-relaxed ${
            isCorrect ? "bg-success-bg text-success" : "bg-error-bg text-error"
          }`}
        >
          <p className="flex items-center gap-2 font-semibold">
            {isCorrect ? "Certinho!" : `Resposta correta: ${exercise.answer}`}
            {isCorrect && (
              <span className="rounded-full bg-white/60 px-2 py-0.5 text-xs font-bold text-success">
                +{xpPerCorrect} XP
              </span>
            )}
          </p>
          <p className="mt-1 text-foreground/80">{exercise.explanation}</p>
        </div>
      )}

      <div className="mt-6 flex justify-end">
        {!checked ? (
          <button
            onClick={handleCheck}
            disabled={!selected}
            className="rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-primary-dark disabled:cursor-not-allowed disabled:opacity-40"
          >
            Verificar
          </button>
        ) : (
          <button
            onClick={handleNext}
            className="rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-primary-dark"
          >
            {index === items.length - 1 ? "Ver resultado" : "Próxima"}
          </button>
        )}
      </div>
    </div>
  );
}
