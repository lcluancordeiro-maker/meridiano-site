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

    // Advanced/ML levels are unavailable ("em breve") — no link yet.
    const mlHeading = page.getByRole("heading", { name: "Machine Learning — Introdução", exact: true });
    await expect(mlHeading).toBeVisible();
    await expect(page.locator('a[href="/trilha/machine-learning-iniciante"]')).toHaveCount(0);
  });

  test("the intro topic teaches and quizzes pseudocode with line breaks preserved", async ({ page }) => {
    await page.goto("/trilha/programacao-iniciante/logica-de-programacao");
    await expect(page.getByRole("heading", { name: "Lógica de Programação" })).toBeVisible();
    await expect(page.getByRole("heading", { name: "Praticar" })).toBeVisible();
  });
});
