import { test, expect } from "@playwright/test";

test.describe("turmas (Supabase not configured in this environment)", () => {
  test("/turmas explains classes aren't available yet", async ({ page }) => {
    await page.goto("/turmas");
    await expect(page.getByRole("heading", { name: "Turmas" })).toBeVisible();
    await expect(
      page.getByText("Turmas ainda não estão disponíveis neste app")
    ).toBeVisible();
  });

  test("a turma detail page also explains classes aren't available yet", async ({ page }) => {
    await page.goto("/turmas/00000000-0000-0000-0000-000000000000");
    await expect(
      page.getByText("Turmas ainda não estão disponíveis neste app")
    ).toBeVisible();
  });

  test("navbar links to /turmas", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByRole("link", { name: "Turmas", exact: true })).toHaveAttribute(
      "href",
      "/turmas"
    );
  });
});
