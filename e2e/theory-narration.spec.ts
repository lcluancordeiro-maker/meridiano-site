import { test, expect, type Page } from "@playwright/test";

/**
 * The real SpeechSynthesis API needs actual TTS voices and doesn't reliably
 * fire events in headless Chromium, so these tests inject a mock
 * `speechSynthesis` before the page loads — `speak()` stashes the spoken
 * text on `window.__lastSpokenText` and asynchronously fires `onend`,
 * exercising the whole "click ouvir → pausar/continuar → parar" flow
 * deterministically.
 */
async function mockSpeechSynthesis(page: Page) {
  await page.addInitScript(() => {
    class MockUtterance extends EventTarget {
      text: string;
      lang = "";
      onend: (() => void) | null = null;
      onerror: (() => void) | null = null;
      constructor(text: string) {
        super();
        this.text = text;
      }
    }

    window.SpeechSynthesisUtterance = MockUtterance as unknown as typeof SpeechSynthesisUtterance;
    // Plain assignment silently no-ops: `speechSynthesis` is a getter-only
    // accessor on Window.prototype in real Chromium, so it has to be
    // redefined outright to actually replace the native implementation
    // (which otherwise throws "Illegal invocation" on a MockUtterance).
    Object.defineProperty(window, "speechSynthesis", {
      configurable: true,
      value: {
        speak(utterance: SpeechSynthesisUtterance) {
          // @ts-expect-error test-only global
          window.__lastSpokenText = (utterance as unknown as MockUtterance).text;
          setTimeout(() => (utterance as unknown as MockUtterance).onend?.(), 200);
        },
        cancel() {},
        pause() {},
        resume() {},
      } as unknown as typeof window.speechSynthesis,
    });
  });
}

test.describe("narração em áudio da teoria (TTS)", () => {
  test("plays, pauses/resumes and stops the theory narration", async ({ page }) => {
    await mockSpeechSynthesis(page);
    await page.goto("/trilha/fundamental-2/fracoes");
    await page.waitForLoadState("networkidle");

    const playButton = page.getByRole("button", { name: "🔊 Ouvir teoria" });
    await expect(playButton).toBeVisible();
    await playButton.click();

    const pauseButton = page.getByRole("button", { name: "⏸️ Pausar" });
    await expect(pauseButton).toBeVisible();
    await expect(page.getByRole("button", { name: "Parar narração" })).toBeVisible();

    await pauseButton.click();
    await expect(page.getByRole("button", { name: "▶️ Continuar" })).toBeVisible();

    const spokenText = await page.evaluate(() => (window as unknown as { __lastSpokenText: string }).__lastSpokenText);
    expect(spokenText).toContain("Frações");

    await page.getByRole("button", { name: "Parar narração" }).click();
    await expect(page.getByRole("button", { name: "🔊 Ouvir teoria" })).toBeVisible();
  });

  test("does not render the narration button when SpeechSynthesis isn't supported", async ({ page }) => {
    await page.addInitScript(() => {
      // @ts-expect-error simulating an unsupported browser
      delete window.speechSynthesis;
    });
    await page.goto("/trilha/fundamental-2/fracoes");
    await page.waitForLoadState("networkidle");
    await expect(page.getByRole("button", { name: "🔊 Ouvir teoria" })).not.toBeVisible();
  });
});
