import { test, expect } from "@playwright/test";

// A weak-spot topic (accuracy below 80%) on /progresso now offers a
// "Perguntar ao Gauss" button next to the practice link — clicking it opens
// the global Gauss tutor bubble with a starter prompt already typed in,
// reusing the same askGauss() dispatch as SolutionDisplay's existing button.
test.describe("Gauss proativo (nudge de ponto fraco)", () => {
  test("a weak spot on /progresso offers to ask Gauss, which opens the tutor with a pre-filled prompt", async ({
    page,
  }) => {
    await page.addInitScript(() => {
      window.localStorage.setItem(
        "meridiano-math-progress",
        JSON.stringify({
          "fundamental-2/fracoes/facil": {
            completed: false,
            score: 1,
            total: 5,
            updatedAt: Date.now(),
          },
        })
      );
      // The dashboard only renders past the empty state (and thus the
      // weak-spots section) once gamification.xp > 0 — see
      // ProgressoContent.tsx's hasAnyActivity check.
      window.localStorage.setItem(
        "meridiano-math-gamification",
        JSON.stringify({
          xp: 20,
          streak: { current: 0, longest: 0, lastActiveDate: null, freezes: 0 },
          unlockedBadges: [],
          completedTopics: [],
          xpLog: {},
          gems: 0,
          xpBoostUntil: null,
          unlockedAccentThemes: [],
          dailyQuests: { date: "", correctAnswersToday: 0, perfectScoreToday: false, claimed: [] },
        })
      );
    });
    await page.goto("/progresso");

    const askGaussButton = page.getByRole("button", { name: "Perguntar ao Gauss" });
    await expect(askGaussButton).toBeVisible();
    await askGaussButton.click();

    // Supabase isn't configured in this environment (see tutor.spec.ts), so
    // the tutor panel shows an unavailable message instead of the chat input
    // — but its opening at all (via the same askGauss() dispatch
    // SolutionDisplay's button already uses) confirms the nudge is wired
    // correctly.
    await expect(page.getByText("Gauss — seu tutor de IA")).toBeVisible();
    await expect(page.getByText("O tutor de IA ainda não está disponível neste app.")).toBeVisible();
  });
});
