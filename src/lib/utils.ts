import { translations } from "./translations";
import type { Locale, TranslationKey } from "./types";

export function t(locale: Locale, key: TranslationKey): string {
  const dict = translations[locale as keyof typeof translations];
  if (!dict) return key;
  return dict[key] ?? key;
}

export function localePath(locale: Locale, path: string): string {
  return `/${locale}${path}`;
}

export function alternateLocale(current: Locale): Locale {
  return current === "cs" ? "en" : "cs";
}

export function getLocaleFromPath(pathname: string): Locale {
  const segments = pathname.split("/").filter(Boolean);
  if (segments[0] === "en") return "en";
  return "cs";
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

export function formatTimestamp(date: Date): string {
  return date.toISOString().replace("T", " ").slice(0, 19) + " UTC";
}

export function msToHuman(ms: number): string {
  return ms < 1000 ? `${ms}ms` : `${(ms / 1000).toFixed(1)}s`;
}
