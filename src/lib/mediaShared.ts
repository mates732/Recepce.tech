/**
 * Sdílené konstanty a pomocné funkce pro média.
 * Používané serverem (validace uploadu) i klientem (formuláře, picker) —
 * jediný zdroj, žádná duplikace pravidel.
 */

export const ALLOWED_MEDIA_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
  "image/svg+xml",
] as const;

export const MAX_MEDIA_SIZE = 5 * 1024 * 1024; // 5 MB

export function isAllowedMediaType(type: string): boolean {
  return (ALLOWED_MEDIA_TYPES as readonly string[]).includes(type);
}

export function isMediaTooLarge(size: number): boolean {
  return size > MAX_MEDIA_SIZE;
}

export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}
