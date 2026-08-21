import { translations } from "./translations";
import type { Locale, TranslationKey } from "./types";

export function t(locale: Locale, key: TranslationKey): string {
  const dict = translations[locale as keyof typeof translations];
  if (!dict) return key;
  return dict[key] ?? key;
}

export function switchLocalePath(pathname: string, targetLocale: Locale): string {
  const segments = pathname.split("/").filter(Boolean);
  if (segments[0] === "cs" || segments[0] === "en") {
    segments[0] = targetLocale;
  } else {
    segments.unshift(targetLocale);
  }
  return "/" + segments.join("/");
}
