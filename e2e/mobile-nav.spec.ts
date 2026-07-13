import { test, expect } from "@playwright/test";

test.describe("responsive navbar", () => {
  test("desktop viewport shows nav links without needing the hamburger button", async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto("/");
    await expect(page.getByRole("link", { name: "Trilhas", exact: true })).toBeVisible();
    await expect(page.getByRole("button", { name: "Abrir menu" })).toBeHidden();
  });

  test("mobile viewport hides nav links behind a hamburger toggle", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 800 });
    await page.goto("/");

    const trilhasLink = page.getByRole("link", { name: "Trilhas", exact: true });
    const menuButton = page.getByRole("button", { name: "Abrir menu" });

    await expect(menuButton).toBeVisible();
    await expect(trilhasLink).toBeHidden();

    await menuButton.click();
    await expect(trilhasLink).toBeVisible();
    await expect(page.getByRole("button", { name: "Fechar menu" })).toBeVisible();

    await trilhasLink.click();
    await expect(page).toHaveURL(/#niveis$/);
  });
});
