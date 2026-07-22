"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { DIFFICULTY_LABELS } from "@/data/curriculum";
import { getAllProgressSnapshot, subscribeProgress } from "@/lib/progress";
import {
  buildStudyPlan,
  nextStudyPlanItem,
  studyPlanProgress,
  type StudyPlanGoal,
  type StudyPlanWeek,
} from "@/lib/studyPlan";
import ProgressBar from "./ProgressBar";

function computeDoneKeys(levelId: string): Set<string> {
  const snapshot = getAllProgressSnapshot();
  const prefix = `${levelId}/`;
  const keys = new Set<string>();
  for (const [key, value] of Object.entries(snapshot)) {
    if (key.startsWith(prefix) && value.completed) {
      keys.add(key.slice(prefix.length));
    }
  }
  return keys;
}

export default function StudyPlanView({
  goal,
  topics,
}: {
  goal: StudyPlanGoal;
  topics: { id: string; title: string }[];
}) {
  const [doneKeys, setDoneKeys] = useState<Set<string>>(() => computeDoneKeys(goal.levelId));

  useEffect(() => {
    return subscribeProgress(() => setDoneKeys(computeDoneKeys(goal.levelId)));
  }, [goal.levelId]);

  const weeks: StudyPlanWeek[] = buildStudyPlan(goal, topics, doneKeys);
  const progress = studyPlanProgress(weeks);
  const next = nextStudyPlanItem(weeks);

  return (
    <div>
      <div className="rounded-2xl border border-border bg-surface p-5">
        <div className="flex items-center justify-between text-sm font-semibold text-foreground">
          <span>Progresso do plano</span>
          <span>{Math.round(progress * 100)}%</span>
        </div>
        <div className="mt-2">
          <ProgressBar value={progress} />
        </div>
        {next ? (
          <Link
            href={`/trilha/${goal.levelId}/${next.topicId}`}
            className="mt-4 inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-primary-dark"
          >
            Continuar: {next.topicTitle} ({DIFFICULTY_LABELS[next.difficulty]})
          </Link>
        ) : (
          <p className="mt-4 text-sm font-semibold text-success">
            Plano completo — parabéns! 🎉
          </p>
        )}
      </div>

      <ol className="mt-8 flex flex-col gap-4">
        {weeks.map((week) => (
          <li key={week.weekNumber} className="rounded-2xl border border-border bg-surface p-5">
            <p className="font-display text-sm font-semibold text-foreground">
              Semana {week.weekNumber}
            </p>
            <ul className="mt-3 flex flex-col gap-2">
              {week.items.map((item, i) => (
                <li key={`${item.topicId}-${item.difficulty}-${i}`}>
                  <Link
                    href={`/trilha/${goal.levelId}/${item.topicId}`}
                    className={`flex items-center justify-between rounded-xl px-3 py-2 text-sm transition-colors ${
                      item.done
                        ? "text-muted line-through"
                        : "text-foreground hover:bg-background"
                    }`}
                  >
                    <span>
                      {item.topicTitle}
                      <span className="ml-2 text-xs text-muted">
                        {DIFFICULTY_LABELS[item.difficulty]}
                      </span>
                    </span>
                    <span>{item.done ? "✅" : "○"}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ol>
    </div>
  );
}
