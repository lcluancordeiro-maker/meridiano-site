import { test, expect } from "@playwright/test";

// Overrides the global storageState (which pre-dismisses the tour for
// every other spec, see playwright.config.ts) so these tests see a truly
// fresh first-time visitor.
test.use({ storageState: { cookies: [], origins: [] } });

test.describe("onboarding tour (first-time visitor)", () => {
  test("shows on first visit and steps through Next/Back", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByRole("heading", { name: "Bem-vindo ao Meridiano Matemática!" })).toBeVisible();
    await expect(page.getByText("Passo 1 de 6")).toBeVisible();

    await page.getByRole("button", { name: "Próximo" }).click();
    await expect(page.getByText("Passo 2 de 6")).toBeVisible();
    await expect(page.getByRole("heading", { name: "Trilhas e gamificação" })).toBeVisible();

    await page.getByRole("button", { name: "Voltar" }).click();
    await expect(page.getByText("Passo 1 de 6")).toBeVisible();
  });

  test("Skip dismisses the tour and it doesn't reappear on reload", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByRole("heading", { name: "Bem-vindo ao Meridiano Matemática!" })).toBeVisible();

    await page.getByRole("button", { name: "Pular" }).click();
    await expect(page.getByRole("heading", { name: "Bem-vindo ao Meridiano Matemática!" })).toHaveCount(0);

    await page.reload();
    await expect(page.getByRole("heading", { name: "Bem-vindo ao Meridiano Matemática!" })).toHaveCount(0);
  });

  test("reaching the last step and clicking 'Começar' dismisses the tour", async ({ page }) => {
    await page.goto("/");
    for (let i = 0; i < 5; i++) {
      await page.getByRole("button", { name: "Próximo" }).click();
    }
    await expect(page.getByText("Passo 6 de 6")).toBeVisible();
    await page.getByRole("button", { name: "Começar" }).click();
    await expect(page.getByRole("heading", { name: "Tudo pronto!" })).toHaveCount(0);
  });
});
