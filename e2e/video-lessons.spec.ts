import { test, expect } from "@playwright/test";

// Curated short video lessons (embeds) shown on a handful of topic pages —
// only topics with a hand-picked video get the section; everything else
// stays unchanged. Clicking a video's thumbnail swaps it for a real iframe
// (a "lite embed" facade, so YouTube's player JS never loads for a visitor
// who doesn't click play).
test.describe("curated video lessons on a topic page", () => {
  test("a topic with curated videos shows the section, and clicking a thumbnail loads the player", async ({
    page,
  }) => {
    await page.goto("/trilha/fundamental-2/fracoes");
    await expect(page.getByRole("heading", { name: "Videoaulas" })).toBeVisible();

    const thumbnailButton = page.getByRole("button").filter({ hasText: "Professora Angela Matemática" });
    await expect(thumbnailButton).toBeVisible();
    await expect(page.locator("iframe[src*='youtube-nocookie.com']")).toHaveCount(0);

    await thumbnailButton.click();
    await expect(page.locator("iframe[src*='youtube-nocookie.com']")).toHaveCount(1);
  });

  test("a topic without curated videos shows no video section", async ({ page }) => {
    await page.goto("/trilha/fundamental-2/numeros-inteiros");
    await expect(page.getByRole("heading", { name: "Videoaulas" })).toHaveCount(0);
  });
});
