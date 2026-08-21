import type { ContentItem } from "../types";

/**
 * Draft položky — obsah, na kterém se právě pracuje.
 *
 * V development módu se renderují (preview), v produkčním buildu je tento
 * modul kompletně vyloučen z bundle (mrtvá větev podmínky v items/index.ts),
 * takže se draft obsah nikdy nedostane na veřejnost.
 *
 * Publish = přesunout položku do příslušného items souboru a nastavit
 * status: "published".
 */
export const DRAFT_ITEMS: ContentItem[] = [];
