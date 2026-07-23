/** Shared dark-mode store, read via useSyncExternalStore so multiple
 * components (ThemeToggle, QuadroBoard's ink-color picker) stay in sync with
 * both `data-theme` and each other without a setState-in-effect anti-pattern. */

let listeners: (() => void)[] = [];

function subscribe(callback: () => void) {
  listeners.push(callback);
  return () => {
    listeners = listeners.filter((l) => l !== callback);
  };
}

function getSnapshot(): boolean {
  return document.documentElement.getAttribute("data-theme") === "dark";
}

function getServerSnapshot(): boolean {
  return false;
}

function setTheme(dark: boolean): void {
  if (dark) {
    document.documentElement.setAttribute("data-theme", "dark");
    localStorage.setItem("theme", "dark");
  } else {
    document.documentElement.removeAttribute("data-theme");
    localStorage.setItem("theme", "light");
  }
  listeners.forEach((l) => l());
}

export const themeStore = { subscribe, getSnapshot, getServerSnapshot, setTheme };
