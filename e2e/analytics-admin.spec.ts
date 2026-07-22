import { test, expect } from "@playwright/test";

test.describe("analytics dashboard (Supabase not configured in this environment)", () => {
  test("/admin/analytics redirects home when not configured", async ({ page }) => {
    await page.goto("/admin/analytics");
    await expect(page).toHaveURL("/");
  });

  test("navbar never shows an 'Analytics' link when logged out", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByRole("link", { name: "Analytics", exact: true })).toHaveCount(0);
  });
});
