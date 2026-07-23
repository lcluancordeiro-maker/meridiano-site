"use client";

import { useSyncExternalStore } from "react";
import { useTranslation } from "@/i18n/LanguageContext";
import { themeStore } from "@/lib/theme";

export default function ThemeToggle() {
  const isDark = useSyncExternalStore(themeStore.subscribe, themeStore.getSnapshot, themeStore.getServerSnapshot);
  const { dict } = useTranslation();

  return (
    <button
      type="button"
      onClick={() => themeStore.setTheme(!isDark)}
      aria-label={isDark ? dict.theme.ativarClaro : dict.theme.ativarEscuro}
      className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-border text-sm transition-colors hover:border-primary"
    >
      {isDark ? "☀️" : "🌙"}
    </button>
  );
}
