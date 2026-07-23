import { test, expect } from "@playwright/test";

// f1 in medio/funcao-primeiro-grau: "Dada f(x) = 2x + 3, qual o valor de f(2)?"
// answer "7", with a commonMistakeHint set (see src/data/curriculum.ts).
test.describe("smarter wrong-answer feedback (commonMistakeHint)", () => {
  test("first wrong attempt shows a hint instead of the answer; second reveals it", async ({ page }) => {
    await page.goto("/trilha/medio/funcao-primeiro-grau");
    await page.getByRole("button", { name: /^Fácil/ }).click();

    await page.getByPlaceholder("Digite sua resposta").fill("5");
    await page.getByRole("button", { name: "Verificar" }).click();

    await expect(page.getByText("Quase lá! Dica:")).toBeVisible();
    await expect(
      page.getByText("Substitua x=2 na expressão: primeiro calcule 2×2, depois some 3.")
    ).toBeVisible();
    await expect(page.getByText("Resposta correta: 7")).toHaveCount(0);
    // Still not locked in — input stays editable and "Verificar" is still the button.
    await expect(page.getByRole("button", { name: "Verificar" })).toBeVisible();
    await expect(page.getByRole("button", { name: "Próxima" })).toHaveCount(0);

    await page.getByPlaceholder("Digite sua resposta").fill("6");
    await page.getByRole("button", { name: "Verificar" }).click();

    await expect(page.getByText("Resposta correta: 7")).toBeVisible();
    await expect(page.getByRole("button", { name: "Próxima" })).toBeVisible();
  });

  test("getting it right after seeing the hint still awards XP and advances normally", async ({ page }) => {
    await page.goto("/trilha/medio/funcao-primeiro-grau");
    await page.getByRole("button", { name: /^Fácil/ }).click();

    await page.getByPlaceholder("Digite sua resposta").fill("5");
    await page.getByRole("button", { name: "Verificar" }).click();
    await expect(page.getByText("Quase lá! Dica:")).toBeVisible();

    await page.getByPlaceholder("Digite sua resposta").fill("7");
    await page.getByRole("button", { name: "Verificar" }).click();

    await expect(page.getByText("Certinho!")).toBeVisible();
    await expect(page.getByText("+5 XP")).toBeVisible();
  });

  test("exercises without a hint keep the original immediate-reveal behavior", async ({ page }) => {
    // fundamental-2/fracoes has no commonMistakeHint set anywhere.
    await page.goto("/trilha/fundamental-2/fracoes");
    await page.getByRole("button", { name: /^Médio/ }).click();

    await page.getByPlaceholder("Digite sua resposta").fill("9/9");
    await page.getByRole("button", { name: "Verificar" }).click();

    await expect(page.getByText("Resposta correta: 2/3")).toBeVisible();
    await expect(page.getByText("Quase lá! Dica:")).toHaveCount(0);
  });
});
