import { test, expect } from "@playwright/test";

test.describe("Programação & Machine Learning track", () => {
  test("home page shows the track section, with the intro level linking out", async ({ page }) => {
    await page.goto("/");
    await expect(
      page.getByRole("heading", { level: 2, name: "Programação & Machine Learning" })
    ).toBeVisible();
    await expect(page.getByRole("link", { name: /Programação — Iniciante/ })).toHaveAttribute(
      "href",
      "/trilha/programacao-iniciante"
    );

    // Programação Avançado and Machine Learning are available now, but
    // Premium — the link exists and leads to the paywall (see paywall.spec.ts).
    await expect(page.getByRole("link", { name: /Machine Learning — Introdução/ })).toHaveAttribute(
      "href",
      "/trilha/machine-learning-iniciante"
    );
    await expect(page.getByRole("link", { name: /Programação — Avançado/ })).toHaveAttribute(
      "href",
      "/trilha/programacao-avancado"
    );
  });

  test("the intro topic teaches and quizzes pseudocode with line breaks preserved", async ({ page }) => {
    await page.goto("/trilha/programacao-iniciante/logica-de-programacao");
    await expect(page.getByRole("heading", { name: "Lógica de Programação" })).toBeVisible();
    await expect(page.getByRole("heading", { name: "Praticar" })).toBeVisible();
  });
});
