"use client";

import { DIFFICULTY_LABELS, DIFFICULTY_ORDER, type Difficulty, type Exercise } from "@/data/curriculum";
import { useTopicProgress } from "@/lib/useTopicProgress";

const DIFFICULTY_META: Record<
  Difficulty,
  { icon: string; description: string; border: string; bg: string; text: string }
> = {
  facil: {
    icon: "🌱",
    description: "Aquecimento — conceitos diretos.",
    border: "border-success",
    bg: "bg-success-bg",
    text: "text-success",
  },
  medio: {
    icon: "⚡",
    description: "Aplicação padrão do conteúdo.",
    border: "border-primary",
    bg: "bg-primary/10",
    text: "text-primary",
  },
  dificil: {
    icon: "🔥",
    description: "Combina mais de um passo ou conceito.",
    border: "border-accent",
    bg: "bg-accent/10",
    text: "text-accent",
  },
  olimpiada: {
    icon: "🏅",
    description: "Nível de desafio — exige raciocínio extra.",
    border: "border-amber-500",
    bg: "bg-amber-50",
    text: "text-amber-600",
  },
};

function DifficultyCard({
  levelId,
  topicId,
  difficulty,
  count,
  onSelect,
}: {
  levelId: string;
  topicId: string;
  difficulty: Difficulty;
  count: number;
  onSelect: (d: Difficulty) => void;
}) {
  const progress = useTopicProgress(levelId, topicId, difficulty);
  const meta = DIFFICULTY_META[difficulty];

  return (
    <button
      onClick={() => onSelect(difficulty)}
      disabled={count === 0}
      className={`flex flex-col items-start gap-2 rounded-2xl border-2 p-5 text-left transition-all hover:-translate-y-0.5 hover:shadow-md disabled:cursor-not-allowed disabled:opacity-40 ${meta.border} ${meta.bg}`}
    >
      <div className="flex w-full items-center justify-between">
        <span className="text-2xl" aria-hidden>
          {meta.icon}
        </span>
        {progress?.completed && (
          <span className={`rounded-full bg-white/70 px-2 py-0.5 text-xs font-bold ${meta.text}`}>
            {progress.score}/{progress.total}
          </span>
        )}
      </div>
      <span className={`font-display text-lg font-semibold ${meta.text}`}>
        {DIFFICULTY_LABELS[difficulty]}
      </span>
      <span className="text-xs text-muted">{meta.description}</span>
      <span className="text-xs font-medium text-muted">
        {count} exercício{count === 1 ? "" : "s"}
      </span>
    </button>
  );
}

export default function DifficultyPicker({
  levelId,
  topicId,
  exercises,
  onSelect,
}: {
  levelId: string;
  topicId: string;
  exercises: Exercise[];
  onSelect: (d: Difficulty) => void;
}) {
  return (
    <div>
      <p className="mb-4 text-sm text-muted">
        Escolha o nível de dificuldade para praticar. Você pode repetir ou trocar de nível quando
        quiser.
      </p>
      <div className="grid gap-3 sm:grid-cols-2">
        {DIFFICULTY_ORDER.map((d) => (
          <DifficultyCard
            key={d}
            levelId={levelId}
            topicId={topicId}
            difficulty={d}
            count={exercises.filter((e) => e.difficulty === d).length}
            onSelect={onSelect}
          />
        ))}
      </div>
    </div>
  );
}
