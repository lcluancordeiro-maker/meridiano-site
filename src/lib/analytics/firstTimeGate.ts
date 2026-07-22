const STORAGE_KEY = "meridiano-analytics-first-seen";

function readSeen(): string[] {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as string[]) : [];
  } catch {
    return [];
  }
}

/** True the first time this event name is seen in this browser, false on
 * every later call — the localStorage-backed gate behind "first exercise
 * completed"/"first Gauss message"/"first photo solved" analytics events,
 * so they fire exactly once per student instead of on every occurrence. */
export function isFirstOccurrence(eventName: string): boolean {
  const seen = readSeen();
  if (seen.includes(eventName)) return false;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify([...seen, eventName]));
  } catch {
    // Storage unavailable (private mode, quota) — treat as first-and-only.
  }
  return true;
}
