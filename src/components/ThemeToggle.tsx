"use client";

import { useSyncExternalStore } from "react";
import { useTranslation } from "@/i18n/LanguageContext";

let listeners: (() => void)[] = [];

function subscribe(callback: () => void) {
  listeners.push(callback);
  return () => {
    listeners = listeners.filter((l) => l !== callback);
  };
}

function getSnapshot() {
  return document.documentElement.getAttribute("data-theme") === "dark";
}

function getServerSnapshot() {
  return false;
}

function setTheme(dark: boolean) {
  if (dark) {
    document.documentElement.setAttribute("data-theme", "dark");
    localStorage.setItem("theme", "dark");
  } else {
    document.documentElement.removeAttribute("data-theme");
    localStorage.setItem("theme", "light");
  }
  listeners.forEach((l) => l());
}

export default function ThemeToggle() {
  const isDark = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const { dict } = useTranslation();

  return (
    <button
      type="button"
      onClick={() => setTheme(!isDark)}
      aria-label={isDark ? dict.theme.ativarClaro : dict.theme.ativarEscuro}
      className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-border text-sm transition-colors hover:border-primary"
    >
      {isDark ? "☀️" : "🌙"}
    </button>
  );
}
