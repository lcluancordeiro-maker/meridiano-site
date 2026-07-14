import { test, expect } from "@playwright/test";

// The level page renders topics as a vertical "skill path": numbered nodes
// connected by a line, turning green as difficulty tiers are completed.
// Progress comes from the same localStorage store the quiz writes
// ("meridiano-math-progress"), which lets these tests seed states directly.
test.describe("skill path (visual progression map)", () => {
  test("a fresh visitor sees numbered, not-started nodes linking to the topics", async ({
    page,
  }) => {
    await page.goto("/trilha/fundamental-2");
    const nodes = page.getByTestId("skill-node");
    await expect(nodes.first()).toBeVisible();
    const count = await nodes.count();
    expect(count).toBeGreaterThanOrEqual(7);

    await expect(nodes.first()).toHaveText("1");
    await expect(nodes.first()).toHaveAttribute("aria-label", /não iniciado$/);
    await expect(
      page.getByRole("link", { name: /Frações/ }).first()
    ).toHaveAttribute("href", "/trilha/fundamental-2/fracoes");
  });

  test("a partially completed topic shows as 'em progresso' with its tier count", async ({
    page,
  }) => {
    await page.addInitScript(() => {
      window.localStorage.setItem(
        "meridiano-math-progress",
        JSON.stringify({
          "fundamental-2/fracoes/medio": {
            completed: true,
            score: 6,
            total: 6,
            updatedAt: Date.now(),
          },
        })
      );
    });
    await page.goto("/trilha/fundamental-2");
    const node = page.locator('[data-testid="skill-node"][aria-label="Frações: em progresso"]');
    await expect(node).toBeVisible();
    await expect(page.getByText("1/4 níveis")).toBeVisible();
  });

  test("a topic with all four tiers done shows a green checkmark node", async ({ page }) => {
    await page.addInitScript(() => {
      const tier = { completed: true, score: 6, total: 6, updatedAt: Date.now() };
      window.localStorage.setItem(
        "meridiano-math-progress",
        JSON.stringify({
          "fundamental-2/fracoes/facil": tier,
          "fundamental-2/fracoes/medio": tier,
          "fundamental-2/fracoes/dificil": tier,
          "fundamental-2/fracoes/olimpiada": tier,
        })
      );
    });
    await page.goto("/trilha/fundamental-2");
    const node = page.locator('[data-testid="skill-node"][aria-label="Frações: concluído"]');
    await expect(node).toBeVisible();
    await expect(node).toHaveText("✓");
    await expect(page.getByText("4/4 níveis")).toBeVisible();
  });
});
