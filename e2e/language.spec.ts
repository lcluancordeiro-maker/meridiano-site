import { test, expect } from "@playwright/test";

test.describe("language switcher", () => {
  test("defaults to Portuguese and switches the UI language, persisting across reloads", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByRole("link", { name: "Entrar" })).toBeVisible();

    await page.getByRole("combobox", { name: "Idioma" }).selectOption("en");
    await expect(page.getByRole("link", { name: "Log in" })).toBeVisible();
    await expect(page.getByRole("heading", { name: "Choose your grade level" })).toBeVisible();

    await page.reload();
    await expect(page.getByRole("link", { name: "Log in" })).toBeVisible();
  });

  test("switches to Spanish", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("combobox", { name: "Idioma" }).selectOption("es");
    await expect(page.getByRole("link", { name: "Iniciar sesión" })).toBeVisible();
  });
});
