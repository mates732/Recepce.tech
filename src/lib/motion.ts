"use client";

import type { Variants } from "framer-motion";

/**
 * Jednotný motion jazyk.
 *
 * - reveal:   sekční hlavičky — opacity + translateY + rozostření
 * - fadeUp:   karty a obsah — čistý transform/opacity (žádný blur, performance)
 * - stagger:  sekvence karet (max ~5–6 položek, ~80ms krok)
 *
 * Pravidlo: motion sděluje informaci — reveal uvádí, fadeUp řadí, blur jen tam,
 * kde je málo elementů (hlavičky), ne v gridu.
 */

export const EASE = [0.16, 1, 0.3, 1] as const;

export const reveal: Variants = {
  hidden: { opacity: 0, y: 40, filter: "blur(10px)" },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.8, ease: EASE },
  },
};

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: EASE },
  },
};

export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.7, ease: EASE } },
};

export const stagger: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.08, delayChildren: 0.06 },
  },
};

/**
 * Sledovací světlo karty — nastaví --mx/--my na elementu.
 * Komponenta potřebuje utility `card-light`.
 */
export function cardLightHandler(e: React.MouseEvent<HTMLElement>): void {
  const el = e.currentTarget;
  const rect = el.getBoundingClientRect();
  el.style.setProperty("--mx", `${e.clientX - rect.left}px`);
  el.style.setProperty("--my", `${e.clientY - rect.top}px`);
}
