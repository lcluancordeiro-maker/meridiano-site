"use client";

import Link from "next/link";
import type { WeakSpot } from "@/lib/weakSpots";
import { useTranslation } from "@/i18n/LanguageContext";

const ACCURACY_THRESHOLD = 0.8;

export default function WeakSpotsCard({ weakSpots }: { weakSpots: WeakSpot[] }) {
  const { dict } = useTranslation();
  const t = dict.progresso;
  const toReview = weakSpots.filter((s) => s.accuracy < ACCURACY_THRESHOLD).slice(0, 5);

  return (
    <div className="rounded-2xl border border-border bg-surface p-5">
      <h2 className="font-display text-lg font-semibold text-foreground">{t.weakSpotsTitle}</h2>
      <p className="mt-1 text-xs text-muted">{t.weakSpotsSubtitle}</p>
      {toReview.length === 0 ? (
        <p className="mt-4 text-sm text-muted">
          {weakSpots.length === 0 ? t.weakSpotsEmptyNoData : t.weakSpotsEmptyAllGood}
        </p>
      ) : (
        <ul className="mt-4 flex flex-col gap-2">
          {toReview.map((spot) => (
            <li key={`${spot.levelId}/${spot.topicId}`}>
              <Link
                href={`/trilha/${spot.levelId}/${spot.topicId}`}
                className="flex items-center justify-between gap-3 rounded-xl border border-border px-4 py-3 text-sm transition-colors hover:border-primary"
              >
                <span className="min-w-0">
                  <span className="block truncate font-medium text-foreground">
                    {spot.topicTitle}
                  </span>
                  <span className="text-xs text-muted">{spot.levelName}</span>
                </span>
                <span className="shrink-0 rounded-full bg-error-bg px-2.5 py-1 text-xs font-semibold text-error">
                  {Math.round(spot.accuracy * 100)}% ({spot.score}/{spot.total})
                </span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
