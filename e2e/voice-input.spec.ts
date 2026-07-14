import { test, expect } from "@playwright/test";

/**
 * The real Web Speech API needs a microphone and isn't available in
 * headless Chromium, so these tests inject a mock `SpeechRecognition`
 * class before the page loads — `start()` asynchronously fires `onresult`
 * with whatever transcript the test stashed on `window.__mockTranscript`,
 * exercising the whole "click mic → fill answer" flow deterministically.
 */
async function mockSpeechRecognition(page: import("@playwright/test").Page, transcript: string) {
  await page.addInitScript((t) => {
    class MockSpeechRecognition extends EventTarget {
      lang = "";
      continuous = false;
      interimResults = false;
      onresult: ((event: { results: Record<number, Record<number, { transcript: string }>> }) => void) | null = null;
      onerror: (() => void) | null = null;
      onend: (() => void) | null = null;

      start() {
        setTimeout(() => {
          this.onresult?.({ results: { 0: { 0: { transcript: t } } } });
          this.onend?.();
        }, 0);
      }

      stop() {
        this.onend?.();
      }
    }

    window.SpeechRecognition = MockSpeechRecognition;
    window.webkitSpeechRecognition = MockSpeechRecognition;
  }, transcript);
}

test.describe("voice input for exercises", () => {
  test("fills a numeric answer from a mocked speech result", async ({ page }) => {
    await mockSpeechRecognition(page, "a resposta é 2/3");
    await page.goto("/trilha/fundamental-2/fracoes");
    await page.waitForLoadState("networkidle");
    await page.getByRole("button", { name: /^Médio/ }).click();

    await page.getByRole("button", { name: "Falar resposta" }).click();
    await expect(page.getByPlaceholder("Digite sua resposta")).toHaveValue("2/3");

    await page.getByRole("button", { name: "Verificar" }).click();
    await expect(page.getByText("Certinho!")).toBeVisible();
  });

  test("selects a multiple-choice option from a mocked speech result", async ({ page }) => {
    await mockSpeechRecognition(page, "a resposta é 6/10");
    await page.goto("/trilha/fundamental-2/fracoes");
    await page.waitForLoadState("networkidle");
    await page.getByRole("button", { name: /^Médio/ }).click();

    // q4 is the multiple-choice question in this set — advance past q1-q3.
    for (let i = 0; i < 3; i++) {
      await page.getByPlaceholder("Digite sua resposta").fill("x");
      await page.getByRole("button", { name: "Verificar" }).click();
      await page.getByRole("button", { name: /Próxima|Ver resultado/ }).click();
    }

    await page.getByRole("button", { name: "Falar resposta" }).click();
    await expect(page.getByRole("button", { name: "6/10", exact: true })).toHaveClass(/border-primary/);
  });
});

test.describe("voice input for the AI tutor (Gauss)", () => {
  test("no mic button appears when the tutor isn't configured/logged in", async ({ page }) => {
    // Supabase isn't configured in this environment, so the tutor bubble
    // shows its "not available" message instead of the chat input — same
    // gating as e2e/tutor.spec.ts. This just confirms the voice button
    // doesn't render orphaned in that state.
    await mockSpeechRecognition(page, "oi");
    await page.goto("/");
    await page.getByRole("button", { name: "Abrir tutor de IA" }).click();
    await expect(page.getByText("O tutor de IA ainda não está disponível neste app.")).toBeVisible();
    await expect(page.getByRole("button", { name: "Falar" })).toHaveCount(0);
  });
});
