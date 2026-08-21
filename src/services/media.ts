import "server-only";
import { promises as fs } from "fs";
import path from "path";
import type { ContentItem, ContentKind } from "@/content/types";
import { CONTENT_KINDS, listAll } from "@/content/repository";
import { getDrafts } from "@/services/contentStore";
import { ALLOWED_MEDIA_TYPES, MAX_MEDIA_SIZE } from "@/lib/mediaShared";

/**
 * Správa médií (uploady v public/images/uploads).
 *
 * - Upload: whitelist MIME + limit velikosti (pravidla v lib/mediaShared),
 *   sanitizace názvu
 * - Metadata: fs fakta (velikost, typ, datum) + alt z media.json
 * - Reference: počítané live procházením obsahu (žádný drift)
 * - Mazání: bezpečné — soubor s referencí v obsahu se odmítne smazat
 */

export { ALLOWED_MEDIA_TYPES, MAX_MEDIA_SIZE } from "@/lib/mediaShared";

export const UPLOADS_DIR = path.join(process.cwd(), "public", "images", "uploads");
const UPLOADS_URL = "/images/uploads";

const MIME_EXTENSION: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/gif": "gif",
  "image/svg+xml": "svg",
};

const MEDIA_REGISTRY_FILE = path.join(process.cwd(), "src", "content", "media", "media.json");

export interface MediaReference {
  kind: ContentKind;
  id: string;
  field: string;
}

export interface MediaItem {
  path: string;
  name: string;
  size: number;
  mime: string;
  uploadedAt: string;
  alt: string;
  references: MediaReference[];
}

function mimeFromExtension(file: string): string {
  const ext = path.extname(file).toLowerCase();
  const found = Object.entries(MIME_EXTENSION).find(([, e]) => `.${e}` === ext);
  return found?.[0] ?? "application/octet-stream";
}

async function readRegistry(): Promise<Record<string, { alt?: string }>> {
  try {
    return JSON.parse(await fs.readFile(MEDIA_REGISTRY_FILE, "utf8"));
  } catch {
    return {};
  }
}

async function writeRegistry(registry: Record<string, { alt?: string }>): Promise<void> {
  await fs.mkdir(path.dirname(MEDIA_REGISTRY_FILE), { recursive: true });
  await fs.writeFile(MEDIA_REGISTRY_FILE, JSON.stringify(registry, null, 2) + "\n", "utf8");
}

function collectStrings(value: unknown, field: string, path: string, result: string[]): void {
  if (value === null || value === undefined) return;
  if (typeof value === "string") {
    if (value.includes(path)) result.push(field);
    return;
  }
  if (Array.isArray(value)) {
    value.forEach((entry, index) => collectStrings(entry, `${field}.${index}`, path, result));
    return;
  }
  if (typeof value === "object") {
    for (const [key, entry] of Object.entries(value as Record<string, unknown>)) {
      collectStrings(entry, field ? `${field}.${key}` : key, path, result);
    }
  }
}

/** Reference dané cesty napříč obsahem (publikovaným i drafty). */
export async function computeReferences(filePath: string): Promise<MediaReference[]> {
  const references: MediaReference[] = [];
  const items: ContentItem[] = [];

  for (const kind of CONTENT_KINDS) {
    items.push(...listAll(kind.kind));
  }
  const drafts = await getDrafts();
  for (const kind of CONTENT_KINDS) {
    const map = drafts[kind.kind];
    if (map) items.push(...Object.values(map));
  }

  for (const item of items) {
    const fields: string[] = [];
    collectStrings(item, "", filePath, fields);
    for (const field of fields) {
      references.push({ kind: item.kind, id: item.id, field });
    }
  }

  return references;
}

export async function listMedia(): Promise<MediaItem[]> {
  let files: string[] = [];
  try {
    files = await fs.readdir(UPLOADS_DIR);
  } catch {
    return [];
  }

  const registry = await readRegistry();
  const items: MediaItem[] = [];

  for (const file of files) {
    if (file.startsWith(".")) continue;
    const absolute = path.join(UPLOADS_DIR, file);
    const stat = await fs.stat(absolute).catch(() => null);
    if (!stat || !stat.isFile()) continue;

    const urlPath = `${UPLOADS_URL}/${file}`;
    items.push({
      path: urlPath,
      name: file,
      size: stat.size,
      mime: mimeFromExtension(file),
      uploadedAt: stat.mtime.toISOString(),
      alt: registry[urlPath]?.alt ?? "",
      references: await computeReferences(urlPath),
    });
  }

  items.sort((a, b) => b.uploadedAt.localeCompare(a.uploadedAt));
  return items;
}

export function validateUpload(file: { type: string; size: number }): string | null {
  if (!(ALLOWED_MEDIA_TYPES as readonly string[]).includes(file.type)) {
    return `Nepodporovaný typ souboru: ${file.type || "neznámý"}.`;
  }
  if (file.size <= 0) {
    return "Prázdný soubor.";
  }
  if (file.size > MAX_MEDIA_SIZE) {
    return `Soubor je příliš velký (max. ${Math.round(MAX_MEDIA_SIZE / 1024 / 1024)} MB).`;
  }
  return null;
}

function sanitizeName(name: string): string {
  const base = path.basename(name).replace(/\.[^.]+$/, "").toLowerCase();
  const slug = base.replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 60);
  return slug || "upload";
}

export async function saveUpload(
  file: { name: string; type: string; size: number; arrayBuffer: () => Promise<ArrayBuffer> }
): Promise<MediaItem> {
  const error = validateUpload(file);
  if (error) throw new Error(error);

  const extension = MIME_EXTENSION[file.type];
  const buffer = Buffer.from(await file.arrayBuffer());

  await fs.mkdir(UPLOADS_DIR, { recursive: true });

  let fileName = `${sanitizeName(file.name)}.${extension}`;
  if (await fileExists(path.join(UPLOADS_DIR, fileName))) {
    fileName = `${Date.now().toString(36)}-${fileName}`;
  }

  await fs.writeFile(path.join(UPLOADS_DIR, fileName), buffer);

  const stat = await fs.stat(path.join(UPLOADS_DIR, fileName));
  const urlPath = `${UPLOADS_URL}/${fileName}`;

  return {
    path: urlPath,
    name: fileName,
    size: stat.size,
    mime: file.type,
    uploadedAt: stat.mtime.toISOString(),
    alt: "",
    references: [],
  };
}

async function fileExists(file: string): Promise<boolean> {
  try {
    await fs.access(file);
    return true;
  } catch {
    return false;
  }
}

/** Bezpečné smazání: soubor s referencí se odmítne. */
export async function deleteMedia(filePath: string): Promise<{ ok: true } | { ok: false; reason: "not found" | "in use"; references?: MediaReference[] }> {
  const fileName = path.basename(filePath);
  const absolute = path.join(UPLOADS_DIR, fileName);

  if (!(await fileExists(absolute))) {
    return { ok: false, reason: "not found" };
  }

  const references = await computeReferences(filePath);
  if (references.length > 0) {
    return { ok: false, reason: "in use", references };
  }

  await fs.unlink(absolute);

  const registry = await readRegistry();
  if (registry[filePath]) {
    delete registry[filePath];
    await writeRegistry(registry);
  }

  return { ok: true };
}

export async function setMediaAlt(filePath: string, alt: string): Promise<void> {
  const registry = await readRegistry();
  registry[filePath] = { alt: alt.trim() };
  await writeRegistry(registry);
}
