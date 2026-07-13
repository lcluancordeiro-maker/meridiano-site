import { test, expect } from "@playwright/test";

test.describe("auth pages (Supabase not configured in this environment)", () => {
  test("login page renders and explains accounts aren't available yet", async ({ page }) => {
    await page.goto("/entrar");
    await expect(page.getByRole("heading", { name: "Entrar" })).toBeVisible();
    await expect(page.getByText("Contas ainda não estão disponíveis")).toBeVisible();
  });

  test("signup page renders and explains accounts aren't available yet", async ({ page }) => {
    await page.goto("/cadastro");
    await expect(page.getByRole("heading", { name: "Criar conta" })).toBeVisible();
    await expect(page.getByText("Contas ainda não estão disponíveis")).toBeVisible();
  });

  test("navbar shows an 'Entrar' link when logged out", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByRole("link", { name: "Entrar" })).toHaveAttribute("href", "/entrar");
  });
});
