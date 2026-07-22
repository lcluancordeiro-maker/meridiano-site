"use client";

import Link from "next/link";
import { getDueReviews } from "@/lib/reviewSchedule";
import { buildRecommendations, type RecommendationKind } from "@/lib/unifiedRecommendations";
import { useAllProgress } from "@/lib/useAllProgress";
import { useTranslation } from "@/i18n/LanguageContext";

const KIND_STYLE: Record<RecommendationKind, { emoji: string; badgeClass: string }> = {
  revisao: { emoji: "🔁", badgeClass: "bg-warning-bg text-warning" },
  dificuldade: { emoji: "🎯", badgeClass: "bg-primary/10 text-primary" },
  "proximo-topico": { emoji: "🆕", badgeClass: "bg-success-bg text-success" },
};

export default function RecommendedForYou() {
  const { dict } = useTranslation();
  const t = dict.recomendado;
  const allProgress = useAllProgress();
  const dueReviews = getDueReviews();
  const recommendations = buildRecommendations(dueReviews, allProgress, { limit: 5 });

  const kindLabel: Record<RecommendationKind, string> = {
    revisao: t.kindRevisao,
    dificuldade: t.kindDificuldade,
    "proximo-topico": t.kindNovoTopico,
  };

  return (
    <div className="rounded-2xl border border-border bg-surface p-5">
      <h2 className="font-display text-lg font-semibold text-foreground">{t.heading}</h2>
      <p className="mt-1 text-xs text-muted">{t.subtitle}</p>
      {recommendations.length === 0 ? (
        <p className="mt-4 text-sm text-muted">{t.empty}</p>
      ) : (
        <ul className="mt-4 flex flex-col gap-2">
          {recommendations.map((rec) => (
            <li key={`${rec.levelId}/${rec.topicId}/${rec.difficulty}`}>
              <Link
                href={`/trilha/${rec.levelId}/${rec.topicId}`}
                className="flex items-center justify-between gap-3 rounded-xl border border-border px-4 py-3 text-sm transition-colors hover:border-primary"
              >
                <span className="min-w-0">
                  <span className="block truncate font-medium text-foreground">{rec.topicTitle}</span>
                  <span className="text-xs text-muted">{rec.levelName}</span>
                </span>
                <span
                  className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-semibold ${KIND_STYLE[rec.kind].badgeClass}`}
                >
                  {KIND_STYLE[rec.kind].emoji} {kindLabel[rec.kind]}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
