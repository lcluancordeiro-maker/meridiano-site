import { defineConfig, devices } from "@playwright/test";

const PORT = 3200;

export default defineConfig({
  testDir: "./e2e",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: process.env.CI ? "html" : "list",
  timeout: 30_000,
  use: {
    baseURL: `http://localhost:${PORT}`,
    trace: "on-first-retry",
    // Every spec gets a fresh browser context (empty storage) by default,
    // which would otherwise show the first-visit OnboardingTour modal on
    // every test's first page load and block clicks underneath it. Seed
    // its "already dismissed" localStorage flag globally so existing specs
    // don't need to know about it; e2e/onboarding.spec.ts overrides this
    // per-file (test.use({ storageState: { cookies: [], origins: [] } }))
    // to exercise the tour itself against a truly fresh visitor.
    storageState: "e2e/onboarding-dismissed-storage-state.json",
  },
  projects: [
    {
      name: "chromium",
      use: {
        ...devices["Desktop Chrome"],
        // Optional escape hatch for sandboxed/offline environments that ship a
        // pre-installed Chromium under a non-standard path (e.g. version skew
        // between @playwright/test and the cached browser). Unset in normal use —
        // Playwright then manages its own browser via `playwright install`.
        ...(process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE
          ? { launchOptions: { executablePath: process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE } }
          : {}),
      },
    },
  ],
  webServer: {
    command: `npm run build && npm run start -- -p ${PORT}`,
    url: `http://localhost:${PORT}`,
    reuseExistingServer: !process.env.CI,
    timeout: 180_000,
  },
});
