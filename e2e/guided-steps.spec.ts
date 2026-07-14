import { test, expect } from "@playwright/test";

// "Resolver em etapas" — Brilliant-style scaffolding on harder exercises:
// a collapsible panel decomposes the problem into one-tap sub-steps shown
// one at a time. The panel never gates the real answer input, which stays
// the only graded part.
test.describe("guided multi-step problems (Resolver em etapas)", () => {
  test("expanding the panel reveals steps one at a time with feedback", async ({ page }) => {
    await page.goto("/trilha/fundamental-2/geometria-plana");
    await page.getByRole("button", { name: /^Difícil/ }).click();

    // d1 (catetos 9 e 12) is the first Difícil exercise.
    await page.getByRole("button", { name: "Resolver em etapas" }).click();
    const panel = page.getByTestId("guided-steps");
    await expect(panel.getByText("Etapa 1 de 3")).toBeVisible();
    await expect(panel.getByText("Etapa 2 de 3")).not.toBeVisible();

    await panel.getByRole("button", { name: "a² = 9² + 12² (Teorema de Pitágoras)" }).click();
    await expect(panel.getByText(/^Isso!/)).toBeVisible();
    await expect(panel.getByText("Etapa 2 de 3")).toBeVisible();

    // A wrong pick reveals the right value and still advances the sequence.
    await panel.getByRole("button", { name: "441" }).click();
    await expect(panel.getByText(/Na verdade: 225/)).toBeVisible();
    await expect(panel.getByText("Etapa 3 de 3")).toBeVisible();

    await panel.getByRole("button", { name: "15", exact: true }).click();

    // The scaffold never gates the real answer, which still grades normally.
    await page.getByPlaceholder("Digite sua resposta").fill("15");
    await page.getByRole("button", { name: "Verificar" }).click();
    await expect(page.getByText("Certinho!")).toBeVisible();
  });

  test("exercises without steps don't offer the panel", async ({ page }) => {
    await page.goto("/trilha/fundamental-2/geometria-plana");
    await page.getByRole("button", { name: /^Fácil/ }).click();
    await expect(page.getByRole("button", { name: "Resolver em etapas" })).toHaveCount(0);
  });
});
