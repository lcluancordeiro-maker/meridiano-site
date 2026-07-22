"use client";

import type { PhotoSolution } from "@/lib/photoSolve";
import { useTranslation } from "@/i18n/LanguageContext";
import { askGauss } from "@/lib/gaussPrompt";

export default function SolutionDisplay({ solution }: { solution: PhotoSolution }) {
  const { dict } = useTranslation();
  const { solution: labels } = dict;

  return (
    <div className="mt-4 flex flex-col gap-4 rounded-xl border border-border bg-surface p-5">
      {solution.enunciado && (
        <div>
          <h2 className="text-xs font-semibold uppercase tracking-wide text-muted">{labels.enunciado}</h2>
          <p className="mt-1 text-foreground">{solution.enunciado}</p>
        </div>
      )}
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
      <button
        type="button"
        onClick={() => askGauss(labels.gaussPromptTemplate.replace("{enunciado}", solution.enunciado))}
        className="self-start rounded-lg border border-border px-4 py-2 text-sm font-semibold text-foreground transition-colors hover:border-primary"
      >
        {labels.askGaussButton}
      </button>
    </div>
  );
}
