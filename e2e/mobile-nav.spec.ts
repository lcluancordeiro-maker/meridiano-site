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

test.describe("'Mais' menu (secondary nav links)", () => {
  test("desktop: secondary links are hidden until 'Mais' is opened", async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto("/");

    const quadroLink = page.getByRole("link", { name: "Quadro" });
    const moreButton = page.getByRole("button", { name: "Mais" });

    await expect(quadroLink).not.toBeVisible();
    await expect(moreButton).toBeVisible();

    await moreButton.click();
    await expect(quadroLink).toBeVisible();
    await quadroLink.click();
    await expect(page).toHaveURL(/\/quadro$/);
  });

  test("mobile: the hamburger reveals primary and secondary links in one flat list", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 375, height: 800 });
    await page.goto("/");

    await expect(page.getByRole("button", { name: "Mais" })).toBeHidden();
    await page.getByRole("button", { name: "Abrir menu" }).click();

    await expect(page.getByRole("link", { name: "Trilhas", exact: true })).toBeVisible();
    await expect(page.getByRole("link", { name: "Quadro" })).toBeVisible();
    await expect(page.getByRole("link", { name: "Turmas", exact: true })).toBeVisible();
  });
});
