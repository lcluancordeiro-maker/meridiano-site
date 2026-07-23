"use client";

import { DIFFICULTY_LABELS, DIFFICULTY_ORDER, type Difficulty, type Exercise } from "@/data/curriculum";
import { useTopicProgress } from "@/lib/useTopicProgress";
import { getRecommendedDifficulty } from "@/lib/adaptiveDifficulty";

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
  recommended,
  onSelect,
}: {
  levelId: string;
  topicId: string;
  difficulty: Difficulty;
  count: number;
  recommended: boolean;
  onSelect: (d: Difficulty) => void;
}) {
  const progress = useTopicProgress(levelId, topicId, difficulty);
  const meta = DIFFICULTY_META[difficulty];

  const isRecommended = recommended && count > 0;

  return (
    <button
      onClick={() => onSelect(difficulty)}
      disabled={count === 0}
      // Explicit aria-label so the "Recomendado" badge's text doesn't get
      // folded into the accessible name (which would break every
      // getByRole("button", { name: /^Fácil/ }) style selector across the
      // e2e suite, since the badge span precedes the label in DOM order).
      aria-label={isRecommended ? `${DIFFICULTY_LABELS[difficulty]} (recomendado)` : DIFFICULTY_LABELS[difficulty]}
      className={`relative flex flex-col items-start gap-2 rounded-2xl border-2 p-5 text-left transition-all hover:-translate-y-0.5 hover:shadow-md disabled:cursor-not-allowed disabled:opacity-40 ${meta.border} ${meta.bg}`}
    >
      {isRecommended && (
        <span className="absolute -top-2.5 right-4 rounded-full bg-primary px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white">
          Recomendado
        </span>
      )}
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
  // One hook call per fixed tier (not a loop) so the hook count stays
  // constant across renders, as React's rules of hooks require.
  const facilProgress = useTopicProgress(levelId, topicId, "facil");
  const medioProgress = useTopicProgress(levelId, topicId, "medio");
  const dificilProgress = useTopicProgress(levelId, topicId, "dificil");
  const olimpiadaProgress = useTopicProgress(levelId, topicId, "olimpiada");

  const recommended = getRecommendedDifficulty({
    facil: facilProgress,
    medio: medioProgress,
    dificil: dificilProgress,
    olimpiada: olimpiadaProgress,
  });

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
            recommended={d === recommended}
            onSelect={onSelect}
          />
        ))}
      </div>
    </div>
  );
}
