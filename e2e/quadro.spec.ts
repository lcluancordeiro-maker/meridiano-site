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
    // The auto-analyze toggle is gated behind the same canResolve check — no
    // point offering it to a guest who can't call the AI resolve endpoint.
    // The debounced auto-trigger itself needs a logged-in session to exercise
    // end-to-end, which this sandbox can't authenticate (see e2e/auth.spec.ts).
    await expect(page.getByText("Analisar automaticamente ao pausar")).toHaveCount(0);
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

  test("navbar (under 'Mais') links to the quadro page", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("button", { name: "Mais" }).click();
    await expect(page.getByRole("link", { name: "Quadro" })).toHaveAttribute("href", "/quadro");
  });

  test("a pen touching down cancels an in-progress touch stroke (palm rejection)", async ({ page }) => {
    await page.goto("/quadro");
    const canvas = page.getByRole("img", { name: "Quadro de rascunho" });
    const box = await canvas.boundingBox();
    if (!box) throw new Error("canvas has no bounding box");

    // Region A (top-left) is where a "touch" pointer starts drawing but
    // never lifts. Region B (bottom-right) is where a "pen" pointer then
    // touches down and draws instead — it should both cancel region A's
    // unfinished stroke and successfully draw its own.
    const result = await page.evaluate(
      ([left, top, width, height]) => {
        const el = document.querySelector('canvas[aria-label="Quadro de rascunho"]') as HTMLCanvasElement;
        const rect = el.getBoundingClientRect();

        function toInternal(clientX: number, clientY: number) {
          const scaleX = el.width / rect.width;
          const scaleY = el.height / rect.height;
          return { x: Math.round((clientX - rect.left) * scaleX), y: Math.round((clientY - rect.top) * scaleY) };
        }

        function dispatch(type: string, pointerId: number, pointerType: string, clientX: number, clientY: number) {
          el.dispatchEvent(
            new PointerEvent(type, {
              pointerId,
              pointerType,
              clientX,
              clientY,
              pressure: pointerType === "mouse" ? 0 : 0.5,
              bubbles: true,
              cancelable: true,
            })
          );
        }

        const aStart = { x: left + width * 0.1, y: top + height * 0.1 };
        const aEnd = { x: left + width * 0.2, y: top + height * 0.1 };
        const bStart = { x: left + width * 0.8, y: top + height * 0.8 };
        const bEnd = { x: left + width * 0.9, y: top + height * 0.8 };

        dispatch("pointerdown", 1, "touch", aStart.x, aStart.y);
        dispatch("pointermove", 1, "touch", aEnd.x, aEnd.y);
        // No pointerup for id=1 — the touch stroke is still "in progress"
        // when the pen touches down, like a resting palm during handwriting.
        dispatch("pointerdown", 2, "pen", bStart.x, bStart.y);
        dispatch("pointermove", 2, "pen", bEnd.x, bEnd.y);
        dispatch("pointerup", 2, "pen", bEnd.x, bEnd.y);

        const ctx = el.getContext("2d")!;
        const aPixel = toInternal(aStart.x, aStart.y);
        const bPixel = toInternal(bStart.x, bStart.y);
        return {
          regionA: Array.from(ctx.getImageData(aPixel.x, aPixel.y, 1, 1).data),
          regionB: Array.from(ctx.getImageData(bPixel.x, bPixel.y, 1, 1).data),
        };
      },
      [box.x, box.y, box.width, box.height] as const
    );

    // Region A was undone when the pen preempted it — still blank white.
    expect(result.regionA.slice(0, 3)).toEqual([255, 255, 255]);
    // Region B was actually drawn by the pen stroke — no longer white.
    expect(result.regionB.slice(0, 3)).not.toEqual([255, 255, 255]);
  });
});
