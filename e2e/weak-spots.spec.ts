import { test, expect } from "@playwright/test";

// The weak-spots card on /progresso ranks the student's own topics by
// accuracy (lowest first) so they know what to review next. It reads the
// same localStorage stores the quiz writes: "meridiano-math-progress" for
// per-topic scores and "meridiano-math-gamification" for XP (gates whether
// the whole dashboard — not just this card — renders at all).
test.describe("weak spots (progress dashboard)", () => {
  function seedGamification(xp: number) {
    return {
      xp,
      streak: { current: 1, longest: 1, lastActiveDate: null },
      unlockedBadges: [],
      completedTopics: [],
      xpLog: {},
    };
  }

  test("a fresh visitor with no activity sees the empty dashboard, not the weak-spots card", async ({
    page,
  }) => {
    await page.goto("/progresso");
    await expect(
      page.getByText("Você ainda não completou nenhum exercício.")
    ).toBeVisible();
    await expect(page.getByText("Pontos de atenção")).not.toBeVisible();
  });

  test("ranks the lowest-accuracy topic first and links to its topic page", async ({ page }) => {
    await page.addInitScript(
      ([progress, gamification]) => {
        window.localStorage.setItem("meridiano-math-progress", progress as string);
        window.localStorage.setItem("meridiano-math-gamification", gamification as string);
      },
      [
        JSON.stringify({
          "fundamental-2/fracoes/facil": { completed: true, score: 6, total: 6, updatedAt: 1 },
          "fundamental-2/geometria-plana/facil": {
            completed: true,
            score: 1,
            total: 6,
            updatedAt: 1,
          },
          "medio/funcao-primeiro-grau/facil": {
            completed: true,
            score: 3,
            total: 6,
            updatedAt: 1,
          },
        }),
        JSON.stringify(seedGamification(50)),
      ]
    );

    await page.goto("/progresso");
    await expect(page.getByText("Pontos de atenção")).toBeVisible();

    const rows = page.locator("a", { hasText: /% \(\d+\/\d+\)/ });
    await expect(rows.first()).toContainText("Geometria Plana");
    await expect(rows.first()).toContainText("17%");
    await expect(rows.first()).toHaveAttribute(
      "href",
      "/trilha/fundamental-2/geometria-plana"
    );

    // 100% accuracy topic (Frações) is filtered out of the card — only the
    // two below-80% topics show up as rows.
    await expect(rows).toHaveCount(2);
    await expect(rows.nth(0)).toHaveAttribute("href", "/trilha/fundamental-2/geometria-plana");
    await expect(rows.nth(1)).toHaveAttribute("href", "/trilha/medio/funcao-primeiro-grau");
  });

  test("shows an encouraging message when every practiced topic is above 80%", async ({
    page,
  }) => {
    await page.addInitScript(
      ([progress, gamification]) => {
        window.localStorage.setItem("meridiano-math-progress", progress as string);
        window.localStorage.setItem("meridiano-math-gamification", gamification as string);
      },
      [
        JSON.stringify({
          "fundamental-2/fracoes/facil": { completed: true, score: 6, total: 6, updatedAt: 1 },
        }),
        JSON.stringify(seedGamification(20)),
      ]
    );

    await page.goto("/progresso");
    await expect(page.getByText("Pontos de atenção")).toBeVisible();
    await expect(page.getByText(/Mandou bem/)).toBeVisible();
  });
});
