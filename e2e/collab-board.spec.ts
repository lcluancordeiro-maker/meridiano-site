import { test, expect } from "@playwright/test";

test.describe("quadro colaborativo (Supabase not configured in this environment)", () => {
  test("/quadro-colaborativo explains the collaborative board isn't available yet", async ({ page }) => {
    await page.goto("/quadro-colaborativo");
    await expect(page.getByRole("heading", { name: "Quadro colaborativo" })).toBeVisible();
    await expect(
      page.getByText("Quadro colaborativo ainda não está disponível neste app.")
    ).toBeVisible();
  });

  test("a session page also explains the collaborative board isn't available yet", async ({ page }) => {
    await page.goto("/quadro-colaborativo/00000000-0000-0000-0000-000000000000");
    await expect(
      page.getByText("Quadro colaborativo ainda não está disponível neste app.")
    ).toBeVisible();
  });

  test("navbar (under 'Mais') links to /quadro-colaborativo", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("button", { name: "Mais" }).click();
    await expect(page.getByRole("link", { name: "Quadro colaborativo" })).toHaveAttribute(
      "href",
      "/quadro-colaborativo"
    );
  });
});
