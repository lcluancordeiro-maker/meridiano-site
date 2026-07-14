import { test, expect } from "@playwright/test";

test.describe("moderation (Supabase not configured in this environment)", () => {
  test("/chat/bloqueados redirects back to /chat when not configured", async ({ page }) => {
    await page.goto("/chat/bloqueados");
    await expect(page).toHaveURL("/chat");
  });

  test("chat list has no link to blocked users when logged out", async ({ page }) => {
    await page.goto("/chat");
    await expect(page.getByRole("link", { name: "Usuários bloqueados" })).toHaveCount(0);
  });
});
