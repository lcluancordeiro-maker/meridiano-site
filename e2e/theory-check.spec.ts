import { test, expect } from "@playwright/test";

// "Verifique se entendeu" — Brilliant-style interleaving: quick one-tap
// comprehension checks rendered inline right after theory sections, so the
// student answers something after (almost) every concept instead of reading
// all the theory before practicing.
test.describe("theory check questions (interleaved learn-by-doing)", () => {
  test("answering correctly shows the success feedback and explanation", async ({ page }) => {
    await page.goto("/trilha/medio/funcao-primeiro-grau");
    const check = page.getByTestId("theory-check").first();
    await check.scrollIntoViewIfNeeded();
    await check.getByRole("button", { name: "Decrescente, porque a = -5 é negativo" }).click();
    await expect(check.getByText("Certinho!")).toBeVisible();
    await expect(check.getByText(/Quem decide o crescimento é o coeficiente angular/)).toBeVisible();
  });

  test("answering wrong reveals the correct answer and locks the options", async ({ page }) => {
    await page.goto("/trilha/medio/funcao-primeiro-grau");
    const check = page.getByTestId("theory-check").first();
    await check.scrollIntoViewIfNeeded();
    await check.getByRole("button", { name: "Crescente, porque b = 1 é positivo" }).click();
    await expect(
      check.getByText("Resposta correta: Decrescente, porque a = -5 é negativo")
    ).toBeVisible();
    // One-tap check: after answering, the options can't be clicked again.
    await expect(
      check.getByRole("button", { name: "Crescente, porque -5x cresce com x" })
    ).toBeDisabled();
  });

  test("a topic can carry several checks, each answered independently", async ({ page }) => {
    await page.goto("/trilha/fundamental-2/fracoes");
    const checks = page.getByTestId("theory-check");
    await expect(checks).toHaveCount(3);

    await checks
      .nth(1)
      .getByRole("button", { name: "Encontrar um denominador comum (o MMC de 3 e 5)" })
      .click();
    await expect(checks.nth(1).getByText("Certinho!")).toBeVisible();
    // The other checks stay unanswered.
    await expect(checks.first().getByText("Certinho!")).not.toBeVisible();
    await expect(checks.nth(2).getByText("Certinho!")).not.toBeVisible();
  });
});
