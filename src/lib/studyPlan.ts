import { DIFFICULTY_ORDER, levels, type Difficulty } from "@/data/curriculum";

export type StudyPlanGoal = {
  id: string;
  levelId: string;
  label: string;
  weeks: number;
};

/** One goal per available vestibular track, all at a flat 8-week pace —
 * simple pilot scope. Premium tracks stay listed (badged in the UI); the
 * plan is just a reading list of links, and each link already hits the
 * normal topic-page paywall, so there's nothing extra to gate here. */
export const STUDY_PLAN_GOALS: StudyPlanGoal[] = levels
  .filter((level) => level.group === "vestibulares" && level.available)
  .map((level) => ({
    id: `${level.id}-8`,
    levelId: level.id,
    label: `${level.shortName} em 8 semanas`,
    weeks: 8,
  }));

export function getStudyPlanGoal(goalId: string): StudyPlanGoal | undefined {
  return STUDY_PLAN_GOALS.find((g) => g.id === goalId);
}

export type StudyPlanItem = {
  topicId: string;
  topicTitle: string;
  difficulty: Difficulty;
  done: boolean;
};

export type StudyPlanWeek = {
  weekNumber: number;
  items: StudyPlanItem[];
};

/** Pure: spreads every (topic × difficulty) practice item evenly across
 * the goal's weeks, in curriculum + difficulty order — e.g. a 3-topic
 * track has 12 items (3 topics × 4 tiers) spread over 8 weeks. `doneKeys`
 * is the set of "topicId/difficulty" strings already completed; the
 * caller decides where that comes from (localStorage progress here),
 * keeping this function testable without touching storage. */
export function buildStudyPlan(
  goal: StudyPlanGoal,
  topics: { id: string; title: string }[],
  doneKeys: Set<string>
): StudyPlanWeek[] {
  const items: StudyPlanItem[] = [];
  for (const topic of topics) {
    for (const difficulty of DIFFICULTY_ORDER) {
      items.push({
        topicId: topic.id,
        topicTitle: topic.title,
        difficulty,
        done: doneKeys.has(`${topic.id}/${difficulty}`),
      });
    }
  }

  const weeks: StudyPlanWeek[] = Array.from({ length: goal.weeks }, (_, i) => ({
    weekNumber: i + 1,
    items: [],
  }));
  if (items.length === 0) return weeks.filter((w) => w.items.length > 0);

  const perWeek = Math.ceil(items.length / goal.weeks);
  items.forEach((item, i) => {
    const weekIndex = Math.min(Math.floor(i / perWeek), goal.weeks - 1);
    weeks[weekIndex].items.push(item);
  });

  return weeks.filter((w) => w.items.length > 0);
}

/** Overall completion across a plan (0-1), for a summary progress bar. */
export function studyPlanProgress(weeks: StudyPlanWeek[]): number {
  const allItems = weeks.flatMap((w) => w.items);
  if (allItems.length === 0) return 0;
  return allItems.filter((item) => item.done).length / allItems.length;
}

/** First not-yet-done item, in plan order, for a "Continuar" CTA — null
 * once the whole plan is complete. */
export function nextStudyPlanItem(weeks: StudyPlanWeek[]): StudyPlanItem | null {
  for (const week of weeks) {
    const next = week.items.find((item) => !item.done);
    if (next) return next;
  }
  return null;
}
