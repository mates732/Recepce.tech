import type { ContentItem, PageContent, PageSlug, SiteContent } from "./types";
import { CONTENT_ITEMS } from "./items";
import publishedJson from "./store/published.json";

/**
 * Registr obsahových typů — jediné místo, kde se definuje, jaké entity
 * existují. Budoucí admin vrstva zde získá seznam editovatelných druhů
 * a jejich položek bez znalosti interních souborů.
 */
export const CONTENT_KINDS = [
  { kind: "project", label: { cs: "Projekty", en: "Projects" } },
  { kind: "profession", label: { cs: "Profese", en: "Professions" } },
  { kind: "page", label: { cs: "Stránky", en: "Pages" } },
  { kind: "site", label: { cs: "Web (navigace, footer)", en: "Site (navigation, footer)" } },
] as const;

type OverrideMap = Partial<Record<ContentItem["kind"], Record<string, ContentItem>>>;

/**
 * Publikované overridy z adminu (build-time, zabundlované).
 * Admin Publish je explicitní krok — teprve nasazení buildu,
 * který tento soubor obsahuje, změní produkci.
 * Obsah souboru je runtime data, proto cast přes unknown.
 */
const PUBLISHED_OVERRIDES = publishedJson as unknown as OverrideMap;

const ITEMS: ContentItem[] = (() => {
  const items = [...CONTENT_ITEMS];
  for (const kind of Object.keys(PUBLISHED_OVERRIDES) as ContentItem["kind"][]) {
    const map = PUBLISHED_OVERRIDES[kind];
    if (!map) continue;
    for (const [id, override] of Object.entries(map)) {
      const index = items.findIndex((item) => item.kind === kind && item.id === id);
      const base = index >= 0 ? (items[index] as ContentItem | undefined) : undefined;
      const merged = {
        ...(base ?? ({} as ContentItem)),
        ...override,
        kind,
        id,
        createdAt: override.createdAt ?? base?.createdAt ?? "",
        updatedAt: override.updatedAt ?? base?.updatedAt ?? "",
      } as ContentItem;
      if (index >= 0) {
        items[index] = merged;
      } else {
        items.push(merged);
      }
    }
  }
  return items;
})();

const isDev = process.env.NODE_ENV === "development";

function isVisible(item: ContentItem): boolean {
  if (item.status === "archived") return false;
  return isDev || item.status === "published";
}

export function list<T extends ContentItem["kind"]>(kind: T): Extract<ContentItem, { kind: T }>[] {
  return ITEMS.filter(
    (item): item is Extract<ContentItem, { kind: T }> => item.kind === kind && isVisible(item)
  );
}

/** Všechny položky druhu bez ohledu na status (archivované, drafty v dev…). */
export function listAll<T extends ContentItem["kind"]>(
  kind: T
): Extract<ContentItem, { kind: T }>[] {
  return ITEMS.filter(
    (item): item is Extract<ContentItem, { kind: T }> => item.kind === kind
  );
}

export function get<T extends ContentItem["kind"]>(
  kind: T,
  id: string
): Extract<ContentItem, { kind: T }> | undefined {
  return list(kind).find((item) => item.id === id);
}

export function getPage<K extends PageSlug>(slug: K): PageContent<K> | undefined {
  return list("page").find(
    (item): item is PageContent<K> => item.slug === slug
  );
}

export function getSite(): SiteContent | undefined {
  return list("site")[0];
}
