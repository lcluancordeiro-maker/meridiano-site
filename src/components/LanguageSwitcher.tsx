"use client";

import { LOCALES, LOCALE_LABELS, type Locale } from "@/i18n/config";
import { useTranslation } from "@/i18n/LanguageContext";

export default function LanguageSwitcher() {
  const { locale, dict, setLocale } = useTranslation();

  return (
    <select
      value={locale}
      onChange={(e) => setLocale(e.target.value as Locale)}
      aria-label={dict.language.label}
      className="rounded-full border border-border bg-surface px-2.5 py-1.5 text-xs font-medium text-foreground transition-colors hover:border-primary"
    >
      {LOCALES.map((l) => (
        <option key={l} value={l}>
          {LOCALE_LABELS[l]}
        </option>
      ))}
    </select>
  );
}
