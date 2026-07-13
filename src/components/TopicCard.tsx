"use client";

import Link from "next/link";
import { DIFFICULTY_ORDER, type Topic } from "@/data/curriculum";
import { useTopicProgress } from "@/lib/useTopicProgress";

function TierDot({
  levelId,
  topicId,
  difficulty,
}: {
  levelId: string;
  topicId: string;
  difficulty: (typeof DIFFICULTY_ORDER)[number];
}) {
  const progress = useTopicProgress(levelId, topicId, difficulty);
  return (
    <span
      title={difficulty}
      className={`h-2 w-2 rounded-full ${progress?.completed ? "bg-success" : "bg-border"}`}
      aria-hidden
    />
  );
}

export default function TopicCard({
  levelId,
  topic,
}: {
  levelId: string;
  topic: Topic;
}) {
  return (
    <Link
      href={`/trilha/${levelId}/${topic.id}`}
      className="group flex flex-col gap-4 rounded-2xl border border-border bg-surface p-6 transition-all hover:-translate-y-1 hover:border-primary hover:shadow-lg hover:shadow-primary/10"
    >
      <div className="flex items-start justify-between gap-4">
        <h3 className="font-display text-lg font-semibold text-foreground">
          {topic.title}
        </h3>
      </div>
      <p className="text-sm leading-relaxed text-muted">{topic.summary}</p>
      <div className="mt-auto flex items-center justify-between text-xs text-muted">
        <span>~{topic.minutes} min</span>
        <div className="flex items-center gap-2">
          <span>Níveis:</span>
          <div className="flex gap-1">
            {DIFFICULTY_ORDER.map((d) => (
              <TierDot key={d} levelId={levelId} topicId={topic.id} difficulty={d} />
            ))}
          </div>
        </div>
      </div>
    </Link>
  );
}
