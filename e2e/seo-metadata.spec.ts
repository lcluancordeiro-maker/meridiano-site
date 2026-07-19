import { test, expect } from "@playwright/test";

// Topic and level pages used to inherit the generic root title/description
// for every single page — search results and shared links for e.g. a
// "Frações" topic looked identical to the homepage. generateMetadata on
// both route segments now gives each page its own title/description, and
// the root layout now emits an actual og:image (previously none at all).
test.describe("SEO metadata", () => {
  test("a topic page has its own title, description and canonical URL", async ({ page }) => {
    await page.goto("/trilha/fundamental-2/fracoes");
    await expect(page).toHaveTitle("Frações — Ensino Fundamental II — Meridiano Matemática");
    const description = page.locator('meta[name="description"]');
    await expect(description).toHaveAttribute("content", /frações/i);
    const canonical = page.locator('link[rel="canonical"]');
    await expect(canonical).toHaveAttribute("href", /\/trilha\/fundamental-2\/fracoes$/);
  });

  test("a level page has its own title and description, distinct from the topic page", async ({
    page,
  }) => {
    await page.goto("/trilha/medio");
    await expect(page).toHaveTitle("Ensino Médio — Meridiano Matemática");
    const canonical = page.locator('link[rel="canonical"]');
    await expect(canonical).toHaveAttribute("href", /\/trilha\/medio$/);
  });

  test("the homepage exposes an og:image and a summary_large_image twitter card", async ({
    page,
  }) => {
    await page.goto("/");
    const ogImage = page.locator('meta[property="og:image"]');
    await expect(ogImage).toHaveAttribute("content", /opengraph-image/);
    const twitterCard = page.locator('meta[name="twitter:card"]');
    await expect(twitterCard).toHaveAttribute("content", "summary_large_image");
  });

  test("the generated opengraph-image route serves a real PNG", async ({ page }) => {
    const response = await page.request.get("/opengraph-image");
    expect(response.ok()).toBe(true);
    expect(response.headers()["content-type"]).toBe("image/png");
  });
});
