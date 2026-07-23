"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import type { Topic } from "@/data/curriculum";
import { DIFFICULTY_LABELS } from "@/data/curriculum";
import { buildDiagnosticQuestions, computePlacement, type DiagnosticAnswer } from "@/lib/diagnostic";

function normalize(value: string): string {
  return value.trim().toLowerCase().replace(/\s+/g, "");
}

// Hardcoded Portuguese, matching how other newly-added interactive controls
// in this app ship before full 15-locale i18n (e.g. ReportContentButton.tsx) —
// /diagnostico is a short, one-off assessment, not part of the always-visible
// navigation chrome that's fully translated.
export default function DiagnosticQuiz({
  levelId,
  levelName,
  topics,
}: {
  levelId: string;
  levelName: string;
  topics: Topic[];
}) {
  const questions = useMemo(() => buildDiagnosticQuestions(topics), [topics]);
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState("");
  const [checked, setChecked] = useState(false);
  const [answers, setAnswers] = useState<DiagnosticAnswer[]>([]);

  const isLast = index === questions.length - 1;

  function handleCheck() {
    const question = questions[index];
    if (!selected || checked || !question) return;
    setChecked(true);
    setAnswers((prev) => [
      ...prev,
      { topicId: question.topicId, difficulty: question.difficulty, correct: normalize(selected) === normalize(question.answer) },
    ]);
  }

  function handleNext() {
    setIndex((i) => i + 1);
    setSelected("");
    setChecked(false);
  }

  if (index >= questions.length) {
    const placement = computePlacement(topics, answers);
    const score = answers.filter((a) => a.correct).length;
    return (
      <div className="rounded-2xl border border-border bg-surface p-6">
        <p className="font-display text-lg font-semibold text-foreground">Resultado do teste</p>
        <p className="mt-1 text-sm text-muted">
          Você acertou {score} de {answers.length} perguntas.
        </p>
        <div className="mt-4 rounded-xl border border-primary/30 bg-primary/10 p-4">
          <p className="text-sm text-foreground">
            Recomendamos começar por <strong>{placement.topicTitle}</strong>, no nível{" "}
            <strong>{DIFFICULTY_LABELS[placement.difficulty]}</strong>.
          </p>
          <Link
            href={`/trilha/${levelId}/${placement.topicId}`}
            className="mt-3 inline-block rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primary-dark"
          >
            Começar por aqui
          </Link>
        </div>
        <Link href={`/trilha/${levelId}`} className="mt-4 inline-block text-sm text-primary hover:underline">
          Ver a trilha completa
        </Link>
      </div>
    );
  }

  const question = questions[index];
  const isCorrect = checked && normalize(selected) === normalize(question.answer);

  return (
    <div className="rounded-2xl border border-border bg-surface p-6">
      <p className="text-xs font-semibold uppercase tracking-wide text-muted">
        {levelName} — pergunta {index + 1} de {questions.length}
      </p>
      <p className="mt-2 text-xs text-muted">
        {question.topicTitle} · {DIFFICULTY_LABELS[question.difficulty]}
      </p>
      <p className="mt-3 whitespace-pre-line text-base text-foreground">{question.prompt}</p>

      {question.type === "multiple-choice" && question.options ? (
        <div className="mt-4 flex flex-col gap-2">
          {question.options.map((option) => (
            <button
              key={option}
              type="button"
              disabled={checked}
              onClick={() => setSelected(option)}
              className={`rounded-lg border px-4 py-2 text-left text-sm transition-colors ${
                selected === option ? "border-primary text-primary" : "border-border text-foreground"
              } ${checked ? "cursor-not-allowed opacity-70" : "hover:border-primary"}`}
            >
              {option}
            </button>
          ))}
        </div>
      ) : (
        <input
          type="text"
          value={selected}
          disabled={checked}
          onChange={(e) => setSelected(e.target.value)}
          placeholder="Digite sua resposta"
          className="mt-4 w-full rounded-lg border border-border bg-background px-4 py-2 text-sm text-foreground"
        />
      )}

      {checked && (
        <p className={`mt-3 text-sm font-medium ${isCorrect ? "text-success" : "text-error"}`}>
          {isCorrect ? "Certinho!" : `Resposta certa: ${question.answer}`}
        </p>
      )}

      <div className="mt-4">
        {!checked ? (
          <button
            type="button"
            onClick={handleCheck}
            disabled={!selected}
            className="rounded-lg bg-primary px-6 py-2 text-sm font-semibold text-white transition-colors hover:bg-primary-dark disabled:cursor-not-allowed disabled:opacity-50"
          >
            Verificar
          </button>
        ) : (
          <button
            type="button"
            onClick={handleNext}
            className="rounded-lg bg-primary px-6 py-2 text-sm font-semibold text-white transition-colors hover:bg-primary-dark"
          >
            {isLast ? "Ver resultado" : "Próxima"}
          </button>
        )}
      </div>
    </div>
  );
}
