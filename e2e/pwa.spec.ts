import { test, expect } from "@playwright/test";

test.describe("PWA installability", () => {
  test("serves a valid manifest linked from the page", async ({ page, request }) => {
    await page.goto("/");
    const manifestHref = await page.locator('link[rel="manifest"]').getAttribute("href");
    expect(manifestHref).toBe("/manifest.json");

    const res = await request.get(manifestHref!);
    expect(res.ok()).toBe(true);
    const manifest = await res.json();
    expect(manifest.name).toBe("Meridiano Matemática");
    expect(manifest.icons.length).toBeGreaterThan(0);
  });

  test("serves the service worker script", async ({ request }) => {
    const res = await request.get("/sw.js");
    expect(res.ok()).toBe(true);
    expect(res.headers()["content-type"]).toContain("javascript");
  });

  test("registers the service worker on page load", async ({ page }) => {
    await page.goto("/");
    // Registration happens client-side in a useEffect — poll instead of a single check.
    await expect
      .poll(
        () => page.evaluate(async () => !!(await navigator.serviceWorker?.getRegistration())),
        { timeout: 10_000 }
      )
      .toBe(true);
  });
});
