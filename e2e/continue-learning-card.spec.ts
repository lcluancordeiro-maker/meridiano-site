import { test, expect } from "@playwright/test";

// "Continue de onde parou" — a card in the hero pointing back at the last
// topic the student touched, resolved from the same localStorage progress
// store the quiz writes to. Hidden entirely for a first-time visitor.
test.describe("continue learning card", () => {
  test("a fresh visitor sees no continue card, just the default hero CTAs", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByText("Continue de onde parou")).not.toBeVisible();
    await expect(page.getByRole("link", { name: "Ver trilhas disponíveis" })).toBeVisible();
  });

  test("a returning visitor sees a card linking to their most recent topic", async ({ page }) => {
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
    await page.goto("/");
    const card = page.getByTestId("continue-learning-card");
    await expect(card).toHaveAttribute("href", "/trilha/fundamental-2/fracoes");
    await expect(card.getByText("Frações")).toBeVisible();
    await expect(card.getByText("Ensino Fundamental II")).toBeVisible();
    await card.click();
    await expect(page).toHaveURL(/\/trilha\/fundamental-2\/fracoes$/);
  });

  test("resolves to the most recently touched topic across levels", async ({ page }) => {
    await page.addInitScript(() => {
      const store: Record<string, unknown> = {};
      store["fundamental-2/fracoes/medio"] = {
        completed: true,
        score: 6,
        total: 6,
        updatedAt: 1000,
      };
      store["medio/funcao-primeiro-grau/facil"] = {
        completed: true,
        score: 6,
        total: 6,
        updatedAt: 2000,
      };
      window.localStorage.setItem("meridiano-math-progress", JSON.stringify(store));
    });
    await page.goto("/");
    await expect(page.getByText("Função do 1º Grau")).toBeVisible();
  });
});
