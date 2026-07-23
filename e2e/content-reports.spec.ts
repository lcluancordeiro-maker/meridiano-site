import { test, expect } from "@playwright/test";

// "Reportar erro" appears after answering an exercise, letting a student
// flag it for manual review (content_reports table). Supabase isn't
// configured in this environment, so the actual submit fails silently
// (reportContent() returns {ok:false}) — these tests only cover the
// button/form UI, not a successful round trip to the database.
test.describe("reportar erro (content reports)", () => {
  test("appears only after checking an answer, and opens a comment form", async ({ page }) => {
    await page.goto("/trilha/medio/funcao-primeiro-grau");
    await page.getByRole("button", { name: /^Fácil/ }).click();

    await expect(page.getByRole("button", { name: "Reportar erro" })).toHaveCount(0);

    await page.getByPlaceholder("Digite sua resposta").fill("7");
    await page.getByRole("button", { name: "Verificar" }).click();

    const reportButton = page.getByRole("button", { name: "Reportar erro" });
    await expect(reportButton).toBeVisible();

    await reportButton.click();
    await expect(page.getByPlaceholder("O que parece errado? (opcional)")).toBeVisible();
    await expect(page.getByRole("button", { name: "Enviar" })).toBeVisible();

    await page.getByRole("button", { name: "Cancelar" }).click();
    await expect(page.getByPlaceholder("O que parece errado? (opcional)")).toHaveCount(0);
    await expect(page.getByRole("button", { name: "Reportar erro" })).toBeVisible();
  });
});
