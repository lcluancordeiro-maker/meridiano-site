import { test, expect } from "@playwright/test";

test.describe("resolver por foto (Supabase not configured in this environment)", () => {
  test("requires an account and links to login/signup", async ({ page }) => {
    await page.goto("/foto");
    await expect(page.getByRole("heading", { name: "Resolver por foto" })).toBeVisible();
    await expect(page.getByText("exclusiva para quem tem conta")).toBeVisible();
    await expect(page.getByRole("link", { name: "Fazer login" })).toHaveAttribute("href", "/entrar");
    await expect(page.getByRole("link", { name: "criar uma conta" })).toHaveAttribute("href", "/cadastro");
  });

  test("navbar (under 'Mais') links to the foto page", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("button", { name: "Mais" }).click();
    await expect(page.getByRole("link", { name: "Resolver por foto" })).toHaveAttribute("href", "/foto");
  });
});
