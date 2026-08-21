import type { ContentItem } from "../types";
import { PROJECT_ITEMS } from "./projects";
import { PROFESSION_ITEMS } from "./professions";
import { PAGE_ITEMS } from "./pages";
import { SITE_ITEM } from "./site";
import { DRAFT_ITEMS } from "./drafts";

export const CONTENT_ITEMS: ContentItem[] = [
  ...PROJECT_ITEMS,
  ...PROFESSION_ITEMS,
  ...PAGE_ITEMS,
  SITE_ITEM,
  ...(process.env.NODE_ENV === "development" ? DRAFT_ITEMS : []),
];
