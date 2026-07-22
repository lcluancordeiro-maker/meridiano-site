import { test, expect } from "@playwright/test";

// A "Baixar certificado" CTA appears on the level page once every topic has
// all four difficulty tiers completed — the same rollup SkillPath.tsx uses
// per-topic, just checked across the whole track (src/lib/levelCompletion.ts).
test.describe("certificado de conclusão de trilha", () => {
  test("hidden with no progress, appears once every topic/tier is completed", async ({ page }) => {
    await page.goto("/trilha/estatistica-iniciante");
    await expect(page.getByText("Trilha completa!")).toHaveCount(0);
    await expect(page.getByRole("link", { name: "Baixar certificado" })).toHaveCount(0);

    await page.addInitScript(() => {
      const tier = { completed: true, score: 6, total: 6, updatedAt: Date.now() };
      const entries: Record<string, typeof tier> = {};
      for (const topicId of [
        "medidas-tendencia-central",
        "medidas-de-dispersao",
        "graficos-e-frequencias",
        "amostragem-e-coleta-de-dados",
      ]) {
        for (const difficulty of ["facil", "medio", "dificil", "olimpiada"]) {
          entries[`estatistica-iniciante/${topicId}/${difficulty}`] = tier;
        }
      }
      window.localStorage.setItem("meridiano-math-progress", JSON.stringify(entries));
    });
    await page.goto("/trilha/estatistica-iniciante");
    await expect(page.getByText("Trilha completa!")).toBeVisible();
    const link = page.getByRole("link", { name: "Baixar certificado" });
    await expect(link).toBeVisible();
    await expect(link).toHaveAttribute("href", "/certificado/estatistica-iniciante");
  });

  test("one topic missing a tier keeps the certificate hidden", async ({ page }) => {
    await page.addInitScript(() => {
      const tier = { completed: true, score: 6, total: 6, updatedAt: Date.now() };
      const entries: Record<string, typeof tier> = {};
      for (const topicId of [
        "medidas-tendencia-central",
        "medidas-de-dispersao",
        "graficos-e-frequencias",
      ]) {
        for (const difficulty of ["facil", "medio", "dificil", "olimpiada"]) {
          entries[`estatistica-iniciante/${topicId}/${difficulty}`] = tier;
        }
      }
      // amostragem-e-coleta-de-dados stays untouched — one topic short.
      window.localStorage.setItem("meridiano-math-progress", JSON.stringify(entries));
    });
    await page.goto("/trilha/estatistica-iniciante");
    await expect(page.getByRole("link", { name: "Baixar certificado" })).toHaveCount(0);
  });
});
