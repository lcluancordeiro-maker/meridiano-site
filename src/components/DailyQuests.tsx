"use client";

import { useTranslation } from "@/i18n/LanguageContext";
import { useGamification } from "@/lib/useGamification";
import {
  DAILY_QUEST_CORRECT_TARGET,
  DAILY_QUEST_XP_TARGET,
  todayStr,
  type DailyQuestId,
} from "@/lib/gamification";

type QuestView = { id: DailyQuestId; label: string; progress: number; target: number };

export default function DailyQuests() {
  const { dict } = useTranslation();
  const t = dict.dailyQuests;
  const gamification = useGamification();
  const isToday = gamification.dailyQuests.date === todayStr();
  const correctAnswersToday = isToday ? gamification.dailyQuests.correctAnswersToday : 0;
  const perfectScoreToday = isToday && gamification.dailyQuests.perfectScoreToday;
  const claimed = isToday ? gamification.dailyQuests.claimed : [];
  const xpToday = gamification.xpLog[todayStr()] ?? 0;

  const quests: QuestView[] = [
    {
      id: "xp30",
      label: t.questXp.replace("{target}", String(DAILY_QUEST_XP_TARGET)),
      progress: Math.min(xpToday, DAILY_QUEST_XP_TARGET),
      target: DAILY_QUEST_XP_TARGET,
    },
    {
      id: "correct5",
      label: t.questCorrect.replace("{target}", String(DAILY_QUEST_CORRECT_TARGET)),
      progress: Math.min(correctAnswersToday, DAILY_QUEST_CORRECT_TARGET),
      target: DAILY_QUEST_CORRECT_TARGET,
    },
    {
      id: "perfectScore",
      label: t.questPerfect,
      progress: perfectScoreToday ? 1 : 0,
      target: 1,
    },
  ];

  return (
    <section className="border-b border-border bg-surface">
      <div className="mx-auto w-full max-w-5xl px-6 py-8">
        <span className="rounded-full bg-primary/10 px-3 py-1 font-display text-xs font-semibold uppercase tracking-wide text-primary">
          {t.title}
        </span>
        <p className="mt-2 max-w-xl text-sm text-muted">{t.subtitle}</p>
        <ul className="mt-4 flex flex-col gap-3 sm:flex-row sm:gap-4">
          {quests.map((quest) => {
            const done = claimed.includes(quest.id);
            return (
              <li
                key={quest.id}
                className="flex-1 rounded-xl border border-border bg-background p-4"
                data-testid="daily-quest"
                data-quest-done={done}
              >
                <p className={`text-sm font-medium ${done ? "text-success" : "text-foreground"}`}>
                  {done ? "✓ " : ""}
                  {quest.label}
                </p>
                <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-border">
                  <div
                    className={`h-full rounded-full transition-all ${done ? "bg-success" : "bg-primary"}`}
                    style={{ width: `${Math.min(100, (quest.progress / quest.target) * 100)}%` }}
                  />
                </div>
                <p className="mt-1 text-xs text-muted">
                  {quest.progress}/{quest.target}
                </p>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
