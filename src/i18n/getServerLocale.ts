import { cookies } from "next/headers";
import { DEFAULT_LOCALE, LOCALE_COOKIE, isLocale, type Locale } from "./config";

/** Reads the visitor's chosen language from the locale cookie (Server
 * Components / Server Actions only). Falls back to the default when unset
 * or invalid — there's no browser Accept-Language negotiation here since the
 * language switcher is the source of truth once a user has picked one. */
export async function getServerLocale(): Promise<Locale> {
  const cookieStore = await cookies();
  const value = cookieStore.get(LOCALE_COOKIE)?.value;
  return value && isLocale(value) ? value : DEFAULT_LOCALE;
}
