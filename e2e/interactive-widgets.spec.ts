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

  test("unit circle explorer updates sen/cos/tan as you move the angle slider", async ({ page }) => {
    await page.goto("/trilha/medio/trigonometria-triangulo-retangulo");
    await expect(page.getByText("Explore ao vivo")).toBeVisible();
    await expect(page.getByText("θ = 30°")).toBeVisible();
    await expect(page.getByText("sen(θ) = 0.5 · cos(θ) = 0.9 · tan(θ) = 0.6")).toBeVisible();

    const angleSlider = page.getByRole("slider", { name: /Ângulo θ/ });
    await angleSlider.fill("90");
    // The theory blurb itself mentions "θ = 90°" as an example, so this needs
    // an exact match to hit only the widget's live readout, not that prose.
    await expect(page.getByText("θ = 90°", { exact: true })).toBeVisible();
    await expect(page.getByText("sen(θ) = 1 · cos(θ) = 0.0 · tan(θ) indefinida")).toBeVisible();
  });

  test("fraction visualizer shows the simplified form as you move the sliders", async ({ page }) => {
    await page.goto("/trilha/fundamental-2/fracoes");
    await expect(page.getByText("Explore ao vivo")).toBeVisible();

    const numeratorSlider = page.getByRole("slider", { name: /Numerador/ });
    await numeratorSlider.fill("2");
    await expect(page.getByText("1/2 simplificada")).toBeVisible();

    const denominatorSlider = page.getByRole("slider", { name: /Denominador/ });
    await denominatorSlider.fill("6");
    await expect(page.getByText("1/3 simplificada")).toBeVisible();
  });

  test("probability spinner updates P(A) as you move the sliders", async ({ page }) => {
    await page.goto("/trilha/estatistica-iniciante/graficos-e-frequencias");
    await expect(page.getByText("Explore ao vivo")).toBeVisible();
    await expect(page.getByText("P(A) = 3/8 = 38%")).toBeVisible();

    const totalSlider = page.getByRole("slider", { name: /Casos possíveis/ });
    await totalSlider.fill("4");
    await expect(page.getByText("P(A) = 3/4 = 75%")).toBeVisible();

    const favorableSlider = page.getByRole("slider", { name: /Casos favoráveis/ });
    await favorableSlider.fill("4");
    await expect(page.getByText("P(A) = 4/4 = 100%")).toBeVisible();
  });

  test("mean/median explorer recalculates as you move a data point slider", async ({ page }) => {
    await page.goto("/trilha/estatistica-iniciante/medidas-tendencia-central");
    await expect(page.getByText("Explore ao vivo")).toBeVisible();
    // Defaults: 4, 7, 9, 12, 15 → mean 9.4, median 9.
    await expect(page.getByText("Média = 9.4 · Mediana = 9")).toBeVisible();

    const firstValueSlider = page.getByRole("slider", { name: /Valor 1/ });
    await firstValueSlider.fill("20");
    // Values become 20, 7, 9, 12, 15 → mean 12.6, median 12.
    await expect(page.getByText("Média = 12.6 · Mediana = 12")).toBeVisible();
  });

  test("pythagorean explorer recalculates the hypotenuse as you move a leg slider", async ({ page }) => {
    await page.goto("/trilha/fundamental-2/geometria-plana");
    await expect(page.getByText("Explore ao vivo")).toBeVisible();
    await expect(page.getByText("a² = 3² + 4² = 25 → a = 5")).toBeVisible();

    const leg1Slider = page.getByRole("slider", { name: /Cateto 1/ });
    await leg1Slider.fill("5");
    await expect(page.getByText("a² = 5² + 4² = 41 → a = 6.4")).toBeVisible();
  });

  test("sequence explorer switches between PA and PG and recalculates the terms", async ({ page }) => {
    await page.goto("/trilha/medio/progressoes");
    await expect(page.getByText("Explore ao vivo")).toBeVisible();
    await expect(page.getByText("an = 2 + (n-1)×3")).toBeVisible();
    await expect(
      page.getByRole("img", { name: "Termos da sequência: 2, 5, 8, 11, 14, 17" })
    ).toBeVisible();

    // Uses the widget's aria-label (not its "PG" visible text) since a
    // real quiz exercise on this same page has a multiple-choice option
    // literally labeled "PG" — an exact-name query would be ambiguous.
    await page.getByRole("button", { name: "Mostrar progressão geométrica (PG)" }).click();
    await expect(page.getByText("an = 2 × 2^(n-1)")).toBeVisible();
    await expect(
      page.getByRole("img", { name: "Termos da sequência: 2, 4, 8, 16, 32, 64" })
    ).toBeVisible();
  });
});

// The normal-distribution explorer lives on a Premium topic
// (Estatística — Avançado), which shows a paywall instead of theory in
// this test environment (no Supabase/Stripe configured) — same
// limitation as the compound-interest/tangent-line explorers below.
// Verified manually by temporarily flipping `premium: false` on the
// level, confirming the live math, then reverting before commit.

// The compound-interest and tangent-line explorers live on Premium topics
// (Matemática Financeira — Avançado / Ensino Superior), which show a
// paywall instead of theory in this test environment (no Supabase/Stripe
// configured) — same limitation documented in exercises-correctness.spec.ts.
// Both were manually verified by temporarily flipping `premium: false` on
// their levels, confirming the live math, then reverting before commit.
