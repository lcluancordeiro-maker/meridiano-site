import { test, expect } from "@playwright/test";

// Like the other Supabase-backed features, the weekly league degrades to a
// clear "not available" notice when Supabase isn't configured — which is
// the case in this test environment.
test.describe("liga semanal (Supabase not configured in this environment)", () => {
  test("/liga explains the league isn't available yet", async ({ page }) => {
    await page.goto("/liga");
    await expect(page.getByRole("heading", { name: "Liga semanal" })).toBeVisible();
    await expect(
      page.getByText("A liga semanal ainda não está disponível neste app.")
    ).toBeVisible();
  });

  test("/progresso links to the league page", async ({ page }) => {
    await page.goto("/progresso");
    await expect(page.getByRole("link", { name: /Liga semanal/ })).toHaveAttribute(
      "href",
      "/liga"
    );
  });
});
