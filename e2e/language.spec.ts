import { test, expect } from "@playwright/test";

test.describe("language switcher", () => {
  test("defaults to Portuguese and switches the UI language, persisting across reloads", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByRole("link", { name: "Entrar" })).toBeVisible();

    await page.getByRole("combobox", { name: "Idioma" }).selectOption("en");
    await expect(page.getByRole("link", { name: "Log in" })).toBeVisible();
    await expect(page.getByRole("heading", { name: "Choose your grade level" })).toBeVisible();

    await page.reload();
    await expect(page.getByRole("link", { name: "Log in" })).toBeVisible();
  });

  test("switches to Spanish", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("combobox", { name: "Idioma" }).selectOption("es");
    await expect(page.getByRole("link", { name: "Iniciar sesión" })).toBeVisible();
  });

  const extraLocales: { value: string; loginLabel: string }[] = [
    { value: "zh", loginLabel: "登录" },
    { value: "it", loginLabel: "Accedi" },
    { value: "ko", loginLabel: "로그인" },
    { value: "de", loginLabel: "Anmelden" },
    { value: "fr", loginLabel: "Se connecter" },
    { value: "ja", loginLabel: "ログイン" },
    { value: "ar", loginLabel: "تسجيل الدخول" },
    { value: "ru", loginLabel: "Войти" },
  ];

  for (const { value, loginLabel } of extraLocales) {
    test(`switches to ${value}`, async ({ page }) => {
      await page.goto("/");
      await page.getByRole("combobox", { name: "Idioma" }).selectOption(value);
      await expect(page.getByRole("link", { name: loginLabel, exact: true })).toBeVisible();
    });
  }

  test("sets dir=rtl on <html> for Arabic and reverts to ltr when switching away", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator("html")).toHaveAttribute("dir", "ltr");

    await page.getByRole("combobox", { name: "Idioma" }).selectOption("ar");
    await expect(page.locator("html")).toHaveAttribute("dir", "rtl");
    await expect(page.locator("html")).toHaveAttribute("lang", "ar");

    await page.getByRole("combobox", { name: "اللغة" }).selectOption("pt-BR");
    await expect(page.locator("html")).toHaveAttribute("dir", "ltr");
  });
});
