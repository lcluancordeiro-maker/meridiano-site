import { test, expect } from "@playwright/test";
import { getDailyChallenge } from "../src/lib/dailyChallenge";

test.describe("daily challenge", () => {
  test("home page shows today's challenge and answering it locks in the result", async ({ page }) => {
    const problem = getDailyChallenge();
    test.skip(!problem, "no eligible problem for the daily challenge pool");

    await page.goto("/");
    await expect(page.getByText("Desafio do Dia")).toBeVisible();
    await expect(page.getByText(`${problem!.levelName} · ${problem!.topicTitle}`)).toBeVisible();

    if (problem!.exercise.type === "multiple-choice") {
      await page.getByRole("button", { name: problem!.exercise.answer, exact: true }).click();
    } else {
      await page.getByPlaceholder("Digite sua resposta").fill(problem!.exercise.answer);
    }
    await page.getByRole("button", { name: "Verificar" }).click();
    await expect(page.getByText("Certinho!")).toBeVisible();
    await expect(page.getByText("1 dia seguido")).toBeVisible();

    // Reload: already answered today — locked, no more inputs, streak persists.
    await page.reload();
    await expect(page.getByText("Certinho!")).toBeVisible();
    await expect(page.getByRole("button", { name: "Verificar" })).toHaveCount(0);
    await expect(page.getByText("1 dia seguido")).toBeVisible();
  });

  test("navbar and daily challenge coexist without breaking the home page", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByRole("link", { name: "Trilhas", exact: true })).toBeVisible();
    await expect(page.getByRole("heading", { level: 2, name: "Escolha seu nível de ensino" })).toBeVisible();
  });
});
