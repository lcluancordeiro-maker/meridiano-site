import type { Locale } from "@/i18n/config";

// Names used to instruct Claude which language to respond in, independent of
// the endonym shown in the UI. pt-BR is written in Portuguese itself (the
// system prompt's own language) so the instruction reads naturally for the
// default/majority case; the rest are English names, which Claude follows
// correctly regardless of the surrounding prompt's language.
const LOCALE_LANGUAGE_NAMES: Record<Locale, string> = {
  "pt-BR": "português do Brasil",
  en: "English",
  es: "Spanish",
  zh: "Chinese (Simplified)",
  it: "Italian",
  ko: "Korean",
  de: "German",
  fr: "French",
  ja: "Japanese",
  ar: "Arabic",
  ru: "Russian",
};

export function localeToLanguageName(locale: Locale): string {
  return LOCALE_LANGUAGE_NAMES[locale] ?? LOCALE_LANGUAGE_NAMES["pt-BR"];
}
