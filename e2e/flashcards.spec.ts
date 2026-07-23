import { test, expect } from "@playwright/test";

// Quick-review flip-card deck shown on a handful of topic pages (the same
// pilot set as the curated video lessons) — flipping reveals the back,
// "Próximo" advances to the next card and resets the flip state.
test.describe("cartões de revisão (flashcards) on a topic page", () => {
  test("a topic with flashcards shows the deck, flips, and advances", async ({ page }) => {
    await page.goto("/trilha/fundamental-2/fracoes");
    await expect(page.getByRole("heading", { name: "Cartões de revisão" })).toBeVisible();
    await expect(page.getByText("1 de 6")).toBeVisible();

    const card = page.getByTestId("flashcard");
    await expect(card).toContainText("Fração");
    await card.click();
    await expect(card).toContainText("Representa uma parte de um todo");

    await page.getByRole("button", { name: "Próximo →" }).click();
    await expect(page.getByText("2 de 6")).toBeVisible();
    await expect(card).toContainText("Frações equivalentes");
  });

  test("a topic without flashcards shows no deck", async ({ page }) => {
    await page.goto("/trilha/fundamental-2/numeros-inteiros");
    await expect(page.getByRole("heading", { name: "Cartões de revisão" })).toHaveCount(0);
  });
});
