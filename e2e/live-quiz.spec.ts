import { test, expect } from "@playwright/test";

test.describe("quiz ao vivo (Supabase not configured in this environment)", () => {
  test("/quiz-ao-vivo/entrar explains the live quiz isn't available yet", async ({ page }) => {
    await page.goto("/quiz-ao-vivo/entrar");
    await expect(page.getByRole("heading", { name: "Entrar em um quiz ao vivo" })).toBeVisible();
    await expect(
      page.getByText("Quiz ao vivo ainda não está disponível neste app.")
    ).toBeVisible();
  });

  test("a live quiz session page also explains it isn't available yet", async ({ page }) => {
    await page.goto("/quiz-ao-vivo/00000000-0000-0000-0000-000000000000");
    await expect(
      page.getByText("Quiz ao vivo ainda não está disponível neste app.")
    ).toBeVisible();
  });

  test("navbar (under 'Mais') links to /quiz-ao-vivo/entrar", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("button", { name: "Mais" }).click();
    await expect(page.getByRole("link", { name: "Quiz ao vivo" })).toHaveAttribute(
      "href",
      "/quiz-ao-vivo/entrar"
    );
  });
});
