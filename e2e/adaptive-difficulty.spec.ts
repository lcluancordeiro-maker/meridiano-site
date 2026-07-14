import { test, expect } from "@playwright/test";

// Fixed to fundamental-2/fracoes' "facil" tier (see src/data/curriculum.ts):
// f1 "1/2", f2 "3/5", f3 "1/2", f4 multiple-choice "1/2", f5 "1/3", f6 "1/6".
const FRACOES_FACIL_ANSWERS = [
  { value: "1/2", type: "numeric" as const },
  { value: "3/5", type: "numeric" as const },
  { value: "1/2", type: "numeric" as const },
  { value: "1/2", type: "multiple-choice" as const },
  { value: "1/3", type: "numeric" as const },
  { value: "1/6", type: "numeric" as const },
];

test.describe("adaptive difficulty recommendation", () => {
  test("recommends Fácil for a topic with no prior attempts", async ({ page }) => {
    await page.goto("/trilha/fundamental-2/fracoes");
    await page.waitForLoadState("networkidle");
    await expect(page.getByRole("button", { name: "Fácil (recomendado)" })).toBeVisible();
    await expect(page.getByRole("button", { name: "Médio (recomendado)" })).toHaveCount(0);
  });

  test("moves the recommendation to Médio after Fácil is mastered", async ({ page }) => {
    await page.goto("/trilha/fundamental-2/fracoes");
    await page.waitForLoadState("networkidle");
    await page.getByRole("button", { name: /^Fácil/ }).click();

    for (let i = 0; i < FRACOES_FACIL_ANSWERS.length; i++) {
      const { value, type } = FRACOES_FACIL_ANSWERS[i];
      if (type === "multiple-choice") {
        await page.getByRole("button", { name: value, exact: true }).click();
      } else {
        await page.getByPlaceholder("Digite sua resposta").fill(value);
      }
      await page.getByRole("button", { name: "Verificar" }).click();
      const isLast = i === FRACOES_FACIL_ANSWERS.length - 1;
      await page.getByRole("button", { name: isLast ? "Ver resultado" : "Próxima" }).click();
    }
    await expect(page.getByText("6 de 6 (100%)")).toBeVisible();

    await page.goto("/trilha/fundamental-2/fracoes");
    await page.waitForLoadState("networkidle");
    await expect(page.getByRole("button", { name: "Médio (recomendado)" })).toBeVisible();
    await expect(page.getByRole("button", { name: "Fácil (recomendado)" })).toHaveCount(0);
  });
});
