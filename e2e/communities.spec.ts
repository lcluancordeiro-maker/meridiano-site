import { test, expect } from "@playwright/test";

test.describe("communities (Supabase not configured in this environment)", () => {
  test("/comunidades explains communities aren't available yet", async ({ page }) => {
    await page.goto("/comunidades");
    await expect(page.getByRole("heading", { name: "Comunidades" })).toBeVisible();
    await expect(
      page.getByText("Comunidades ainda não estão disponíveis neste app — volte em breve.")
    ).toBeVisible();
  });

  test("a community detail route redirects back to /comunidades when not configured", async ({ page }) => {
    await page.goto("/comunidades/00000000-0000-0000-0000-000000000000");
    await expect(page).toHaveURL("/comunidades");
  });

  test("navbar (under 'Mais') links to /comunidades", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("button", { name: "Mais" }).click();
    await expect(page.getByRole("link", { name: "Comunidades", exact: true })).toHaveAttribute(
      "href",
      "/comunidades"
    );
  });
});
