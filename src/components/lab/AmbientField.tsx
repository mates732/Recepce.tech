"use client";

import { motion, useTransform, useReducedMotion } from "framer-motion";
import { useScrollY } from "@/lib/scroll";

/**
 * Globální ambientní hloubková vrstva domovské stránky.
 *
 * Jedna velká vrstva s rozptýlenými akcentními glows, která se posouvá
 * pomaleji než obsah (transform only) — sekce tak plynou nad jedním
 * souvislým prostředím místo izolovaných "ostrovů".
 *
 * - transform/opacity only, žádné scroll listenery (sdílí windowScrollY)
 * - prefers-reduced-motion → statická vrstva
 */
const SCROLL_FACTOR = 0.045;

export default function AmbientField() {
  const shouldReduce = useReducedMotion();
  const scrollY = useScrollY();
  const y = useTransform(scrollY, (v) =>
    shouldReduce ? 0 : Math.round(v * -SCROLL_FACTOR)
  );

  return (
    <div
      aria-hidden="true"
      className="absolute inset-0 overflow-hidden pointer-events-none"
    >
      <motion.div
        className="absolute inset-x-0"
        style={{ top: "-25%", height: "150%", y, willChange: "transform" }}
      >
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 65% 38% at 50% 12%, rgba(255,74,46,0.06) 0%, transparent 62%)," +
              "radial-gradient(ellipse 45% 30% at 82% 42%, rgba(255,107,61,0.04) 0%, transparent 60%)," +
              "radial-gradient(ellipse 55% 35% at 15% 68%, rgba(232,52,31,0.04) 0%, transparent 60%)," +
              "radial-gradient(ellipse 60% 32% at 60% 88%, rgba(255,74,46,0.05) 0%, transparent 62%)",
          }}
        />
      </motion.div>
    </div>
  );
}
