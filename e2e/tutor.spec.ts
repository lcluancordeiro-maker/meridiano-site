import { test, expect } from "@playwright/test";

test.describe("AI tutor (Gauss) — Supabase not configured in this environment", () => {
  test("the tutor bubble is available globally and opens/closes", async ({ page }) => {
    await page.goto("/");
    const openButton = page.getByRole("button", { name: "Abrir tutor de IA" });
    await expect(openButton).toBeVisible();

    await openButton.click();
    await expect(page.getByText("Gauss — seu tutor de IA")).toBeVisible();
    await expect(page.getByText("O tutor de IA ainda não está disponível neste app.")).toBeVisible();

    await page.getByRole("button", { name: "Fechar tutor de IA" }).click();
    await expect(page.getByText("Gauss — seu tutor de IA")).toHaveCount(0);
  });

  test("the tutor is also reachable from a topic page (global layout)", async ({ page }) => {
    await page.goto("/trilha/fundamental-2/fracoes");
    await expect(page.getByRole("button", { name: "Abrir tutor de IA" })).toBeVisible();
  });

  test("/api/tutor reports not configured rather than erroring", async ({ request }) => {
    const res = await request.post("/api/tutor", { data: { messages: [{ role: "user", content: "oi" }] } });
    expect(res.status()).toBe(503);
    expect(await res.json()).toEqual({ error: "supabase_not_configured" });
  });
});
