import { describe, expect, it } from "vitest";
import {
  STUDY_PLAN_GOALS,
  buildStudyPlan,
  getStudyPlanGoal,
  nextStudyPlanItem,
  studyPlanProgress,
  type StudyPlanGoal,
} from "./studyPlan";

const GOAL: StudyPlanGoal = { id: "test-8", levelId: "test", label: "Teste em 8 semanas", weeks: 8 };
const TOPICS = [
  { id: "t1", title: "Tópico 1" },
  { id: "t2", title: "Tópico 2" },
  { id: "t3", title: "Tópico 3" },
];

describe("STUDY_PLAN_GOALS", () => {
  it("has one goal per available vestibular track", () => {
    expect(STUDY_PLAN_GOALS.length).toBeGreaterThan(0);
    for (const goal of STUDY_PLAN_GOALS) {
      expect(goal.weeks).toBe(8);
      expect(goal.label).toContain("em 8 semanas");
    }
  });

  it("resolves a goal by id via getStudyPlanGoal", () => {
    const goal = STUDY_PLAN_GOALS[0];
    expect(getStudyPlanGoal(goal.id)).toEqual(goal);
  });

  it("returns undefined for an unknown goal id", () => {
    expect(getStudyPlanGoal("does-not-exist")).toBeUndefined();
  });
});

describe("buildStudyPlan", () => {
  it("spreads every topic × difficulty item across the goal's weeks", () => {
    const weeks = buildStudyPlan(GOAL, TOPICS, new Set());
    const allItems = weeks.flatMap((w) => w.items);
    expect(allItems).toHaveLength(TOPICS.length * 4); // 4 difficulty tiers
    expect(weeks.length).toBeLessThanOrEqual(GOAL.weeks);
  });

  it("marks items as done according to doneKeys", () => {
    const weeks = buildStudyPlan(GOAL, TOPICS, new Set(["t1/facil", "t1/medio"]));
    const allItems = weeks.flatMap((w) => w.items);
    const t1Facil = allItems.find((i) => i.topicId === "t1" && i.difficulty === "facil");
    const t1Dificil = allItems.find((i) => i.topicId === "t1" && i.difficulty === "dificil");
    expect(t1Facil?.done).toBe(true);
    expect(t1Dificil?.done).toBe(false);
  });

  it("keeps items in curriculum + difficulty order within a week", () => {
    const weeks = buildStudyPlan(GOAL, TOPICS, new Set());
    const allItems = weeks.flatMap((w) => w.items);
    expect(allItems[0]).toMatchObject({ topicId: "t1", difficulty: "facil" });
    expect(allItems[1]).toMatchObject({ topicId: "t1", difficulty: "medio" });
  });

  it("drops trailing empty weeks when there are fewer items than weeks", () => {
    const oneTopicGoal: StudyPlanGoal = { ...GOAL, weeks: 8 };
    const weeks = buildStudyPlan(oneTopicGoal, [TOPICS[0]], new Set());
    // 1 topic × 4 tiers = 4 items; ceil(4/8)=1 per week, so only 4 weeks used.
    expect(weeks.every((w) => w.items.length > 0)).toBe(true);
  });

  it("returns an empty plan for a track with no topics", () => {
    expect(buildStudyPlan(GOAL, [], new Set())).toEqual([]);
  });
});

describe("studyPlanProgress", () => {
  it("is 0 for a fresh plan", () => {
    const weeks = buildStudyPlan(GOAL, TOPICS, new Set());
    expect(studyPlanProgress(weeks)).toBe(0);
  });

  it("reflects the fraction of done items", () => {
    const weeks = buildStudyPlan(GOAL, TOPICS, new Set(["t1/facil"]));
    expect(studyPlanProgress(weeks)).toBeCloseTo(1 / 12);
  });

  it("is 0 for an empty plan", () => {
    expect(studyPlanProgress([])).toBe(0);
  });
});

describe("nextStudyPlanItem", () => {
  it("returns the first not-done item in plan order", () => {
    const weeks = buildStudyPlan(GOAL, TOPICS, new Set(["t1/facil"]));
    expect(nextStudyPlanItem(weeks)).toMatchObject({ topicId: "t1", difficulty: "medio" });
  });

  it("returns null once every item is done", () => {
    const allDone = new Set(TOPICS.flatMap((t) => ["facil", "medio", "dificil", "olimpiada"].map((d) => `${t.id}/${d}`)));
    const weeks = buildStudyPlan(GOAL, TOPICS, allDone);
    expect(nextStudyPlanItem(weeks)).toBeNull();
  });
});
