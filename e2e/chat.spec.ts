import { test, expect } from "@playwright/test";

test.describe("chat (Supabase not configured in this environment)", () => {
  test("/chat explains chat isn't available yet", async ({ page }) => {
    await page.goto("/chat");
    await expect(page.getByRole("heading", { name: "Chat" })).toBeVisible();
    await expect(page.getByText("O chat ainda não está disponível neste app — volte em breve.")).toBeVisible();
  });

  test("a conversation thread route redirects back to /chat when not configured", async ({ page }) => {
    await page.goto("/chat/00000000-0000-0000-0000-000000000000");
    await expect(page).toHaveURL("/chat");
  });

  test("navbar links to /chat", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByRole("link", { name: "Chat", exact: true })).toHaveAttribute("href", "/chat");
  });
});
