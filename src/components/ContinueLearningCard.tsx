"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getLevel, getTopic } from "@/data/curriculum";
import { getMostRecentTopic, subscribeProgress } from "@/lib/progress";

type Target = { levelName: string; topicTitle: string; href: string } | null;

function computeTarget(): Target {
  const recent = getMostRecentTopic();
  if (!recent) return null;
  const level = getLevel(recent.levelId);
  const topic = getTopic(recent.levelId, recent.topicId);
  if (!level || !topic) return null;
  return {
    levelName: level.name,
    topicTitle: topic.title,
    href: `/trilha/${recent.levelId}/${recent.topicId}`,
  };
}

/** Highlighted card pointing back at the last topic the student touched —
 * "Continue de onde parou", Brilliant.org-style. Renders nothing for a
 * first-time visitor (no progress yet). The initial value comes from a
 * lazy useState initializer (computed once, during render — not synced
 * from an effect); the effect below only subscribes to later progress
 * changes, matching the pattern in useChapterCompletion.ts. */
export default function ContinueLearningCard({
  label,
  cta,
}: {
  label: string;
  cta: string;
}) {
  const [target, setTarget] = useState<Target>(() => computeTarget());

  useEffect(() => {
    return subscribeProgress(() => setTarget(computeTarget()));
  }, []);

  if (!target) return null;

  return (
    <Link
      href={target.href}
      data-testid="continue-learning-card"
      className="group flex w-full max-w-md items-center justify-between gap-4 rounded-2xl border border-primary/30 bg-primary/5 p-5 transition-all hover:-translate-y-0.5 hover:border-primary hover:shadow-lg hover:shadow-primary/10"
    >
      <div>
        <p className="text-xs font-semibold uppercase tracking-wide text-primary">{label}</p>
        <p className="mt-1 font-display text-lg font-semibold text-foreground">{target.topicTitle}</p>
        <p className="text-sm text-muted">{target.levelName}</p>
      </div>
      <span className="flex shrink-0 items-center gap-1 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white transition-colors group-hover:bg-primary-dark">
        {cta}
        <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          <path d="M5 12h14M13 6l6 6-6 6" />
        </svg>
      </span>
    </Link>
  );
}
