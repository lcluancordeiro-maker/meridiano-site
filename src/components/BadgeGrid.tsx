"use client";

import { BADGES } from "@/lib/gamification";
import { useTranslation } from "@/i18n/LanguageContext";
import type { BadgeId } from "@/i18n/dictionaries";

export default function BadgeGrid({ unlockedBadges }: { unlockedBadges: string[] }) {
  const { dict } = useTranslation();

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
      {BADGES.map((badge) => {
        const unlocked = unlockedBadges.includes(badge.id);
        const t = dict.badges[badge.id as BadgeId];
        return (
          <div
            key={badge.id}
            className={`flex flex-col items-center gap-1.5 rounded-xl border p-4 text-center ${
              unlocked ? "border-border bg-surface" : "border-border bg-background opacity-50"
            }`}
          >
            <span className="text-2xl" aria-hidden>
              {unlocked ? badge.icon : "🔒"}
            </span>
            <span className="text-sm font-semibold text-foreground">{t.name}</span>
            <span className="text-xs text-muted">{t.description}</span>
          </div>
        );
      })}
    </div>
  );
}
