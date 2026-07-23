import { test, expect } from "@playwright/test";

const STORAGE_KEY = "meridiano-math-review-schedule";

test.describe("spaced repetition review (/revisao)", () => {
  test("shows the empty state when nothing is due", async ({ page }) => {
    await page.goto("/revisao");
    await expect(page.getByText("Nada pendente por aqui!")).toBeVisible();
    await expect(page.getByRole("link", { name: "Ir para as trilhas" })).toBeVisible();
  });

  test("navbar links to /revisao", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("link", { name: "Revisão", exact: true }).click();
    await expect(page).toHaveURL(/\/revisao$/);
  });

  test("answering a due exercise records the review and moves to the completion screen", async ({ page }) => {
    await page.goto("/");
    await page.evaluate((key) => {
      const dueEntry = {
        levelId: "fundamental-2",
        topicId: "numeros-inteiros",
        exerciseId: "f1",
        difficulty: "facil",
        intervalDays: 1,
        dueAt: Date.now() - 1000,
        lastResult: "incorrect",
        updatedAt: Date.now() - 1000,
      };
      window.localStorage.setItem(key, JSON.stringify({ "fundamental-2/numeros-inteiros/f1": dueEntry }));
    }, STORAGE_KEY);

    await page.goto("/revisao");
    await expect(page.getByText("Revisão 1 de 1")).toBeVisible();
    await expect(page.getByText("Quanto é 5 + 3?")).toBeVisible();

    await page.getByPlaceholder("Digite sua resposta").fill("8");
    await page.getByRole("button", { name: "Verificar" }).click();
    await expect(page.getByText("Certinho!")).toBeVisible();

    await page.getByRole("button", { name: "Ver resultado" }).click();
    await expect(page.getByText("Revisão concluída!")).toBeVisible();
    await expect(page.getByText("Você revisou 1 exercício.")).toBeVisible();

    const stored = await page.evaluate(
      (key) => window.localStorage.getItem(key),
      STORAGE_KEY
    );
    const parsed = JSON.parse(stored ?? "{}");
    const entry = parsed["fundamental-2/numeros-inteiros/f1"];
    expect(entry.lastResult).toBe("correct");
    expect(entry.intervalDays).toBe(2);
    expect(entry.dueAt).toBeGreaterThan(Date.now());
  });
});
