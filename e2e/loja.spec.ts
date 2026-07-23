import { test, expect } from "@playwright/test";

// The gem shop (/loja) spends gems earned automatically on level-up
// (gamification.ts's addXp) on an extra streak freeze, a temporary XP
// boost, or a permanent accent color theme unlock — all pure localStorage
// state under "meridiano-math-gamification", same store the quiz writes to.
test.describe("loja de gemas (/loja)", () => {
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
      ...overrides,
    });
  }

  test("a fresh visitor sees zero gems and can't afford anything yet", async ({ page }) => {
    await page.goto("/loja");
    await expect(page.getByRole("heading", { name: "Loja" })).toBeVisible();
    await expect(page.getByText("💎 0 gemas")).toBeVisible();
    await expect(page.getByRole("button", { name: /Comprar por 20/ })).toBeDisabled();
    await expect(page.getByRole("button", { name: /Comprar por 30/ })).toBeDisabled();
  });

  test("buying an extra streak freeze spends gems and increments the banked count", async ({
    page,
  }) => {
    await page.addInitScript((state) => {
      window.localStorage.setItem("meridiano-math-gamification", state as string);
    }, seedGamification({ gems: 25 }));

    await page.goto("/loja");
    await expect(page.getByText("Congelamentos: 0/2")).toBeVisible();
    await page.getByRole("button", { name: /Comprar por 20/ }).click();
    await expect(page.getByText("Congelamento extra comprado!")).toBeVisible();
    await expect(page.getByText("💎 5 gemas")).toBeVisible();
    await expect(page.getByText("Congelamentos: 1/2")).toBeVisible();
  });

  test("buying an XP boost shows the remaining time and spends gems", async ({ page }) => {
    await page.addInitScript((state) => {
      window.localStorage.setItem("meridiano-math-gamification", state as string);
    }, seedGamification({ gems: 30 }));

    await page.goto("/loja");
    await page.getByRole("button", { name: /Comprar por 30/ }).click();
    await expect(page.getByText("Impulso de XP ativado!")).toBeVisible();
    await expect(page.getByText("💎 0 gemas")).toBeVisible();
    await expect(page.getByText(/Ativo por mais/)).toBeVisible();
  });

  test("buying an accent theme unlocks and applies it, changing data-accent", async ({ page }) => {
    await page.addInitScript((state) => {
      window.localStorage.setItem("meridiano-math-gamification", state as string);
    }, seedGamification({ gems: 15 }));

    await page.goto("/loja");
    await page.getByRole("button", { name: /Oceano/ }).click();
    await expect(page.getByText(/desbloqueado e aplicado/)).toBeVisible();
    await expect(page.locator("html")).toHaveAttribute("data-accent", "oceano");
    await expect(page.getByText("💎 0 gemas")).toBeVisible();

    // Clicking the now-owned theme again just toggles it off.
    await page.getByRole("button", { name: /Oceano/ }).click();
    await expect(page.locator("html")).not.toHaveAttribute("data-accent", "oceano");
  });

  test("navbar (under 'Mais') links to the shop", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("button", { name: "Mais" }).click();
    await expect(page.getByRole("link", { name: "Loja" })).toHaveAttribute("href", "/loja");
  });
});
