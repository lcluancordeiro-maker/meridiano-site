"use client";

import { useState } from "react";
import type { PhotoSolution } from "@/lib/photoSolve";
import { useTranslation } from "@/i18n/LanguageContext";
import { askGauss } from "@/lib/gaussPrompt";
import { checkPhotoAnswer } from "@/lib/answerMatch";

export default function SolutionDisplay({
  solution,
  onPracticeSimilar,
  isGeneratingSimilar,
}: {
  solution: PhotoSolution;
  onPracticeSimilar?: () => void;
  isGeneratingSimilar?: boolean;
}) {
  const { dict } = useTranslation();
  const { solution: labels } = dict;

  // A problem with no resposta (e.g. the photo didn't have a legible
  // exercise) has nothing to check the student's answer against — skip the
  // interactive quiz step and show the full solution right away.
  const isInteractive = Boolean(solution.resposta && solution.enunciado);
  const [answer, setAnswer] = useState("");
  const [attempts, setAttempts] = useState(0);
  const [revealed, setRevealed] = useState(!isInteractive);
  const [correct, setCorrect] = useState(false);

  function handleCheck() {
    if (!answer.trim()) return;

    if (checkPhotoAnswer(answer, solution.resposta)) {
      setCorrect(true);
      setRevealed(true);
      return;
    }

    const nextAttempts = attempts + 1;
    setAttempts(nextAttempts);
    if (nextAttempts >= 2) {
      setRevealed(true);
    } else {
      setAnswer("");
    }
  }

  return (
    <div className="mt-4 flex flex-col gap-4 rounded-xl border border-border bg-surface p-5">
      {solution.enunciado && (
        <div>
          <h2 className="text-xs font-semibold uppercase tracking-wide text-muted">{labels.enunciado}</h2>
          <p className="mt-1 text-foreground">{solution.enunciado}</p>
        </div>
      )}

      {isInteractive && !revealed && (
        <div className="flex flex-col gap-3">
          <div className="flex gap-2">
            <input
              type="text"
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleCheck();
              }}
              placeholder={labels.answerPlaceholder}
              className="w-full rounded-xl border border-border px-4 py-3 text-sm font-medium text-foreground outline-none focus:border-primary"
            />
            <button
              type="button"
              onClick={handleCheck}
              disabled={!answer.trim()}
              className="shrink-0 rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-primary-dark disabled:cursor-not-allowed disabled:opacity-40"
            >
              {labels.checkButton}
            </button>
          </div>
          {attempts > 0 && (
            <p className="rounded-xl bg-warning-bg p-3 text-sm text-warning">{labels.tryAgainFeedback}</p>
          )}
          <button
            type="button"
            onClick={() => setRevealed(true)}
            className="self-start text-sm font-semibold text-primary hover:underline"
          >
            {labels.showSolutionButton}
          </button>
        </div>
      )}

      {isInteractive && revealed && (correct || attempts > 0) && (
        <p
          className={`rounded-xl p-3 text-sm font-semibold ${
            correct ? "bg-success-bg text-success" : "bg-error-bg text-error"
          }`}
        >
          {correct ? labels.correctFeedback : labels.incorrectFeedback}
        </p>
      )}

      {revealed && (
        <>
          <div>
            <h2 className="text-xs font-semibold uppercase tracking-wide text-muted">{labels.passoAPasso}</h2>
            <ol className="mt-2 flex flex-col gap-2">
              {solution.passos.map((passo, i) => (
                <li key={i} className="flex gap-3 text-sm text-foreground">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
                    {i + 1}
                  </span>
                  <span className="pt-0.5">{passo}</span>
                </li>
              ))}
            </ol>
          </div>
          {solution.resposta && (
            <div>
              <h2 className="text-xs font-semibold uppercase tracking-wide text-muted">{labels.resposta}</h2>
              <p className="mt-1 font-semibold text-foreground">{solution.resposta}</p>
            </div>
          )}
        </>
      )}

      <div className="flex flex-wrap gap-3">
        <button
          type="button"
          onClick={() => askGauss(labels.gaussPromptTemplate.replace("{enunciado}", solution.enunciado))}
          className="self-start rounded-lg border border-border px-4 py-2 text-sm font-semibold text-foreground transition-colors hover:border-primary"
        >
          {labels.askGaussButton}
        </button>

        {revealed && onPracticeSimilar && (
          <button
            type="button"
            onClick={onPracticeSimilar}
            disabled={isGeneratingSimilar}
            className="self-start rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-primary-dark disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isGeneratingSimilar ? labels.generatingSimilar : labels.practiceSimilarButton}
          </button>
        )}
      </div>
    </div>
  );
}
