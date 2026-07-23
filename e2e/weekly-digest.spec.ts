import { test, expect } from "@playwright/test";

test.describe("weekly parent digest email (Supabase/Resend not configured in this environment)", () => {
  test("/api/email/send-weekly-digest reports not configured rather than erroring", async ({ request }) => {
    const res = await request.post("/api/email/send-weekly-digest", { data: {} });
    expect(res.status()).toBe(503);
    expect(await res.json()).toEqual({ error: "not_configured" });
  });
});
