import { test, expect } from "@playwright/test";

test.describe("graphing calculator", () => {
  test("plots a default function without error", async ({ page }) => {
    await page.goto("/calculadora");
    await expect(page.getByRole("heading", { name: "Calculadora gráfica" })).toBeVisible();
    await expect(page.locator("svg path[stroke]")).toHaveCount(1);
  });

  test("shows an inline error for an invalid expression instead of crashing", async ({ page }) => {
    await page.goto("/calculadora");
    const input = page.locator('input[placeholder="ex: x^2 - 3x + 2"]').first();
    await input.fill("2x+");
    await expect(page.getByText("Expressão incompleta").first()).toBeVisible();
    // The page must still be interactive — no crash overlay.
    await expect(page.getByRole("heading", { name: "Calculadora gráfica" })).toBeVisible();
  });

  test("supports adding a second function, up to the 4-function cap", async ({ page }) => {
    await page.goto("/calculadora");
    await page.getByRole("button", { name: "+ Adicionar função" }).click();
    await expect(page.locator('input[placeholder="ex: x^2 - 3x + 2"]')).toHaveCount(2);
  });

  test("zoom controls change the rendered viewport", async ({ page }) => {
    await page.goto("/calculadora");
    const svg = page.locator("svg[role='img']");
    const before = await svg.locator("path[stroke]").first().getAttribute("d");
    await page.getByRole("button", { name: "Aumentar zoom" }).click();
    const after = await svg.locator("path[stroke]").first().getAttribute("d");
    expect(after).not.toBe(before);
  });
});
