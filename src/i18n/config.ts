export type Locale = "pt-BR" | "en" | "es";

export const LOCALES: Locale[] = ["pt-BR", "en", "es"];
export const DEFAULT_LOCALE: Locale = "pt-BR";
export const LOCALE_COOKIE = "meridiano_lang";

export const LOCALE_LABELS: Record<Locale, string> = {
  "pt-BR": "Português",
  en: "English",
  es: "Español",
};

export function isLocale(value: string): value is Locale {
  return (LOCALES as string[]).includes(value);
}
