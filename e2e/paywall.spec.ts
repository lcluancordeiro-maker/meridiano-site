import { test, expect } from "@playwright/test";

test.describe("premium paywall (no Supabase/Stripe configured in this environment)", () => {
  test("a premium topic shows the paywall instead of theory and exercises", async ({ page }) => {
    await page.goto("/trilha/estatistica-intermediario/probabilidade-basica");
    await expect(page.getByRole("heading", { name: "Conteúdo Premium" })).toBeVisible();
    await expect(page.getByText("Esse tópico faz parte do plano Premium.")).toBeVisible();
    await expect(page.getByRole("link", { name: "Assinar Premium" })).toHaveAttribute(
      "href",
      "/assinatura"
    );
    // The gated content must not render.
    await expect(page.getByRole("heading", { name: "Praticar" })).toHaveCount(0);
  });

  test("a premium level page shows an upsell banner but still lists its topics", async ({ page }) => {
    await page.goto("/trilha/estatistica-intermediario");
    await expect(page.getByRole("heading", { name: "Estatística — Intermediário" })).toBeVisible();
    await expect(page.getByText("Esse tópico faz parte do plano Premium.")).toBeVisible();
    await expect(page.getByRole("link", { name: /Probabilidade Básica/ })).toBeVisible();
  });

  test("a free level is unaffected by the paywall", async ({ page }) => {
    await page.goto("/trilha/fundamental-2/numeros-inteiros");
    await expect(page.getByRole("heading", { name: "Conteúdo Premium" })).toHaveCount(0);
    await expect(page.getByRole("heading", { name: "Praticar" })).toBeVisible();
  });

  test("the home page marks premium tracks with a badge", async ({ page }) => {
    await page.goto("/");
    const card = page.locator("a", { hasText: "Estatística — Intermediário" });
    await expect(card.getByText("Premium", { exact: true })).toBeVisible();
  });

  test("/assinatura explains subscriptions aren't available yet", async ({ page }) => {
    await page.goto("/assinatura");
    await expect(page.getByRole("heading", { name: "Assinatura Premium" })).toBeVisible();
    await expect(
      page.getByText("Assinaturas ainda não estão disponíveis neste app")
    ).toBeVisible();
  });

  test("navbar links to /assinatura", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByRole("link", { name: "Premium", exact: true })).toHaveAttribute(
      "href",
      "/assinatura"
    );
  });
});
