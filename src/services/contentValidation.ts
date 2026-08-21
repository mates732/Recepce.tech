import type { ContentItem, PageContent } from "@/content/types";
import { isSectionType } from "@/content/sections";

/**
 * Validace obsahové entity: projde všechny listové stringy,
 * ověří povinná pole a formát URL. Server-side (autoritativní),
 * stejná pravidla zrcadlí klient ve formuláři.
 */

const ID_PATTERN = /^[a-z0-9-]+$/;
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function walk(value: unknown, path: string, errors: string[]): { strings: number } {
  if (value === null || value === undefined) return { strings: 0 };

  if (typeof value === "string") {
    const trimmed = value.trim();
    if (trimmed.length === 0) {
      errors.push(`Pole "${path}" nesmí být prázdné.`);
      return { strings: 0 };
    }
    if (trimmed.startsWith("http")) {
      try {
        new URL(trimmed);
      } catch {
        errors.push(`Pole "${path}" má neplatnou URL.`);
      }
    } else if (/(^|\.)email$/.test(path) && !EMAIL_PATTERN.test(trimmed)) {
      errors.push(`Pole "${path}" má neplatný e-mail.`);
    }
    return { strings: 1 };
  }

  if (typeof value === "number" || typeof value === "boolean") return { strings: 0 };

  if (Array.isArray(value)) {
    let strings = 0;
    value.forEach((entry, index) => {
      strings += walk(entry, `${path}.${index}`, errors).strings;
    });
    return { strings };
  }

  let strings = 0;
  for (const [key, entry] of Object.entries(value as Record<string, unknown>)) {
    strings += walk(entry, path ? `${path}.${key}` : key, errors).strings;
  }
  return { strings };
}

export function validateContentItem(item: ContentItem): string[] {
  const errors: string[] = [];

  if (!ID_PATTERN.test(item.id)) {
    errors.push(`Neplatné id: "${item.id}" (povoleny jsou pouze malá písmena, číslice a pomlčky).`);
  }

  if (item.kind === "page") {
    errors.push(...validatePageSections(item as PageContent));
  }

  const { strings } = walk(item, "", errors);

  if (strings === 0) {
    errors.push("Entita neobsahuje žádný editovatelný text.");
  }

  return errors;
}

/**
 * Validace sekcí stránky: sekce musí existovat v registru, být unikátní
 * a pro každou musí existovat obsahový klíč v data.
 */
export function validatePageSections(page: PageContent): string[] {
  const errors: string[] = [];
  const sections = (page.data as { sections?: unknown }).sections;

  if (!Array.isArray(sections)) {
    return ["Chybí pole data.sections."];
  }

  const seen = new Set<string>();
  for (const [index, instance] of sections.entries()) {
    if (!instance || typeof instance !== "object") {
      errors.push(`Sekce na pozici ${index} není platný objekt.`);
      continue;
    }
    const type = (instance as { section?: unknown }).section;
    if (typeof type !== "string" || !isSectionType(type)) {
      errors.push(`Sekce na pozici ${index} má neplatný typ: "${String(type)}".`);
      continue;
    }
    if (seen.has(type)) {
      errors.push(`Sekce "${type}" je v pořadí duplikovaná.`);
    }
    seen.add(type);

    const data = page.data as Record<string, unknown>;
    if (!(type in data)) {
      errors.push(`Sekce "${type}" nemá v data odpovídající obsah.`);
    }

    if (typeof (instance as { visible?: unknown }).visible !== "boolean") {
      errors.push(`Sekce "${type}" musí mít pole visible (boolean).`);
    }
  }

  return errors;
}
