import "server-only";
import { promises as fs } from "fs";
import path from "path";
import type { ContentItem, ContentKind, Localized } from "@/content/types";
import { list } from "@/content/repository";
import { recordAuditEvent, type AuditAction } from "@/services/audit";

/**
 * Runtime úložiště admin úprav.
 *
 * - drafts.json    — rozpracovaný obsah (nikdy se nerenderuje veřejně)
 * - published.json — publikované overridy (aplikují se při buildu do repository)
 *
 * Publish je explicitní krok: draft se přesune z drafts.json do published.json
 * a zapíše se audit záznam. Změny produkce nastanou až nasazením buildu,
 * který published.json zabundluje.
 */

const STORE_DIR = path.join(process.cwd(), "src", "content", "store");
const DRAFTS_FILE = path.join(STORE_DIR, "drafts.json");
const PUBLISHED_FILE = path.join(STORE_DIR, "published.json");

type OverrideMap = Partial<Record<ContentKind, Record<string, ContentItem>>>;

async function readStore(file: string): Promise<OverrideMap> {
  try {
    const raw = await fs.readFile(file, "utf8");
    return JSON.parse(raw) as OverrideMap;
  } catch {
    return {};
  }
}

async function writeStore(file: string, data: OverrideMap): Promise<void> {
  await fs.mkdir(STORE_DIR, { recursive: true });
  await fs.writeFile(file, JSON.stringify(data, null, 2) + "\n", "utf8");
}

export async function getDrafts(): Promise<OverrideMap> {
  return readStore(DRAFTS_FILE);
}

export async function getPublishedOverrides(): Promise<OverrideMap> {
  return readStore(PUBLISHED_FILE);
}

function kindMap(map: OverrideMap, kind: ContentKind): Record<string, ContentItem> {
  return map[kind] ?? {};
}

export async function getItemState(
  kind: ContentKind,
  id: string
): Promise<{ draft: ContentItem | null; published: ContentItem | null }> {
  const [drafts, published] = await Promise.all([getDrafts(), getPublishedOverrides()]);
  return {
    draft: kindMap(drafts, kind)[id] ?? null,
    published: kindMap(published, kind)[id] ?? null,
  };
}

/** Uloží (upsert) draft. Publikovaný obsah se nemění. */
export async function saveDraft(item: ContentItem): Promise<void> {
  const drafts = await getDrafts();
  const map = kindMap(drafts, item.kind);
  map[item.id] = item;
  drafts[item.kind] = map;
  await writeStore(DRAFTS_FILE, drafts);
}

/** Publish: přesun draftu do published.json + audit. */
export async function publishDraft(kind: ContentKind, id: string): Promise<ContentItem | null> {
  const [drafts, published] = await Promise.all([getDrafts(), getPublishedOverrides()]);

  const draft = kindMap(drafts, kind)[id];
  if (!draft) return null;

  const publishedMap = kindMap(published, kind);
  publishedMap[id] = { ...draft, status: "published" };
  published[kind] = publishedMap;
  await writeStore(PUBLISHED_FILE, published);

  const draftMap = kindMap(drafts, kind);
  delete draftMap[id];
  await writeStore(DRAFTS_FILE, drafts);

  await recordAuditEvent({
    actor: "admin",
    action: "publish",
    entityKind: kind,
    entityId: id,
    summary: `Publikováno: ${itemLabel(draft)}`,
    details: { state: "published" },
  });

  return draft;
}

/** Zahození draftu. Publikovaný obsah se nemění. */
export async function discardDraft(kind: ContentKind, id: string): Promise<boolean> {
  const drafts = await getDrafts();
  const map = kindMap(drafts, kind);
  if (!map[id]) return false;
  delete map[id];
  drafts[kind] = map;
  await writeStore(DRAFTS_FILE, drafts);

  await recordAuditEvent({
    actor: "admin",
    action: "update",
    entityKind: kind,
    entityId: id,
    summary: `Draft zahozen: ${id}`,
    details: { state: "draft-discarded" },
  });

  return true;
}

function itemLabel(item: ContentItem): string {
  const maybe = (item as { name?: Localized; title?: Localized }).name;
  const title = (item as { title?: Localized }).title;
  const localized = maybe ?? title;
  return localized?.cs ?? item.id;
}

export interface ContentListItem {
  id: string;
  label: string;
  hasDraft: boolean;
  hasPublishedOverride: boolean;
}

/** Seznam položek druhu s informací o draft/publish stavu (pro admin UI). */
export async function listContentItems(kind: ContentKind): Promise<ContentListItem[]> {
  const [drafts, published] = await Promise.all([getDrafts(), getPublishedOverrides()]);
  const draftMap = drafts[kind] ?? {};
  const publishedMap = published[kind] ?? {};

  const items: ContentListItem[] = list(kind).map((item) => ({
    id: item.id,
    label: itemLabel(item),
    hasDraft: Boolean(draftMap[item.id]),
    hasPublishedOverride: Boolean(publishedMap[item.id]),
  }));

  for (const [id, draft] of Object.entries(draftMap)) {
    if (!items.some((item) => item.id === id)) {
      items.push({ id, label: itemLabel(draft), hasDraft: true, hasPublishedOverride: false });
    }
  }

  items.sort((a, b) => a.id.localeCompare(b.id));
  return items;
}

export async function recordDraftAudit(
  kind: ContentKind,
  id: string,
  summary: string,
  action: AuditAction = "update"
): Promise<void> {
  await recordAuditEvent({
    actor: "admin",
    action,
    entityKind: kind,
    entityId: id,
    summary,
    details: { state: "draft" },
  });
}
