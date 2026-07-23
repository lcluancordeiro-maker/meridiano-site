import { test, expect } from "@playwright/test";

// The objects layer (BoardObjectsLayer.tsx) stacks on top of the ink canvas
// (DrawingCanvas.tsx) — shapes/text/images that can be selected, moved,
// resized and deleted independently, unlike freehand ink. These tests cover
// the new toolkit added alongside it: shapes, text, ruler, layers, zoom,
// and the merged PNG/SVG export.
test.describe("quadro: toolkit expandido", () => {
  test("shows the new tool groups", async ({ page }) => {
    await page.goto("/quadro");
    await expect(page.getByRole("button", { name: "Marca-texto" })).toBeVisible();
    await expect(page.getByRole("button", { name: "Selecionar" })).toBeVisible();
    await expect(page.getByRole("button", { name: "Linha" })).toBeVisible();
    await expect(page.getByRole("button", { name: "Retângulo" })).toBeVisible();
    await expect(page.getByRole("button", { name: "Elipse" })).toBeVisible();
    await expect(page.getByRole("button", { name: "Seta" })).toBeVisible();
    await expect(page.getByRole("button", { name: "Texto", exact: true })).toBeVisible();
    await expect(page.getByRole("button", { name: "Régua" })).toBeVisible();
    await expect(page.getByRole("button", { name: "Baixar SVG" })).toBeVisible();
  });

  test("drawing a rectangle auto-selects it and shows the delete button", async ({ page }) => {
    await page.goto("/quadro");
    const objectsCanvas = page.getByRole("img", { name: "Camada de formas e texto" });
    const box = await objectsCanvas.boundingBox();
    if (!box) throw new Error("no bounding box");

    await page.getByRole("button", { name: "Retângulo" }).click();
    await page.mouse.move(box.x + 30, box.y + 30);
    await page.mouse.down();
    await page.mouse.move(box.x + 150, box.y + 120);
    await page.mouse.up();

    // Drawing a shape auto-switches back to "Selecionar" and selects it.
    await expect(page.getByRole("button", { name: "Selecionar" })).toHaveAttribute("aria-pressed", "true");
    await expect(page.getByRole("button", { name: "Excluir" })).toBeVisible();

    await page.getByRole("button", { name: "Excluir" }).click();
    await expect(page.getByRole("button", { name: "Excluir" })).toHaveCount(0);
  });

  test("the texto tool opens an inline editor and commits a text object", async ({ page }) => {
    await page.goto("/quadro");
    const objectsCanvas = page.getByRole("img", { name: "Camada de formas e texto" });
    const box = await objectsCanvas.boundingBox();
    if (!box) throw new Error("no bounding box");

    await page.getByRole("button", { name: "Texto", exact: true }).click();
    await page.mouse.click(box.x + 60, box.y + 60);
    const editor = page.getByPlaceholder("Digite aqui…");
    await expect(editor).toBeVisible();
    await editor.fill("2x + 3 = 7");
    await editor.press("Enter");

    await expect(editor).toHaveCount(0);
    // Committing a text object auto-selects it, same as a shape.
    await expect(page.getByRole("button", { name: "Excluir" })).toBeVisible();
  });

  test("selecting a shape and pressing Delete removes it", async ({ page }) => {
    await page.goto("/quadro");
    const objectsCanvas = page.getByRole("img", { name: "Camada de formas e texto" });
    const box = await objectsCanvas.boundingBox();
    if (!box) throw new Error("no bounding box");

    await page.getByRole("button", { name: "Linha" }).click();
    await page.mouse.move(box.x + 20, box.y + 20);
    await page.mouse.down();
    await page.mouse.move(box.x + 200, box.y + 20);
    await page.mouse.up();

    await expect(page.getByRole("button", { name: "Excluir" })).toBeVisible();
    await page.keyboard.press("Delete");
    await expect(page.getByRole("button", { name: "Excluir" })).toHaveCount(0);
  });

  test("toggling the 'formas' layer off hides shapes from hit-testing while ink stays visible", async ({ page }) => {
    await page.goto("/quadro");
    const objectsCanvas = page.getByRole("img", { name: "Camada de formas e texto" });
    const box = await objectsCanvas.boundingBox();
    if (!box) throw new Error("no bounding box");

    await page.getByRole("button", { name: "Retângulo" }).click();
    await page.mouse.move(box.x + 30, box.y + 30);
    await page.mouse.down();
    await page.mouse.move(box.x + 150, box.y + 120);
    await page.mouse.up();

    // Deselect, then hide the "formas" layer.
    await page.getByRole("button", { name: "Selecionar" }).click();
    await page.mouse.click(box.x + 5, box.y + 5);
    await page.getByRole("checkbox", { name: "Formas/texto" }).uncheck();

    // Clicking where the rectangle was no longer selects anything.
    await page.mouse.click(box.x + 90, box.y + 75);
    await expect(page.getByRole("button", { name: "Excluir" })).toHaveCount(0);
  });

  test("the ruler toggle shows a draggable straightedge with a protractor option", async ({ page }) => {
    await page.goto("/quadro");
    await page.getByRole("button", { name: "Régua" }).click();
    await expect(page.getByRole("img", { name: "Régua" })).toBeVisible();
    await expect(page.getByRole("button", { name: "Transferidor" })).toBeVisible();

    await page.getByRole("button", { name: "Transferidor" }).click();
    // With the protractor on, the ruler shows a degree readout.
    await expect(page.getByText(/^\d+°$/)).toBeVisible();
  });

  test("zoom controls change the displayed percentage", async ({ page }) => {
    await page.goto("/quadro");
    await expect(page.getByText("100%")).toBeVisible();
    await page.getByRole("button", { name: "Aumentar zoom" }).click();
    await expect(page.getByText("125%")).toBeVisible();
    await page.getByRole("button", { name: "Diminuir zoom" }).click();
    await page.getByRole("button", { name: "Diminuir zoom" }).click();
    await expect(page.getByText("75%")).toBeVisible();
    await page.getByRole("button", { name: "Redefinir" }).click();
    await expect(page.getByText("100%")).toBeVisible();
  });

  test("baixar SVG downloads an SVG file", async ({ page }) => {
    await page.goto("/quadro");
    const downloadPromise = page.waitForEvent("download");
    await page.getByRole("button", { name: "Baixar SVG" }).click();
    const download = await downloadPromise;
    expect(download.suggestedFilename()).toBe("quadro-meridiano.svg");
  });

  test("drawing ink still works with the objects layer stacked on top", async ({ page }) => {
    await page.goto("/quadro");
    // Default tool is "pen" (an ink tool), so the ink canvas receives the
    // stroke even though BoardObjectsLayer's canvas is stacked above it.
    const inkCanvas = page.getByRole("img", { name: "Quadro de rascunho" });
    const box = await inkCanvas.boundingBox();
    if (!box) throw new Error("no bounding box");

    await page.mouse.move(box.x + 20, box.y + 20);
    await page.mouse.down();
    await page.mouse.move(box.x + 120, box.y + 120);
    await page.mouse.up();

    const pixel = await page.evaluate(() => {
      const el = document.querySelector('canvas[aria-label="Quadro de rascunho"]') as HTMLCanvasElement;
      const rect = el.getBoundingClientRect();
      const scaleX = el.width / rect.width;
      const scaleY = el.height / rect.height;
      const ctx = el.getContext("2d")!;
      return Array.from(ctx.getImageData(Math.round(20 * scaleX), Math.round(20 * scaleY), 1, 1).data).slice(0, 3);
    });
    expect(pixel).not.toEqual([255, 255, 255]);
  });
});
