import { test, expect } from "@playwright/test";

// Fixed to vestibular-enem/simulado-enem's Fácil tier (see
// src/data/curriculum/topics/vestibular-enem.ts): f1 "R$50", f2 "120",
// f3 "12", f4 "R$15", f5 "10" — all multiple-choice.
const ENEM_SIMULADO_FACIL_ANSWERS = ["R$50", "120", "12", "R$15", "10"];

test.describe("plano de estudos por objetivo", () => {
  test("lists goals and opens a week-by-week plan for one", async ({ page }) => {
    await page.goto("/plano-de-estudos");
    await expect(page.getByRole("heading", { name: "Plano de estudos" })).toBeVisible();

    await page.getByRole("link", { name: /ENEM em 8 semanas/ }).click();
    await expect(page).toHaveURL(/\/plano-de-estudos\?meta=vestibular-enem-8$/);
    await expect(page.getByText("Progresso do plano")).toBeVisible();
    await expect(page.getByText("0%")).toBeVisible();
    await expect(page.getByText("Semana 1")).toBeVisible();
    await expect(
      page.getByRole("link", { name: /Simulado ENEM: Matemática e suas Tecnologias.*Fácil/ }).first()
    ).toBeVisible();
  });

  test("completing a topic's tier marks the matching plan item done and advances progress", async ({
    page,
  }) => {
    await page.goto("/trilha/vestibular-enem/simulado-enem");
    await page.waitForLoadState("networkidle");
    await page.getByRole("button", { name: /^Fácil/ }).click();

    for (let i = 0; i < ENEM_SIMULADO_FACIL_ANSWERS.length; i++) {
      await page.getByRole("button", { name: ENEM_SIMULADO_FACIL_ANSWERS[i], exact: true }).click();
      await page.getByRole("button", { name: "Verificar" }).click();
      const isLast = i === ENEM_SIMULADO_FACIL_ANSWERS.length - 1;
      await page.getByRole("button", { name: isLast ? "Ver resultado" : "Próxima" }).click();
    }

    await page.goto("/plano-de-estudos?meta=vestibular-enem-8");
    await expect(page.getByText("Progresso do plano")).toBeVisible();
    await expect(page.getByText("8%")).toBeVisible(); // 1 of 12 items (3 topics × 4 tiers)

    const doneItem = page.getByRole("link", {
      name: /Simulado ENEM: Matemática e suas Tecnologias.*Fácil/,
    });
    await expect(doneItem).toContainText("✅");

    // The "Continuar" CTA now points at the next not-done item, not the
    // one just finished.
    await expect(page.getByRole("link", { name: /^Continuar:/ })).not.toContainText(
      "Simulado ENEM: Matemática e suas Tecnologias (Fácil)"
    );
  });

  test("navbar (under 'Mais') links to /plano-de-estudos", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("button", { name: "Mais" }).click();
    await page.getByRole("link", { name: "Plano de estudos" }).click();
    await expect(page).toHaveURL("/plano-de-estudos");
  });
});
