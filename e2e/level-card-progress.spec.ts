import { test, expect } from "@playwright/test";

// Level cards on the home page show a thin progress bar once the student
// has actually started that track — same "hidden at zero" convention as
// the navbar XP badge. Seeds localStorage directly (same store the quiz
// writes to: "meridiano-math-progress").
test.describe("level card progress", () => {
  test("a level with no progress shows no progress bar", async ({ page }) => {
    await page.goto("/");
    const fund2Card = page.getByRole("link", { name: /Ensino Fundamental II/ });
    await expect(fund2Card.getByRole("progressbar")).toHaveCount(0);
  });

  test("a level with some progress shows a percentage bar", async ({ page }) => {
    await page.addInitScript(() => {
      window.localStorage.setItem(
        "meridiano-math-progress",
        JSON.stringify({
          "fundamental-2/fracoes/facil": {
            completed: true,
            score: 6,
            total: 6,
            updatedAt: Date.now(),
          },
        })
      );
    });
    await page.goto("/");
    const fund2Card = page.getByRole("link", { name: /Ensino Fundamental II/ });
    const bar = fund2Card.getByRole("progressbar");
    await expect(bar).toBeVisible();
    // 1 tier done out of 7 topics × 4 tiers = 28 → 4% (rounded).
    await expect(bar).toHaveAttribute("aria-valuenow", "4");
  });
});
