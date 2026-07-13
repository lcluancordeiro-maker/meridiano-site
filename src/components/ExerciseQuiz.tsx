"use client";

import { useState } from "react";
import type { Exercise } from "@/data/curriculum";
import { saveTopicProgress } from "@/lib/progress";
import ProgressBar from "./ProgressBar";

function normalize(value: string): string {
  return value.trim().toLowerCase().replace(/\s+/g, "");
}

export default function ExerciseQuiz({
  levelId,
  topicId,
  exercises,
}: {
  levelId: string;
  topicId: string;
  exercises: Exercise[];
}) {
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState("");
  const [checked, setChecked] = useState(false);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);

  const exercise = exercises[index];
  const isCorrect = checked && normalize(selected) === normalize(exercise.answer);

  function handleCheck() {
    if (!selected) return;
    setChecked(true);
    if (normalize(selected) === normalize(exercise.answer)) {
      setScore((s) => s + 1);
    }
  }

  function handleNext() {
    const isLast = index === exercises.length - 1;
    if (isLast) {
      saveTopicProgress(levelId, topicId, score, exercises.length);
      setFinished(true);
      return;
    }
    setIndex((i) => i + 1);
    setSelected("");
    setChecked(false);
  }

  function handleRestart() {
    setIndex(0);
    setSelected("");
    setChecked(false);
    setScore(0);
    setFinished(false);
  }

  if (finished) {
    const pct = Math.round((score / exercises.length) * 100);
    return (
      <div className="rounded-2xl border border-border bg-surface p-8 text-center">
        <p className="font-display text-sm font-semibold uppercase tracking-wide text-primary">
          Resultado
        </p>
        <h3 className="mt-2 font-display text-3xl font-semibold text-foreground">
          {score} de {exercises.length} ({pct}%)
        </h3>
        <p className="mt-3 text-muted">
          {pct >= 70
            ? "Muito bem! Você domina esse tópico."
            : "Bom começo — revise a teoria e tente de novo para fixar o conteúdo."}
        </p>
        <button
          onClick={handleRestart}
          className="mt-6 rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-primary-dark"
        >
          Tentar novamente
        </button>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-border bg-surface p-6 sm:p-8">
      <div className="flex items-center justify-between text-xs font-medium text-muted">
        <span>
          Questão {index + 1} de {exercises.length}
        </span>
        <span>{score} acertos</span>
      </div>
      <div className="mt-3">
        <ProgressBar value={index / exercises.length} />
      </div>

      <p className="mt-6 font-display text-lg font-medium text-foreground">
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
        <input
          type="text"
          inputMode="text"
          disabled={checked}
          value={selected}
          onChange={(e) => setSelected(e.target.value)}
          placeholder="Digite sua resposta"
          className={`mt-5 w-full rounded-xl border px-4 py-3 text-sm font-medium outline-none transition-colors ${
            checked
              ? isCorrect
                ? "border-success bg-success-bg text-success"
                : "border-error bg-error-bg text-error"
              : "border-border text-foreground focus:border-primary"
          }`}
        />
      )}

      {checked && (
        <div
          className={`mt-4 rounded-xl p-4 text-sm leading-relaxed ${
            isCorrect ? "bg-success-bg text-success" : "bg-error-bg text-error"
          }`}
        >
          <p className="font-semibold">
            {isCorrect ? "Certinho!" : `Resposta correta: ${exercise.answer}`}
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
            {index === exercises.length - 1 ? "Ver resultado" : "Próxima"}
          </button>
        )}
      </div>
    </div>
  );
}
