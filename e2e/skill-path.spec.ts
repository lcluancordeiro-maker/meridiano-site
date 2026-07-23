import { test, expect } from "@playwright/test";

// The level page renders topics as a vertical "skill path": numbered nodes
// connected by a line, turning green as difficulty tiers are completed.
// Progress comes from the same localStorage store the quiz writes
// ("meridiano-math-progress"), which lets these tests seed states directly.
test.describe("skill path (visual progression map)", () => {
  test("a fresh visitor sees numbered, not-started nodes linking to the topics", async ({
    page,
  }) => {
    await page.goto("/trilha/fundamental-2");
    const nodes = page.getByTestId("skill-node");
    await expect(nodes.first()).toBeVisible();
    const count = await nodes.count();
    expect(count).toBeGreaterThanOrEqual(7);

    await expect(nodes.first()).toHaveText("1");
    await expect(nodes.first()).toHaveAttribute("aria-label", /não iniciado$/);
    await expect(
      page.getByRole("link", { name: /Frações/ }).first()
    ).toHaveAttribute("href", "/trilha/fundamental-2/fracoes");
  });

  test("a partially completed topic shows as 'em progresso' with its tier count", async ({
    page,
  }) => {
    await page.addInitScript(() => {
      window.localStorage.setItem(
        "meridiano-math-progress",
        JSON.stringify({
          "fundamental-2/fracoes/medio": {
            completed: true,
            score: 6,
            total: 6,
            updatedAt: Date.now(),
          },
        })
      );
    });
    await page.goto("/trilha/fundamental-2");
    const node = page.locator('[data-testid="skill-node"][aria-label="Frações: em progresso"]');
    await expect(node).toBeVisible();
    await expect(page.getByText("1/4 níveis")).toBeVisible();
  });

  test("a topic with all four tiers done shows a green checkmark node", async ({ page }) => {
    await page.addInitScript(() => {
      const tier = { completed: true, score: 6, total: 6, updatedAt: Date.now() };
      window.localStorage.setItem(
        "meridiano-math-progress",
        JSON.stringify({
          "fundamental-2/fracoes/facil": tier,
          "fundamental-2/fracoes/medio": tier,
          "fundamental-2/fracoes/dificil": tier,
          "fundamental-2/fracoes/olimpiada": tier,
        })
      );
    });
    await page.goto("/trilha/fundamental-2");
    const node = page.locator('[data-testid="skill-node"][aria-label="Frações: concluído"]');
    await expect(node).toBeVisible();
    await expect(node).toHaveText("✓");
    await expect(page.getByText("4/4 níveis")).toBeVisible();
  });

  test("a topic with no attempts shows no mastery badge, and a perfect recent score shows 100%", async ({
    page,
  }) => {
    await page.addInitScript(() => {
      window.localStorage.setItem(
        "meridiano-math-progress",
        JSON.stringify({
          "fundamental-2/fracoes/facil": {
            completed: true,
            score: 6,
            total: 6,
            updatedAt: Date.now(),
          },
        })
      );
    });
    await page.goto("/trilha/fundamental-2");
    await expect(page.getByTestId("mastery-badge")).toHaveText("Domínio: 100%");
    // Every other topic on the page has no recorded attempts yet.
    const badges = page.getByTestId("mastery-badge");
    await expect(badges).toHaveCount(1);
  });
});

// Fundamental II and Ensino Médio group their topics into "chapters" — a
// themed cluster of 2-3 topics with its own rolled-up "n/total" completion,
// shown as a divider between sections of the same skill path. Every other
// track has no `chapters` config and renders as a flat list, unaffected.
test.describe("skill path chapters", () => {
  test("a level with chapters shows section dividers with a rolled-up count", async ({ page }) => {
    await page.goto("/trilha/fundamental-2");
    const headings = page.getByTestId("chapter-heading");
    await expect(headings).toHaveCount(3);
    await expect(headings.nth(0)).toContainText("Números e Frações");
    await expect(headings.nth(0)).toContainText("0/8");
    await expect(headings.nth(1)).toContainText("Álgebra e Potências");
    await expect(headings.nth(2)).toContainText("Equações e Geometria");
  });

  test("completing every tier of every topic in a chapter marks it done", async ({ page }) => {
    await page.addInitScript(() => {
      const tier = { completed: true, score: 6, total: 6, updatedAt: Date.now() };
      const entries: Record<string, typeof tier> = {};
      for (const topicId of ["numeros-inteiros", "fracoes"]) {
        for (const difficulty of ["facil", "medio", "dificil", "olimpiada"]) {
          entries[`fundamental-2/${topicId}/${difficulty}`] = tier;
        }
      }
      window.localStorage.setItem("meridiano-math-progress", JSON.stringify(entries));
    });
    await page.goto("/trilha/fundamental-2");
    const firstChapter = page.getByTestId("chapter-heading").first();
    await expect(firstChapter).toContainText("Números e Frações");
    await expect(firstChapter).toContainText("8/8");
    await expect(firstChapter).toContainText("✓");

    // The other two chapters are untouched.
    await expect(page.getByTestId("chapter-heading").nth(1)).toContainText("0/12");
  });

  test("a track without chapters (e.g. Estatística) renders as a flat list", async ({ page }) => {
    await page.goto("/trilha/estatistica-iniciante");
    await expect(page.getByTestId("chapter-heading")).toHaveCount(0);
    await expect(page.getByTestId("skill-node").first()).toBeVisible();
  });
});

// A chapter shows a 🔒 soft-lock hint when the previous chapter has zero
// progress — a suggestion only, never a real block: every topic link
// underneath stays clickable regardless of the lock state.
test.describe("skill path soft chapter lock", () => {
  test("the first chapter is never locked, later ones are for a fresh visitor", async ({ page }) => {
    await page.goto("/trilha/fundamental-2");
    const headings = page.getByTestId("chapter-heading");
    await expect(headings.nth(0)).toHaveAttribute("data-locked", "false");
    await expect(headings.nth(1)).toHaveAttribute("data-locked", "true");
    await expect(headings.nth(1)).toContainText("🔒");
    await expect(headings.nth(2)).toHaveAttribute("data-locked", "true");
  });

  test("starting the first chapter unlocks the hint on the second", async ({ page }) => {
    await page.addInitScript(() => {
      window.localStorage.setItem(
        "meridiano-math-progress",
        JSON.stringify({
          "fundamental-2/numeros-inteiros/facil": {
            completed: true,
            score: 6,
            total: 6,
            updatedAt: Date.now(),
          },
        })
      );
    });
    await page.goto("/trilha/fundamental-2");
    const headings = page.getByTestId("chapter-heading");
    await expect(headings.nth(1)).toHaveAttribute("data-locked", "false");
    await expect(headings.nth(1)).not.toContainText("🔒");
  });

  test("a locked chapter's topics stay fully clickable — the lock never blocks navigation", async ({
    page,
  }) => {
    await page.goto("/trilha/fundamental-2");
    await expect(page.getByTestId("chapter-heading").nth(1)).toHaveAttribute("data-locked", "true");

    // "Introdução à Álgebra" is the first topic of the (locked) 2nd chapter.
    await page.getByRole("link", { name: /Introdução à Álgebra/ }).click();
    await expect(page).toHaveURL(/\/trilha\/fundamental-2\/introducao-algebra$/);
  });
});
