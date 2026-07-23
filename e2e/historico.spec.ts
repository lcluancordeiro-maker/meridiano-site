import { test, expect } from "@playwright/test";

test.describe("histórico (Supabase not configured in this environment)", () => {
  test("requires an account and links to login/signup", async ({ page }) => {
    await page.goto("/historico");
    await expect(page.getByRole("heading", { name: "Histórico" })).toBeVisible();
    await expect(page.getByText("exclusiva para quem tem conta")).toBeVisible();
    await expect(page.getByRole("link", { name: "Fazer login" })).toHaveAttribute("href", "/entrar");
    await expect(page.getByRole("link", { name: "criar uma conta" })).toHaveAttribute("href", "/cadastro");
  });

  test("navbar (under 'Mais') links to the histórico page", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("button", { name: "Mais" }).click();
    await expect(page.getByRole("link", { name: "Histórico" })).toHaveAttribute("href", "/historico");
  });
});
