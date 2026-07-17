import { test, expect } from "@playwright/test";

test.describe("lives (LiveKit not configured in this environment)", () => {
  test("/lives explains lives aren't available yet", async ({ page }) => {
    await page.goto("/lives");
    await expect(page.getByRole("heading", { name: "Lives" })).toBeVisible();
    await expect(page.getByText("As lives ainda não estão disponíveis neste app — volte em breve.")).toBeVisible();
  });

  test("a live detail route redirects back to /lives when not configured", async ({ page }) => {
    await page.goto("/lives/some-room-name");
    await expect(page).toHaveURL("/lives");
  });

  test("/api/livekit/token reports not configured rather than erroring", async ({ request }) => {
    const response = await request.post("/api/livekit/token", { data: { roomName: "some-room-name" } });
    expect(response.status()).toBe(503);
    expect(await response.json()).toEqual({ error: "not_configured" });
  });

  test("navbar (under 'Mais') links to /lives", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("button", { name: "Mais" }).click();
    await expect(page.getByRole("link", { name: "Lives", exact: true })).toHaveAttribute("href", "/lives");
  });
});
