export type Locale = "pt-BR" | "en" | "es" | "zh" | "it" | "ko" | "de" | "fr" | "ja" | "ar" | "ru";

export const LOCALES: Locale[] = ["pt-BR", "en", "es", "zh", "it", "ko", "de", "fr", "ja", "ar", "ru"];
export const DEFAULT_LOCALE: Locale = "pt-BR";
export const LOCALE_COOKIE = "meridiano_lang";

export const LOCALE_LABELS: Record<Locale, string> = {
  "pt-BR": "Português",
  en: "English",
  es: "Español",
  zh: "中文",
  it: "Italiano",
  ko: "한국어",
  de: "Deutsch",
  fr: "Français",
  ja: "日本語",
  ar: "العربية",
  ru: "Русский",
};

// Locales written right-to-left — used to set <html dir="..."> in the root layout.
export const RTL_LOCALES: Locale[] = ["ar"];

export function isRtl(locale: Locale): boolean {
  return (RTL_LOCALES as string[]).includes(locale);
}

export function isLocale(value: string): value is Locale {
  return (LOCALES as string[]).includes(value);
}
