import { test, expect } from "@playwright/test";

test.describe("knowledge graph (related topics + ask Gauss)", () => {
  test("shows related topics as links on a pilot topic page", async ({ page }) => {
    await page.goto("/trilha/medio/funcao-primeiro-grau");
    await expect(page.getByRole("heading", { name: "Tópicos relacionados" })).toBeVisible();
    await expect(page.getByRole("link", { name: "Função Quadrática" })).toHaveAttribute(
      "href",
      "/trilha/medio/funcao-quadratica"
    );
    await expect(page.getByRole("link", { name: "Geometria Analítica" })).toHaveAttribute(
      "href",
      "/trilha/medio/geometria-analitica"
    );
  });

  test("does not show the related-topics heading on a topic without any", async ({ page }) => {
    await page.goto("/trilha/fundamental-2/numeros-inteiros");
    await expect(page.getByRole("heading", { name: "Tópicos relacionados" })).toHaveCount(0);
  });

  test("clicking 'Ask Gauss about this' opens the tutor bubble", async ({ page }) => {
    await page.goto("/trilha/medio/funcao-primeiro-grau");
    await page.getByRole("button", { name: "Perguntar ao Gauss sobre isso" }).click();
    await expect(page.getByText("Gauss — seu tutor de IA")).toBeVisible();
  });
});
