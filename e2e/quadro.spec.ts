import { test, expect } from "@playwright/test";

test.describe("quadro de rascunho", () => {
  test("renders the canvas and toolbar", async ({ page }) => {
    await page.goto("/quadro");
    await expect(page.getByRole("heading", { name: "Quadro de rascunho" })).toBeVisible();
    await expect(page.getByRole("img", { name: "Quadro de rascunho" })).toBeVisible();
    await expect(page.getByRole("button", { name: "Desfazer" })).toBeVisible();
    await expect(page.getByRole("button", { name: "Limpar" })).toBeVisible();
    await expect(page.getByRole("button", { name: "Baixar PNG" })).toBeVisible();
  });

  test("is usable without an account, but AI resolve requires login", async ({ page }) => {
    await page.goto("/quadro");
    await expect(page.getByRole("img", { name: "Quadro de rascunho" })).toBeVisible();
    await expect(page.getByText("Faça login")).toBeVisible();
    await expect(page.getByRole("button", { name: "Resolver com IA" })).toHaveCount(0);
  });

  test("drawing a stroke and downloading produces a PNG file", async ({ page }) => {
    await page.goto("/quadro");
    const canvas = page.getByRole("img", { name: "Quadro de rascunho" });
    const box = await canvas.boundingBox();
    if (!box) throw new Error("canvas has no bounding box");

    await page.mouse.move(box.x + 20, box.y + 20);
    await page.mouse.down();
    await page.mouse.move(box.x + 120, box.y + 120);
    await page.mouse.up();

    const downloadPromise = page.waitForEvent("download");
    await page.getByRole("button", { name: "Baixar PNG" }).click();
    const download = await downloadPromise;
    expect(download.suggestedFilename()).toBe("quadro-meridiano.png");
  });

  test("navbar links to the quadro page", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByRole("link", { name: "Quadro" })).toHaveAttribute("href", "/quadro");
  });
});
