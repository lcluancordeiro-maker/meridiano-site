import { ACCENT_THEMES, type AccentTheme } from "./gamification";

/** Shared accent-color store, mirroring theme.ts's dark-mode store — reads
 * via useSyncExternalStore so components stay in sync with the
 * `data-accent` attribute (and each other) without a setState-in-effect
 * anti-pattern. Layers on top of light/dark mode: `data-accent` only
 * overrides `--primary`/`--primary-dark` in globals.css, not background or
 * foreground, so it works the same in either theme. */

const STORAGE_KEY = "accent-theme";

let listeners: (() => void)[] = [];

function subscribe(callback: () => void) {
  listeners.push(callback);
  return () => {
    listeners = listeners.filter((l) => l !== callback);
  };
}

function isAccentTheme(value: string | null): value is AccentTheme {
  return value !== null && (ACCENT_THEMES as readonly string[]).includes(value);
}

function getSnapshot(): AccentTheme | null {
  const attr = document.documentElement.getAttribute("data-accent");
  return isAccentTheme(attr) ? attr : null;
}

function getServerSnapshot(): AccentTheme | null {
  return null;
}

function setAccentTheme(theme: AccentTheme | null): void {
  if (theme) {
    document.documentElement.setAttribute("data-accent", theme);
    localStorage.setItem(STORAGE_KEY, theme);
  } else {
    document.documentElement.removeAttribute("data-accent");
    localStorage.removeItem(STORAGE_KEY);
  }
  listeners.forEach((l) => l());
}

export const accentThemeStore = { subscribe, getSnapshot, getServerSnapshot, setAccentTheme };
