"use client";

import Link from "next/link";
import type { Topic } from "@/data/curriculum";
import { useTopicProgress } from "@/lib/useTopicProgress";
import ProgressBar from "./ProgressBar";

export default function TopicCard({
  levelId,
  topic,
}: {
  levelId: string;
  topic: Topic;
}) {
  const progress = useTopicProgress(levelId, topic.id);

  const ratio = progress ? progress.score / progress.total : 0;

  return (
    <Link
      href={`/trilha/${levelId}/${topic.id}`}
      className="group flex flex-col gap-4 rounded-2xl border border-border bg-surface p-6 transition-all hover:-translate-y-1 hover:border-primary hover:shadow-lg hover:shadow-primary/10"
    >
      <div className="flex items-start justify-between gap-4">
        <h3 className="font-display text-lg font-semibold text-foreground">
          {topic.title}
        </h3>
        {progress?.completed && (
          <span className="shrink-0 rounded-full bg-success-bg px-2.5 py-1 text-xs font-semibold text-success">
            Concluído
          </span>
        )}
      </div>
      <p className="text-sm leading-relaxed text-muted">{topic.summary}</p>
      <div className="mt-auto flex flex-col gap-2">
        <ProgressBar value={progress ? ratio : 0} />
        <div className="flex items-center justify-between text-xs text-muted">
          <span>~{topic.minutes} min</span>
          <span>
            {progress
              ? `${progress.score}/${progress.total} acertos`
              : `${topic.exercises.length} exercícios`}
          </span>
        </div>
      </div>
    </Link>
  );
}
