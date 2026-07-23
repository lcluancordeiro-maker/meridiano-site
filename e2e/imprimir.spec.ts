import { test, expect } from "@playwright/test";

// A print-friendly exercise sheet for teachers — /imprimir/[nivel]/[topico]
// lists every exercise of a topic (with blank answer lines / lettered
// options) followed by a "Gabarito" answer key, and a "Baixar PDF" button
// that just calls window.print() (no server-side PDF generation).
test.describe("gerar PDF de exercícios (/imprimir)", () => {
  test("renders the exercise sheet with a print button and an answer key", async ({ page }) => {
    await page.goto("/imprimir/estatistica-iniciante/medidas-tendencia-central");
    await expect(
      page.getByRole("heading", { name: "Medidas de Tendência Central" })
    ).toBeVisible();
    await expect(page.getByRole("button", { name: "Baixar PDF" })).toBeVisible();
    await expect(page.getByRole("heading", { name: "Gabarito" })).toBeVisible();
    await expect(page.getByRole("link", { name: "← Voltar para o tópico" })).toHaveAttribute(
      "href",
      "/trilha/estatistica-iniciante/medidas-tendencia-central"
    );
  });

  test("is linked from the topic page", async ({ page }) => {
    await page.goto("/trilha/estatistica-iniciante/medidas-tendencia-central");
    await expect(page.getByRole("link", { name: "🖨️ Gerar PDF de exercícios" })).toHaveAttribute(
      "href",
      "/imprimir/estatistica-iniciante/medidas-tendencia-central"
    );
  });

  test("404s for an unknown topic", async ({ page }) => {
    const response = await page.goto("/imprimir/estatistica-iniciante/topico-inexistente");
    expect(response?.status()).toBe(404);
  });
});
