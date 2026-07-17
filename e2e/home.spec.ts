import { test, expect } from "@playwright/test";

test.describe("home page", () => {
  test("renders hero, level sections and navigation", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByRole("heading", { name: /Aprenda matemática/ })).toBeVisible();

    await expect(page.getByRole("heading", { name: "Escolha seu nível de ensino" })).toBeVisible();
    await expect(page.getByRole("heading", { level: 2, name: "Estatística", exact: true })).toBeVisible();
    await expect(page.getByRole("heading", { level: 2, name: "Econometria", exact: true })).toBeVisible();
  });

  test("available levels link to their trilha page; unavailable ones do not", async ({ page }) => {
    await page.goto("/");

    await expect(page.getByRole("link", { name: /Ensino Fundamental II/ })).toHaveAttribute(
      "href",
      "/trilha/fundamental-2"
    );

    // Fundamental I is unavailable — its card must not be a link.
    const fund1Heading = page.getByRole("heading", { name: "Ensino Fundamental I", exact: true });
    await expect(fund1Heading).toBeVisible();
    await expect(page.locator('a[href="/trilha/fundamental-1"]')).toHaveCount(0);
  });

  test("navbar links reach the calculator (under 'Mais') and progress pages", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("button", { name: "Mais" }).click();
    await page.getByRole("link", { name: "Calculadora" }).click();
    await expect(page).toHaveURL(/\/calculadora$/);

    await page.getByRole("link", { name: "Progresso" }).click();
    await expect(page).toHaveURL(/\/progresso$/);
  });
});
