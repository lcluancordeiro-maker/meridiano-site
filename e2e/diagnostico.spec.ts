import { test, expect, type Page } from "@playwright/test";

// The diagnostic quiz (src/lib/diagnostic.ts) samples one fácil + one médio
// question from each of a track's first 4 topics and, based on the first
// miss, recommends where to actually start instead of always sending
// everyone to topic 1. Estatística — Iniciante has exactly 4 topics, so a
// perfect run exercises the "sample covers the whole track" edge case too.

async function answerCorrectly(page: Page, answer: string) {
  const numericInput = page.getByPlaceholder("Digite sua resposta");
  if (await numericInput.count()) {
    await numericInput.fill(answer);
  } else {
    await page.getByRole("button", { name: answer, exact: true }).click();
  }
  await page.getByRole("button", { name: "Verificar" }).click();
}

async function goNext(page: Page) {
  await page.getByRole("button", { name: /Próxima|Ver resultado/ }).click();
}

test.describe("teste de nivelamento (/diagnostico)", () => {
  test("level picker links into the quiz for a track", async ({ page }) => {
    await page.goto("/diagnostico");
    await expect(page.getByRole("heading", { name: "Teste de nivelamento" })).toBeVisible();
    await page.getByRole("link", { name: "Estatística — Iniciante" }).click();
    await expect(page).toHaveURL(/\/diagnostico\?trilha=estatistica-iniciante$/);
    await expect(page.getByText("Qual é a média de 2 e 4?")).toBeVisible();
    await expect(page.getByText("pergunta 1 de 8")).toBeVisible();
  });

  test("answering correctly shows feedback and advances to the next question", async ({ page }) => {
    await page.goto("/diagnostico?trilha=estatistica-iniciante");
    await page.getByPlaceholder("Digite sua resposta").fill("3");
    await page.getByRole("button", { name: "Verificar" }).click();
    await expect(page.getByText("Certinho!")).toBeVisible();
    await goNext(page);
    await expect(page.getByText("pergunta 2 de 8")).toBeVisible();
  });

  test("a wrong answer reveals the correct one", async ({ page }) => {
    await page.goto("/diagnostico?trilha=estatistica-iniciante");
    await page.getByPlaceholder("Digite sua resposta").fill("999");
    await page.getByRole("button", { name: "Verificar" }).click();
    await expect(page.getByText("Resposta certa: 3")).toBeVisible();
  });

  test("missing the first topic's fácil question recommends starting there at fácil", async ({ page }) => {
    await page.goto("/diagnostico?trilha=estatistica-iniciante");
    // Q1 (facil, "Medidas de Tendência Central"): answered wrong on purpose.
    await page.getByPlaceholder("Digite sua resposta").fill("999");
    await page.getByRole("button", { name: "Verificar" }).click();
    await goNext(page);

    const remainingAnswers = ["5", "7", "5", "4", "20", "População", "Estudar a população inteira costuma ser caro ou inviável"];
    for (const answer of remainingAnswers) {
      await answerCorrectly(page, answer);
      await goNext(page);
    }

    await expect(page.getByText("Resultado do teste")).toBeVisible();
    await expect(page.getByText("Você acertou 7 de 8 perguntas.")).toBeVisible();
    await expect(page.getByText("Medidas de Tendência Central")).toBeVisible();
    await expect(page.getByText("Fácil", { exact: true })).toBeVisible();
    await expect(page.getByRole("link", { name: "Começar por aqui" })).toHaveAttribute(
      "href",
      "/trilha/estatistica-iniciante/medidas-tendencia-central"
    );
  });

  test("a perfect run recommends the last topic at dificil, since the sample covers the whole track", async ({
    page,
  }) => {
    await page.goto("/diagnostico?trilha=estatistica-iniciante");
    const answers = ["3", "5", "7", "5", "4", "20", "População", "Estudar a população inteira costuma ser caro ou inviável"];
    for (const answer of answers) {
      await answerCorrectly(page, answer);
      await goNext(page);
    }

    await expect(page.getByText("Você acertou 8 de 8 perguntas.")).toBeVisible();
    await expect(page.getByText("Amostragem e Coleta de Dados")).toBeVisible();
    await expect(page.getByRole("link", { name: "Começar por aqui" })).toHaveAttribute(
      "href",
      "/trilha/estatistica-iniciante/amostragem-e-coleta-de-dados"
    );
  });

  test("navbar (under 'Mais') links to the diagnostic", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("button", { name: "Mais" }).click();
    await expect(page.getByRole("link", { name: "Teste de nivelamento" })).toHaveAttribute("href", "/diagnostico");
  });
});
