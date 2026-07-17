import { test, expect } from "@playwright/test";

// /caminho/[nivel]/[topico] — a navigable "knowledge pathway" spiraling
// outward from a topic through its curated relatedTopics (ring 1) and each
// of those topics' own relatedTopics (ring 2), across levels/tracks. Every
// node stays a real link — either into the actual lesson or into that
// node's own pathway view (to keep exploring).
test.describe("knowledge pathway", () => {
  test("the real topic page links into its pathway view when it has related topics", async ({
    page,
  }) => {
    await page.goto("/trilha/medio/geometria-analitica");
    const entry = page.getByRole("link", { name: "Ver caminho de conhecimento completo →" });
    await expect(entry).toBeVisible();
    await entry.click();
    await expect(page).toHaveURL(/\/caminho\/medio\/geometria-analitica$/);
  });

  test("shows the center topic and its ring-1 connections, each linking to study or explore further", async ({
    page,
  }) => {
    await page.goto("/caminho/medio/geometria-analitica");
    await expect(page.getByText("Você está aqui")).toBeVisible();
    await expect(page.getByRole("heading", { name: "Geometria Analítica" })).toBeVisible();

    const nodes = page.getByTestId("pathway-node");
    await expect(nodes).toHaveCount(2);
    await expect(nodes.filter({ hasText: "Regressão Linear Simples" })).toBeVisible();
    await expect(nodes.filter({ hasText: "Função do 1º Grau" })).toBeVisible();
  });

  test("spirals a second hop across tracks: Ensino Médio → Econometria → Machine Learning", async ({
    page,
  }) => {
    await page.goto("/caminho/medio/geometria-analitica");
    const econometriaNode = page.getByTestId("pathway-node").filter({ hasText: "Regressão Linear Simples" });
    const ring2 = econometriaNode.getByTestId("pathway-ring2");
    await expect(ring2.getByText("Fundamentos de Aprendizado Supervisionado")).toBeVisible();
  });

  test("clicking 'Estudar' goes to the real lesson; clicking 'Explorar conexões' continues the pathway", async ({
    page,
  }) => {
    await page.goto("/caminho/medio/geometria-analitica");
    const econometriaNode = page.getByTestId("pathway-node").filter({ hasText: "Regressão Linear Simples" });

    await econometriaNode.getByRole("link", { name: "Explorar conexões" }).click();
    await expect(page).toHaveURL(/\/caminho\/econometria-iniciante\/regressao-linear-simples$/);
    await expect(page.getByRole("heading", { name: "Regressão Linear Simples" })).toBeVisible();

    await page.goBack();
    await page.getByTestId("pathway-node").filter({ hasText: "Regressão Linear Simples" }).getByRole("link", { name: "Estudar este tópico" }).click();
    await expect(page).toHaveURL(/\/trilha\/econometria-iniciante\/regressao-linear-simples$/);
  });

  test("a topic with no related topics shows the empty state, not a 404", async ({ page }) => {
    await page.goto("/caminho/fundamental-2/numeros-inteiros");
    await expect(page.getByText("Esse tópico ainda não tem conexões mapeadas.")).toBeVisible();
    await expect(page.getByTestId("pathway-node")).toHaveCount(0);
  });

  test("the back link returns to the real topic page", async ({ page }) => {
    await page.goto("/caminho/medio/geometria-analitica");
    await page.getByRole("link", { name: "← Voltar para o tópico" }).click();
    await expect(page).toHaveURL(/\/trilha\/medio\/geometria-analitica$/);
  });
});
