import { test, expect } from "@playwright/test";

test.describe("privacy policy", () => {
  test("home footer links to the privacy policy page", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByRole("link", { name: "Política de Privacidade" })).toHaveAttribute(
      "href",
      "/privacidade"
    );
  });

  test("renders the policy sections", async ({ page }) => {
    await page.goto("/privacidade");
    await expect(page.getByRole("heading", { name: "Política de Privacidade" })).toBeVisible();
    await expect(page.getByRole("heading", { name: "2. Quais dados coletamos" })).toBeVisible();
    await expect(page.getByRole("heading", { name: "6. Seus direitos (art. 18 da LGPD)" })).toBeVisible();
  });
});
