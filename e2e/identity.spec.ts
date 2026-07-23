import { test, expect } from "@playwright/test";

test.describe("identity verification (no Stripe Identity configured in this environment)", () => {
  test("/verificar-identidade explains verification isn't available yet", async ({ page }) => {
    await page.goto("/verificar-identidade");
    await expect(page.getByRole("heading", { name: "Verificação de identidade" })).toBeVisible();
    await expect(
      page.getByText("A verificação de identidade ainda não está disponível neste app — volte em breve.")
    ).toBeVisible();
    await expect(page.getByRole("button", { name: "Iniciar verificação" })).toHaveCount(0);
  });

  test("/api/identity/create-session reports not configured rather than erroring", async ({ request }) => {
    const response = await request.post("/api/identity/create-session");
    expect(response.status()).toBe(503);
    expect(await response.json()).toEqual({ error: "not_configured" });
  });

  test("a consent link with an unknown token shows the invalid state", async ({ page }) => {
    await page.goto("/consentimento/nao-existe");
    await expect(page.getByRole("heading", { name: "Link não encontrado" })).toBeVisible();
  });
});
