import { test, expect } from "@playwright/test";

// Fixed to the "fracoes" / medio exercise set (see src/data/curriculum.ts):
// q1 numeric "2/3", q2 numeric "2/3", q3 numeric "3/4",
// q4 multiple-choice "6/10", q5 numeric "1/2", q6 numeric "2".
const FRACOES_MEDIO_ANSWERS = [
  { value: "2/3", type: "numeric" as const },
  { value: "2/3", type: "numeric" as const },
  { value: "3/4", type: "numeric" as const },
  { value: "6/10", type: "multiple-choice" as const },
  { value: "1/2", type: "numeric" as const },
  { value: "2", type: "numeric" as const },
];

// No manual localStorage reset needed — Playwright already gives each test
// an isolated browser context with empty storage. (An addInitScript-based
// reset was tried here but it fires on *every* in-test navigation, which
// wipes state the test itself just wrote.)
test.describe("quiz flow", () => {
  test("lets the user choose a difficulty, then locks the quiz to that tier", async ({ page }) => {
    await page.goto("/trilha/fundamental-2/fracoes");
    await page.waitForLoadState("networkidle");
    await expect(page.getByRole("button", { name: /^Fácil/ })).toBeVisible();
    await expect(page.getByRole("button", { name: /^Médio/ })).toBeVisible();
    await expect(page.getByRole("button", { name: /^Difícil/ })).toBeVisible();
    await expect(page.getByRole("button", { name: /^Olimpíada/ })).toBeVisible();

    await page.getByRole("button", { name: /^Médio/ }).click();
    await expect(page.getByText("Nível:")).toContainText("Médio");
    await expect(page.getByText("Questão 1 de 6")).toBeVisible();
  });

  test("shows correct/incorrect feedback and awards XP for a right answer", async ({ page }) => {
    await page.goto("/trilha/fundamental-2/fracoes");
    await page.waitForLoadState("networkidle");
    await page.getByRole("button", { name: /^Médio/ }).click();

    // q1: "Simplifique 6/9" — answer 2/3.
    await page.getByPlaceholder("Digite sua resposta").fill("2/3");
    await page.getByRole("button", { name: "Verificar" }).click();
    await expect(page.getByText("Certinho!")).toBeVisible();
    await expect(page.getByText("+10 XP")).toBeVisible();
  });

  test("shows the correct answer on a wrong attempt", async ({ page }) => {
    await page.goto("/trilha/fundamental-2/fracoes");
    await page.waitForLoadState("networkidle");
    await page.getByRole("button", { name: /^Médio/ }).click();

    await page.getByPlaceholder("Digite sua resposta").fill("9/9");
    await page.getByRole("button", { name: "Verificar" }).click();
    await expect(page.getByText("Resposta correta: 2/3")).toBeVisible();
  });

  test("completing a perfect run shows the result screen with XP and a new badge", async ({
    page,
  }) => {
    await page.goto("/trilha/fundamental-2/fracoes");
    await page.waitForLoadState("networkidle");
    await page.getByRole("button", { name: /^Médio/ }).click();

    for (let i = 0; i < FRACOES_MEDIO_ANSWERS.length; i++) {
      const { value, type } = FRACOES_MEDIO_ANSWERS[i];
      if (type === "multiple-choice") {
        await page.getByRole("button", { name: value, exact: true }).click();
      } else {
        await page.getByPlaceholder("Digite sua resposta").fill(value);
      }
      await page.getByRole("button", { name: "Verificar" }).click();
      const isLast = i === FRACOES_MEDIO_ANSWERS.length - 1;
      await page.getByRole("button", { name: isLast ? "Ver resultado" : "Próxima" }).click();
    }

    await expect(page.getByText("6 de 6 (100%)")).toBeVisible();
    await expect(page.getByText("+60 XP nesta tentativa")).toBeVisible();
    await expect(page.getByText("Nova conquista")).toBeVisible();
    await expect(page.getByText("Primeiro passo")).toBeVisible();
  });

  test("navbar shows a level/streak badge only after some activity", async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("networkidle");
    await expect(page.getByText(/Nv\. \d/)).toHaveCount(0);

    await page.goto("/trilha/fundamental-2/fracoes");
    await page.waitForLoadState("networkidle");
    await page.getByRole("button", { name: /^Médio/ }).click();
    await page.getByPlaceholder("Digite sua resposta").fill("2/3");
    await page.getByRole("button", { name: "Verificar" }).click();
    // Wait for the XP write to actually commit before navigating away.
    await expect(page.getByText("Certinho!")).toBeVisible();

    await page.goto("/");
    await expect(page.getByText(/Nv\. \d/)).toBeVisible();
  });
});
