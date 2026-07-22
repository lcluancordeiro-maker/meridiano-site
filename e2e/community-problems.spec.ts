import { test, expect } from "@playwright/test";

test.describe("problemas da comunidade (Supabase not configured in this environment)", () => {
  test("/comunidade/problemas explains the feature isn't available yet", async ({ page }) => {
    await page.goto("/comunidade/problemas");
    await expect(page.getByRole("heading", { name: "Problemas da comunidade" })).toBeVisible();
    await expect(
      page.getByText("O banco de problemas da comunidade ainda não está disponível neste app.")
    ).toBeVisible();
  });

  test("navbar (under 'Mais') links to /comunidade/problemas", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("button", { name: "Mais" }).click();
    await expect(
      page.getByRole("link", { name: "Problemas da comunidade", exact: true })
    ).toHaveAttribute("href", "/comunidade/problemas");
  });
});
