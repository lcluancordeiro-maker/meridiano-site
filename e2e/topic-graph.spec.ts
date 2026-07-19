import { test, expect } from "@playwright/test";

// A handful of topics render an inline FunctionGrapher via
// topic.graphExpressions (LazyFunctionGrapher, code-split same as the
// interactive widgets) — confirms it actually loads and plots on a real
// topic page, not just on the dedicated /calculadora page.
test.describe("inline function grapher on a topic page", () => {
  test("Introdução à Álgebra plots its graph expression", async ({ page }) => {
    await page.goto("/trilha/fundamental-2/introducao-algebra");
    await expect(page.getByText("Explore no gráfico")).toBeVisible();
    await expect(page.locator("svg path[stroke]")).toHaveCount(1);
  });
});
