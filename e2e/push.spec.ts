import { test, expect } from "@playwright/test";

test.describe("push notifications (not configured in this environment)", () => {
  test("the streak-reminder opt-in doesn't render for a guest on /progresso", async ({ page }) => {
    await page.goto("/progresso");
    await expect(page.getByText("Ativar lembretes")).toHaveCount(0);
    await expect(page.getByText("Desativar lembretes")).toHaveCount(0);
  });

  test("/api/push/subscribe reports not configured rather than erroring", async ({ request }) => {
    const res = await request.post("/api/push/subscribe", { data: {} });
    expect(res.status()).toBe(503);
    expect(await res.json()).toEqual({ error: "push_not_configured" });
  });

  test("/api/push/send-streak-reminders reports not configured rather than erroring", async ({ request }) => {
    const res = await request.post("/api/push/send-streak-reminders", { data: {} });
    expect(res.status()).toBe(503);
    expect(await res.json()).toEqual({ error: "push_not_configured" });
  });

  test("/api/push/notify-message reports not configured rather than erroring", async ({ request }) => {
    const res = await request.post("/api/push/notify-message", { data: { table: "dm_messages", messageId: "x" } });
    expect(res.status()).toBe(503);
    expect(await res.json()).toEqual({ error: "not_configured" });
  });
});
