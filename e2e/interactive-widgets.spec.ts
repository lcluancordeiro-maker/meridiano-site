import { test, expect } from "@playwright/test";

const WIDGET_SIZE = 320;
const RANGE = 8;

function toPx(x: number): number {
  return ((x + RANGE) / (2 * RANGE)) * WIDGET_SIZE;
}

function toPy(y: number): number {
  return WIDGET_SIZE - ((y + RANGE) / (2 * RANGE)) * WIDGET_SIZE;
}

test.describe("interactive widgets (inspired by Brilliant.org)", () => {
  test("slope explorer updates the line equation as you move the sliders", async ({ page }) => {
    await page.goto("/trilha/medio/funcao-primeiro-grau");
    await expect(page.getByText("Explore ao vivo")).toBeVisible();
    await expect(page.getByText("f(x) = 2x + 1")).toBeVisible();
    await expect(page.getByText("Crescente — corta o eixo y em (0, 1).")).toBeVisible();

    const aSlider = page.getByRole("slider", { name: /Coeficiente angular/ });
    await aSlider.fill("-3");
    await expect(page.getByText("f(x) = -3x + 1")).toBeVisible();
    await expect(page.getByText("Decrescente — corta o eixo y em (0, 1).")).toBeVisible();

    const bSlider = page.getByRole("slider", { name: /Coeficiente linear/ });
    await bSlider.fill("4");
    await expect(page.getByText("f(x) = -3x + 4")).toBeVisible();
  });

  test("two-point explorer recalculates distance/midpoint/slope as you drag a point", async ({ page }) => {
    await page.goto("/trilha/medio/geometria-analitica");
    await expect(page.getByText("Explore ao vivo")).toBeVisible();
    await expect(page.getByText("8.60")).toBeVisible(); // initial A(-3,-2)/B(4,3)

    const svg = page.getByRole("img", { name: "Gráfico com dois pontos arrastáveis, A e B" });
    await svg.scrollIntoViewIfNeeded();
    const box = await svg.boundingBox();
    if (!box) throw new Error("widget svg has no bounding box");
    const scaleX = box.width / WIDGET_SIZE;
    const scaleY = box.height / WIDGET_SIZE;

    // Drag point A from (-3, -2) to (0, -1).
    const startX = box.x + toPx(-3) * scaleX;
    const startY = box.y + toPy(-2) * scaleY;
    const endX = box.x + toPx(0) * scaleX;
    const endY = box.y + toPy(-1) * scaleY;

    await page.mouse.move(startX, startY);
    await page.mouse.down();
    await page.mouse.move(endX, endY, { steps: 5 });
    await page.mouse.up();

    // New A(0,-1), B(4,3): distance = sqrt(32) = 5.66, midpoint = (2, 1), slope = 1.
    await expect(page.getByText("5.66")).toBeVisible();
    await expect(page.getByText("(2, 1)")).toBeVisible();
  });

  test("quadratic explorer updates the parabola equation and vertex as you move the sliders", async ({ page }) => {
    await page.goto("/trilha/medio/funcao-quadratica");
    await expect(page.getByText("Explore ao vivo")).toBeVisible();
    await expect(page.getByText("f(x) = 1x² − 2x − 3")).toBeVisible();
    await expect(page.getByText("Concavidade para cima (mínimo) — vértice em (1, -4).")).toBeVisible();

    const aSlider = page.getByRole("slider", { name: /Coeficiente a:/ });
    await aSlider.fill("2");
    await expect(page.getByText("f(x) = 2x² − 2x − 3")).toBeVisible();
    await expect(page.getByText("Concavidade para cima (mínimo) — vértice em (0.5, -3.5).")).toBeVisible();

    const cSlider = page.getByRole("slider", { name: /Coeficiente c:/ });
    await cSlider.fill("5");
    await expect(page.getByText("f(x) = 2x² − 2x + 5")).toBeVisible();
  });
});
