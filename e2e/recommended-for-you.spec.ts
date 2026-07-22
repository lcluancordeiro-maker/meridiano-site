import { test, expect } from "@playwright/test";

// "Recomendado para você" on /progresso merges three systems the student
// otherwise checks separately — due spaced-repetition reviews, adaptive
// difficulty on started-but-unmastered topics, and the next not-started
// topic on a track already in progress — into one ranked list. It reads
// the same localStorage stores those systems already write to.
test.describe("recommended for you (unified progress recommendations)", () => {
  function seedGamification(xp: number) {
    return {
      xp,
      streak: { current: 1, longest: 1, lastActiveDate: null },
      unlockedBadges: [],
      completedTopics: [],
      xpLog: {},
    };
  }

  test("shows a due review first, ahead of adaptive-difficulty suggestions", async ({ page }) => {
    await page.addInitScript(
      ([progress, gamification, reviewSchedule]) => {
        window.localStorage.setItem("meridiano-math-progress", progress as string);
        window.localStorage.setItem("meridiano-math-gamification", gamification as string);
        window.localStorage.setItem("meridiano-math-review-schedule", reviewSchedule as string);
      },
      [
        JSON.stringify({
          "fundamental-2/fracoes/facil": { completed: true, score: 3, total: 10, updatedAt: 1 },
        }),
        JSON.stringify(seedGamification(50)),
        JSON.stringify({
          "fundamental-2/numeros-inteiros/adicao-1": {
            levelId: "fundamental-2",
            topicId: "numeros-inteiros",
            exerciseId: "adicao-1",
            difficulty: "facil",
            intervalDays: 1,
            dueAt: 1,
            lastResult: "correct",
            updatedAt: 1,
          },
        }),
      ]
    );

    await page.goto("/progresso");
    await expect(page.getByText("Recomendado para você")).toBeVisible();

    const rows = page.locator("a", { hasText: /🔁|🎯|🆕/ });
    await expect(rows.first()).toContainText("🔁");
    await expect(rows.first()).toHaveAttribute("href", "/trilha/fundamental-2/numeros-inteiros");
  });

  test("suggests practicing an unmastered started topic", async ({ page }) => {
    await page.addInitScript(
      ([progress, gamification]) => {
        window.localStorage.setItem("meridiano-math-progress", progress as string);
        window.localStorage.setItem("meridiano-math-gamification", gamification as string);
      },
      [
        JSON.stringify({
          "fundamental-2/fracoes/facil": { completed: true, score: 3, total: 10, updatedAt: 1 },
        }),
        JSON.stringify(seedGamification(50)),
      ]
    );

    await page.goto("/progresso");
    const row = page.locator("a", { hasText: "🎯" });
    await expect(row).toContainText("Frações");
  });

  test("suggests the next not-started topic on a track already in progress", async ({ page }) => {
    await page.addInitScript(
      ([progress, gamification]) => {
        window.localStorage.setItem("meridiano-math-progress", progress as string);
        window.localStorage.setItem("meridiano-math-gamification", gamification as string);
      },
      [
        JSON.stringify({
          "fundamental-2/numeros-inteiros/facil": { completed: true, score: 10, total: 10, updatedAt: 1 },
        }),
        JSON.stringify(seedGamification(50)),
      ]
    );

    await page.goto("/progresso");
    const row = page.locator("a", { hasText: "🆕" });
    await expect(row).toHaveCount(1);
    await expect(row).toContainText("Frações");
  });
});
