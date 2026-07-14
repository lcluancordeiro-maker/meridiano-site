"use client";

import Link from "next/link";
import { DIFFICULTY_LABELS, DIFFICULTY_ORDER, type Topic } from "@/data/curriculum";
import { useTopicProgress } from "@/lib/useTopicProgress";

type NodeStatus = "concluído" | "em progresso" | "não iniciado";

function statusOf(completedTiers: number): NodeStatus {
  if (completedTiers === DIFFICULTY_ORDER.length) return "concluído";
  if (completedTiers > 0) return "em progresso";
  return "não iniciado";
}

/** One stop on the trail: a numbered node (✓ when every difficulty tier is
 * complete) connected to the next stop by a vertical line that turns green
 * as the student progresses, plus the topic card itself. Progress comes
 * from the same localStorage store the quiz writes to, so the map updates
 * live as quizzes are finished. */
function SkillPathNode({
  levelId,
  topic,
  index,
  isLast,
}: {
  levelId: string;
  topic: Topic;
  index: number;
  isLast: boolean;
}) {
  const facil = useTopicProgress(levelId, topic.id, "facil");
  const medio = useTopicProgress(levelId, topic.id, "medio");
  const dificil = useTopicProgress(levelId, topic.id, "dificil");
  const olimpiada = useTopicProgress(levelId, topic.id, "olimpiada");
  const tiers = [facil, medio, dificil, olimpiada];
  const completedTiers = tiers.filter((p) => p?.completed).length;
  const status = statusOf(completedTiers);
  const done = status === "concluído";
  const started = status === "em progresso";

  return (
    <li className="relative flex gap-4 sm:gap-5">
      <div className="flex flex-col items-center">
        <span
          data-testid="skill-node"
          aria-label={`${topic.title}: ${status}`}
          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-2 font-display text-sm font-semibold ${
            done
              ? "border-success bg-success text-white"
              : started
              ? "border-primary bg-primary/10 text-primary"
              : "border-border bg-surface text-muted"
          }`}
        >
          {done ? "✓" : index + 1}
        </span>
        {!isLast && (
          <span aria-hidden className={`w-0.5 flex-1 ${done ? "bg-success" : "bg-border"}`} />
        )}
      </div>

      <Link
        href={`/trilha/${levelId}/${topic.id}`}
        className="group mb-6 flex flex-1 flex-col gap-2 rounded-2xl border border-border bg-surface p-5 transition-all hover:-translate-y-0.5 hover:border-primary hover:shadow-lg hover:shadow-primary/10"
      >
        <h3 className="font-display text-lg font-semibold text-foreground">{topic.title}</h3>
        <p className="text-sm leading-relaxed text-muted">{topic.summary}</p>
        <div className="mt-1 flex items-center justify-between text-xs text-muted">
          <span>~{topic.minutes} min</span>
          <div className="flex items-center gap-2">
            <span>
              {completedTiers}/{DIFFICULTY_ORDER.length} níveis
            </span>
            <div className="flex gap-1">
              {DIFFICULTY_ORDER.map((d, i) => (
                <span
                  key={d}
                  title={DIFFICULTY_LABELS[d]}
                  className={`h-2 w-2 rounded-full ${
                    tiers[i]?.completed ? "bg-success" : "bg-border"
                  }`}
                  aria-hidden
                />
              ))}
            </div>
          </div>
        </div>
      </Link>
    </li>
  );
}

export default function SkillPath({ levelId, topics }: { levelId: string; topics: Topic[] }) {
  return (
    <ol className="mt-10 flex flex-col">
      {topics.map((topic, i) => (
        <SkillPathNode
          key={topic.id}
          levelId={levelId}
          topic={topic}
          index={i}
          isLast={i === topics.length - 1}
        />
      ))}
    </ol>
  );
}
