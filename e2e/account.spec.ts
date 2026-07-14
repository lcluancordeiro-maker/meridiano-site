import { test, expect } from "@playwright/test";

test.describe("account export/deletion (Supabase not configured in this environment)", () => {
  test("/conta redirects home when not configured", async ({ page }) => {
    await page.goto("/conta");
    await expect(page).toHaveURL("/");
  });

  test("/api/account/export reports not configured rather than erroring", async ({ request }) => {
    const res = await request.get("/api/account/export");
    expect(res.status()).toBe(503);
    expect(await res.json()).toEqual({ error: "not_configured" });
  });

  test("/conta/excluida renders without needing an account", async ({ page }) => {
    await page.goto("/conta/excluida");
    await expect(page.getByRole("heading", { name: "Conta excluída" })).toBeVisible();
  });
});
