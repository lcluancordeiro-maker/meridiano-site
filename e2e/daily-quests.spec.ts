import { test, expect } from "@playwright/test";

// Rotating daily quests sit next to the Daily Challenge on the homepage —
// three fixed targets (xp30/correct5/perfectScore) that reset every day,
// tracked in "meridiano-math-gamification" alongside the rest of the
// gamification state.
test.describe("missões diárias (daily quests)", () => {
  function seedGamification(overrides: Record<string, unknown> = {}) {
    return JSON.stringify({
      xp: 0,
      streak: { current: 0, longest: 0, lastActiveDate: null, freezes: 0 },
      unlockedBadges: [],
      completedTopics: [],
      xpLog: {},
      gems: 0,
      xpBoostUntil: null,
      unlockedAccentThemes: [],
      dailyQuests: { date: "", correctAnswersToday: 0, perfectScoreToday: false, claimed: [] },
      ...overrides,
    });
  }

  test("shows the three quests with zero progress for a fresh visitor", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByText("Missões diárias")).toBeVisible();
    const quests = page.getByTestId("daily-quest");
    await expect(quests).toHaveCount(3);
    await expect(quests.nth(0)).toContainText("0/30");
    await expect(quests.nth(1)).toContainText("0/5");
    await expect(quests.nth(2)).toContainText("0/1");
  });

  test("shows in-progress and claimed quests from seeded gamification state", async ({ page }) => {
    const today = new Date().toISOString().slice(0, 10);
    await page.addInitScript((state) => {
      window.localStorage.setItem("meridiano-math-gamification", state as string);
    }, seedGamification({
      xpLog: { [today]: 20 },
      dailyQuests: {
        date: today,
        correctAnswersToday: 5,
        perfectScoreToday: false,
        claimed: ["correct5"],
      },
    }));

    await page.goto("/");
    const quests = page.getByTestId("daily-quest");
    await expect(quests.nth(0)).toContainText("20/30");
    await expect(quests.nth(0)).toHaveAttribute("data-quest-done", "false");
    await expect(quests.nth(1)).toContainText("5/5");
    await expect(quests.nth(1)).toHaveAttribute("data-quest-done", "true");
  });

  test("does not carry over yesterday's progress to a new day", async ({ page }) => {
    await page.addInitScript((state) => {
      window.localStorage.setItem("meridiano-math-gamification", state as string);
    }, seedGamification({
      dailyQuests: {
        date: "2000-01-01",
        correctAnswersToday: 5,
        perfectScoreToday: true,
        claimed: ["correct5", "perfectScore"],
      },
    }));

    await page.goto("/");
    const quests = page.getByTestId("daily-quest");
    await expect(quests.nth(1)).toContainText("0/5");
    await expect(quests.nth(1)).toHaveAttribute("data-quest-done", "false");
    await expect(quests.nth(2)).toContainText("0/1");
  });
});
