import { test, expect } from "@playwright/test";

test.describe("busca global no currículo (Navbar)", () => {
  test("opens the search overlay and finds a topic by title, navigating to it", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("button", { name: "Buscar no currículo" }).click();

    const input = page.getByPlaceholder("Buscar tópicos em todas as trilhas...");
    await expect(input).toBeVisible();
    await input.fill("Frações");

    // Several tracks have a topic whose title contains "Frações" — the
    // exact-title match ("Frações", Fundamental II) ranks first.
    const result = page.getByRole("button", { name: /Frações/ }).first();
    await expect(result).toBeVisible();
    await result.click();

    await expect(page).toHaveURL(/\/trilha\/fundamental-2\/fracoes$/);
  });

  test("shows a hint for an empty query and a not-found message for a nonsense query", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("button", { name: "Buscar no currículo" }).click();

    await expect(page.getByText(/Digite para buscar um tópico/)).toBeVisible();

    const input = page.getByPlaceholder("Buscar tópicos em todas as trilhas...");
    await input.fill("xyzzyquantumnonsense");
    await expect(page.getByText(/Nenhum tópico encontrado/)).toBeVisible();
  });

  test("Escape closes the overlay", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("button", { name: "Buscar no currículo" }).click();
    const input = page.getByPlaceholder("Buscar tópicos em todas as trilhas...");
    await expect(input).toBeVisible();
    await input.press("Escape");
    await expect(input).not.toBeVisible();
  });

  test("Enter navigates to the first/active result", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("button", { name: "Buscar no currículo" }).click();
    const input = page.getByPlaceholder("Buscar tópicos em todas as trilhas...");
    await input.fill("Frações");
    await expect(page.getByRole("button", { name: /Frações/ }).first()).toBeVisible();
    await input.press("Enter");
    await expect(page).toHaveURL(/\/trilha\/fundamental-2\/fracoes$/);
  });
});
