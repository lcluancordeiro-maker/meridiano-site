import { test, expect } from "@playwright/test";

// Pilot: a small set of exercises expose a second solution method (see
// AlternativeSolution in src/data/curriculum/types.ts) — a tab toggle next
// to the explanation once the exercise is checked. equacoes-segundo-grau/q2
// (Fundamental II, medio) has the Bhaskara explanation by default plus a
// "Fatoração" alternative.

test.describe("múltiplos métodos de solução (piloto)", () => {
  test("toggling to the alternative method swaps the explanation text, default method comes back on the next exercise", async ({
    page,
  }) => {
    await page.goto("/trilha/fundamental-2/equacoes-segundo-grau");
    await page.waitForLoadState("networkidle");
    await page.getByRole("button", { name: /^Médio/ }).click();

    // q1 has no alternative solutions — the toggle shouldn't appear.
    await expect(page.getByText("Qual o valor do discriminante")).toBeVisible();
    await page.getByPlaceholder("Digite sua resposta").fill("1");
    await page.getByRole("button", { name: "Verificar" }).click();
    await expect(page.getByRole("button", { name: "Método padrão" })).not.toBeVisible();
    await page.getByRole("button", { name: "Próxima" }).click();

    // q2: "Informe a menor raiz" — has a "Fatoração" alternative.
    await page.getByPlaceholder("Digite sua resposta").fill("2");
    await page.getByRole("button", { name: "Verificar" }).click();
    await expect(page.getByText(/Com Δ=1/)).toBeVisible();

    const defaultTab = page.getByRole("button", { name: "Método padrão" });
    const altTab = page.getByRole("button", { name: "Fatoração" });
    await expect(defaultTab).toBeVisible();
    await expect(altTab).toBeVisible();

    await altTab.click();
    await expect(page.getByText(/Procure dois números que somem 5/)).toBeVisible();
    await expect(page.getByText(/Com Δ=1/)).not.toBeVisible();

    await defaultTab.click();
    await expect(page.getByText(/Com Δ=1/)).toBeVisible();

    // Moving to the next exercise resets back to the default method.
    await page.getByRole("button", { name: "Próxima" }).click();
    await page.getByPlaceholder("Digite sua resposta").fill("3");
    await page.getByRole("button", { name: "Verificar" }).click();
    await expect(page.getByText(/Com Δ=1/)).toBeVisible();
  });
});
