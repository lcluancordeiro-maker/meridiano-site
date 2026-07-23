import { test, expect } from "@playwright/test";

// The study-activity heatmap on /progresso renders getXpLast(182) as a
// GitHub-style grid of colored cells, reusing the same
// "meridiano-math-gamification" xpLog localStorage store the XP-trend
// chart reads from.
test.describe("study activity heatmap (progress dashboard)", () => {
  function isoDaysAgo(daysAgo: number): string {
    const d = new Date();
    d.setDate(d.getDate() - daysAgo);
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${y}-${m}-${day}`;
  }

  test("shows the heatmap heading, legend and accessible table once there's activity", async ({
    page,
  }) => {
    const xpLog: Record<string, number> = {
      [isoDaysAgo(0)]: 20,
      [isoDaysAgo(1)]: 45,
      [isoDaysAgo(3)]: 10,
    };
    const totalXp = Object.values(xpLog).reduce((s, v) => s + v, 0);

    await page.addInitScript(
      ([gamification]) => {
        window.localStorage.setItem("meridiano-math-gamification", gamification as string);
      },
      [
        JSON.stringify({
          xp: totalXp,
          streak: { current: 1, longest: 1, lastActiveDate: null },
          unlockedBadges: [],
          completedTopics: [],
          xpLog,
        }),
      ]
    );

    await page.goto("/progresso");
    await expect(page.getByRole("heading", { name: "Atividade de estudo" })).toBeVisible();
    await expect(page.getByText("Últimos 6 meses")).toBeVisible();
    const legend = page.getByTestId("heatmap-legend");
    await expect(legend.getByText("Menos")).toBeVisible();
    await expect(legend.getByText("Mais")).toBeVisible();

    await expect(
      page.getByRole("img", { name: new RegExp(`Atividade de estudo: ${totalXp} XP`) })
    ).toBeVisible();

    await page.getByText("Ver dados em tabela").last().click();
    const todayRow = page.getByTestId("heatmap-table").locator("tr", { hasText: isoDaysAgo(0) });
    await expect(todayRow).toContainText("20");
  });

  test("does not render the heatmap for a fresh visitor with no activity", async ({ page }) => {
    await page.goto("/progresso");
    await expect(page.getByText("Você ainda não completou nenhum exercício.")).toBeVisible();
    await expect(page.getByText("Atividade de estudo")).not.toBeVisible();
  });
});
