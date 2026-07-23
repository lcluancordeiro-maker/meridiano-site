import { test, expect } from "@playwright/test";

// "Um pouco de história" notes on topic pages + /matematicos biographies,
// cross-linked both ways (note → biography → related topics).
test.describe("math history notes and mathematician biographies", () => {
  test("a topic page shows its historical note with links to biographies", async ({ page }) => {
    await page.goto("/trilha/fundamental-2/geometria-plana");
    await expect(page.getByText("Um pouco de história")).toBeVisible();
    await expect(page.getByText("Medir a terra deu nome à geometria")).toBeVisible();

    await page.getByRole("link", { name: /Pitágoras/ }).click();
    await expect(page).toHaveURL(/\/matematicos\/pitagoras$/);
    await expect(page.getByRole("heading", { name: "Pitágoras", exact: true })).toBeVisible();
    await expect(page.getByText("c. 570–495 a.C.")).toBeVisible();
  });

  test("/matematicos lists the figures and links to each biography", async ({ page }) => {
    await page.goto("/matematicos");
    await expect(page.getByRole("heading", { name: "Grandes matemáticos" })).toBeVisible();
    await expect(page.getByRole("link", { name: /Hipátia/ })).toBeVisible();

    await page.getByRole("link", { name: /Carl Friedrich Gauss/ }).click();
    await expect(page).toHaveURL(/\/matematicos\/gauss$/);
    await expect(page.getByText("O príncipe da matemática")).toBeVisible();
    await expect(page.getByText("Método dos mínimos quadrados (base da regressão linear)")).toBeVisible();
  });

  test("a biography links back to the related topics in the app", async ({ page }) => {
    await page.goto("/matematicos/gauss");
    await expect(page.getByText("Estude as ideias de Carl Friedrich Gauss no app")).toBeVisible();

    await page.getByRole("link", { name: /Progressões Aritméticas e Geométricas/ }).click();
    await expect(page).toHaveURL(/\/trilha\/medio\/progressoes$/);
    await expect(
      page.getByRole("heading", { name: "Progressões Aritméticas e Geométricas" })
    ).toBeVisible();
  });

  test("an unknown figure id 404s", async ({ page }) => {
    const response = await page.goto("/matematicos/nao-existe");
    expect(response?.status()).toBe(404);
  });
});
