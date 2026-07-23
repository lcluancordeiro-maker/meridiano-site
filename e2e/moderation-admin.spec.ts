import { test, expect } from "@playwright/test";

test.describe("moderator dashboard (Supabase not configured in this environment)", () => {
  test("/admin/moderacao redirects home when not configured", async ({ page }) => {
    await page.goto("/admin/moderacao");
    await expect(page).toHaveURL("/");
  });

  test("navbar never shows a 'Moderação' link when logged out", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByRole("link", { name: "Moderação", exact: true })).toHaveCount(0);
  });
});
