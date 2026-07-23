"use client";

import { useMemo } from "react";
import { getTopicsForLevel } from "@/data/curriculum";
import { useChapterCompletion } from "@/lib/useChapterCompletion";
import ProgressBar from "./ProgressBar";

/** Thin progress bar on a level card — reuses useChapterCompletion (levelId
 * + a list of topic ids → completed/total tiers) with the level's own full
 * topic list, so "chapter" here just means "the whole level". Hidden until
 * the student has actually started the track, same convention as
 * NavbarXpBadge staying hidden at zero XP. */
export default function LevelCardProgress({
  levelId,
  progressLabel,
}: {
  levelId: string;
  progressLabel: string;
}) {
  const topicIds = useMemo(() => getTopicsForLevel(levelId).map((t) => t.id), [levelId]);
  const { completed, total } = useChapterCompletion(levelId, topicIds);

  if (completed === 0) return null;

  const pct = Math.round((completed / total) * 100);

  return (
    <div className="mt-4">
      <div className="flex items-center justify-between text-xs text-muted">
        <span>{progressLabel}</span>
        <span>{pct}%</span>
      </div>
      <div className="mt-1">
        <ProgressBar value={completed / total} />
      </div>
    </div>
  );
}
