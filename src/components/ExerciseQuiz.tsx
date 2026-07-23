"use client";

import { useState } from "react";
import type { Difficulty, Exercise } from "@/data/curriculum";
import { saveTopicProgress } from "@/lib/progress";
import {
  BADGES,
  DIFFICULTY_XP,
  getGamificationSnapshot,
  recordCorrectAnswer,
  recordTopicCompletion,
} from "@/lib/gamification";
import { recordReviewResult } from "@/lib/reviewSchedule";
import { trackFirstTimeEvent } from "@/lib/analytics/trackEvent";
import { extractSpokenNumber, matchSpokenOption } from "@/lib/voiceMatching";
import GuidedSteps from "./GuidedSteps";
import ProgressBar from "./ProgressBar";
import VoiceInputButton from "./VoiceInputButton";
import ReportContentButton from "./ReportContentButton";

function normalize(value: string): string {
  return value.trim().toLowerCase().replace(/\s+/g, "");
}

export default function ExerciseQuiz({
  levelId,
  topicId,
  difficulty,
  exercises,
}: {
  levelId: string;
  topicId: string;
  difficulty: Difficulty;
  exercises: Exercise[];
}) {
  const xpPerCorrect = DIFFICULTY_XP[difficulty];
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState("");
  const [checked, setChecked] = useState(false);
  const [hintActive, setHintActive] = useState(false);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);
  const [newBadges, setNewBadges] = useState<string[]>([]);
  const [methodIndex, setMethodIndex] = useState(0);

  const exercise = exercises[index];
  const isCorrect = checked && normalize(selected) === normalize(exercise.answer);
  const activeExplanation =
    methodIndex === 0 ? exercise.explanation : exercise.alternativeSolutions?.[methodIndex - 1]?.explanation ?? exercise.explanation;

  function handleCheck() {
    if (!selected) return;

    if (normalize(selected) === normalize(exercise.answer)) {
      setChecked(true);
      setScore((s) => s + 1);
      recordCorrectAnswer(difficulty);
      recordReviewResult(levelId, topicId, difficulty, exercise.id, true);
      return;
    }

    // Wrong answer: give a nudge on the first miss (if this exercise has
    // one) instead of revealing the answer outright — only lock in and
    // reveal on a second miss.
    if (exercise.commonMistakeHint && !hintActive) {
      setHintActive(true);
      setSelected("");
      return;
    }

    setChecked(true);
    recordReviewResult(levelId, topicId, difficulty, exercise.id, false);
  }

  function handleNext() {
    const isLast = index === exercises.length - 1;
    if (isLast) {
      saveTopicProgress(levelId, topicId, difficulty, score, exercises.length);
      const badgesBefore = getGamificationSnapshot().unlockedBadges;
      recordTopicCompletion(levelId, topicId, difficulty, score, exercises.length);
      const badgesAfter = getGamificationSnapshot().unlockedBadges;
      setNewBadges(badgesAfter.filter((id) => !badgesBefore.includes(id)));
      setFinished(true);
      trackFirstTimeEvent("exercicio_concluido", { levelId, topicId, difficulty });
      return;
    }
    setIndex((i) => i + 1);
    setSelected("");
    setChecked(false);
    setHintActive(false);
    setMethodIndex(0);
  }

  function handleRestart() {
    setIndex(0);
    setSelected("");
    setChecked(false);
    setHintActive(false);
    setScore(0);
    setFinished(false);
    setNewBadges([]);
    setMethodIndex(0);
  }

  if (finished) {
    const pct = Math.round((score / exercises.length) * 100);
    return (
      <div className="animate-pop-in rounded-2xl border border-border bg-surface p-8 text-center">
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
        <p className="animate-xp-pop mt-4 inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-sm font-semibold text-primary">
          +{score * xpPerCorrect} XP nesta tentativa
        </p>
        {newBadges.length > 0 && (
          <div className="mt-6 flex flex-col items-center gap-2">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted">
              Nova conquista{newBadges.length > 1 ? "s" : ""}!
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              {newBadges.map((id) => {
                const badge = BADGES.find((b) => b.id === id);
                if (!badge) return null;
                return (
                  <div
                    key={id}
                    className="animate-rise-in flex items-center gap-2 rounded-xl border border-border bg-background px-3 py-2 text-left"
                  >
                    <span className="text-xl">{badge.icon}</span>
                    <span>
                      <span className="block text-sm font-semibold text-foreground">
                        {badge.name}
                      </span>
                      <span className="block text-xs text-muted">{badge.description}</span>
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}
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

      <p className="mt-6 whitespace-pre-line font-display text-lg font-medium text-foreground">
        {exercise.prompt}
      </p>

      {exercise.steps && !checked && <GuidedSteps key={exercise.id} steps={exercise.steps} />}

      {exercise.type === "multiple-choice" ? (
        <div className="mt-5 flex flex-col gap-3">
          {!checked && (
            <VoiceInputButton
              locale="pt-BR"
              label="Falar resposta"
              listeningLabel="Ouvindo..."
              className="self-start rounded-lg border border-border px-3 py-2 text-xs font-medium text-muted transition-colors hover:border-primary hover:text-foreground"
              onResult={(transcript) => {
                const match = matchSpokenOption(transcript, exercise.options ?? []);
                if (match) setSelected(match);
              }}
            />
          )}
          <div className="grid gap-3 sm:grid-cols-2">
          {exercise.options?.map((option) => {
            const isSelected = selected === option;
            const showCorrect = checked && normalize(option) === normalize(exercise.answer);
            const showWrong = checked && isSelected && !showCorrect;
            return (
              <button
                key={option}
                disabled={checked}
                onClick={() => setSelected(option)}
                className={`rounded-xl border px-4 py-3 text-left text-sm font-medium transition-all enabled:active:scale-[0.98] ${
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
        </div>
      ) : (
        <div className="mt-5 flex gap-2">
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
        {!checked && (
          <VoiceInputButton
            locale="pt-BR"
            label="Falar resposta"
            listeningLabel="Ouvindo..."
            onResult={(transcript) => setSelected(extractSpokenNumber(transcript))}
          />
        )}
        </div>
      )}

      {hintActive && !checked && (
        <div className="animate-rise-in mt-4 rounded-xl bg-warning-bg p-4 text-sm leading-relaxed text-warning">
          <p className="font-semibold">Quase lá! Dica:</p>
          <p className="mt-1 text-foreground/80">{exercise.commonMistakeHint}</p>
        </div>
      )}

      {checked && (
        <div
          className={`animate-rise-in mt-4 rounded-xl p-4 text-sm leading-relaxed ${
            isCorrect ? "bg-success-bg text-success" : "bg-error-bg text-error"
          }`}
        >
          <p className="flex items-center gap-2 font-semibold">
            {isCorrect ? "Certinho!" : `Resposta correta: ${exercise.answer}`}
            {isCorrect && (
              <span className="animate-xp-pop rounded-full bg-white/60 px-2 py-0.5 text-xs font-bold text-success">
                +{xpPerCorrect} XP
              </span>
            )}
          </p>
          <p className="mt-1 text-foreground/80">{activeExplanation}</p>
        </div>
      )}

      {checked && exercise.alternativeSolutions && exercise.alternativeSolutions.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-2">
          <button
            onClick={() => setMethodIndex(0)}
            className={`rounded-full border px-3 py-1 text-xs font-medium transition-colors ${
              methodIndex === 0
                ? "border-primary bg-primary/10 text-primary"
                : "border-border text-muted hover:border-primary/50"
            }`}
          >
            Método padrão
          </button>
          {exercise.alternativeSolutions.map((alt, i) => (
            <button
              key={alt.label}
              onClick={() => setMethodIndex(i + 1)}
              className={`rounded-full border px-3 py-1 text-xs font-medium transition-colors ${
                methodIndex === i + 1
                  ? "border-primary bg-primary/10 text-primary"
                  : "border-border text-muted hover:border-primary/50"
              }`}
            >
              {alt.label}
            </button>
          ))}
        </div>
      )}

      {checked && (
        <div className="mt-3">
          <ReportContentButton
            source="exercicio"
            levelId={levelId}
            topicId={topicId}
            exerciseId={exercise.id}
            difficulty={difficulty}
          />
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
