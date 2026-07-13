import { test, expect } from "@playwright/test";

test.describe("dark mode toggle", () => {
  test("defaults to light and switches to dark on click, persisting across reloads", async ({ page }) => {
    await page.goto("/");
    const html = page.locator("html");
    await expect(html).not.toHaveAttribute("data-theme", "dark");

    await page.getByRole("button", { name: "Ativar tema escuro" }).click();
    await expect(html).toHaveAttribute("data-theme", "dark");

    await page.reload();
    await expect(html).toHaveAttribute("data-theme", "dark");
    await expect(page.getByRole("button", { name: "Ativar tema claro" })).toBeVisible();
  });

  test("switching back to light removes the data-theme attribute", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("button", { name: "Ativar tema escuro" }).click();
    await page.getByRole("button", { name: "Ativar tema claro" }).click();
    await expect(page.locator("html")).not.toHaveAttribute("data-theme", "dark");
  });
});
