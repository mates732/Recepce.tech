"use client";

import type { Locale } from "@/lib/types";
import { colors, typography } from "@/design/tokens";
import { motion } from "framer-motion";
import { fadeInUp, transitions, viewportConfig } from "@/design/animations";

interface Props {
  locale: Locale;
}

export default function ProjectGallery({ locale }: Props) {
  return (
    <div>
      <motion.span
        className="block font-mono mb-10"
        style={{
          fontSize: "10px",
          letterSpacing: typography.letterSpacing.mega,
          textTransform: "uppercase",
          color: colors.faint,
        }}
        initial="hidden"
        whileInView="visible"
        viewport={viewportConfig}
        variants={fadeInUp}
        transition={transitions.slow}
      >
        {locale === "cs" ? "Galerie" : "Gallery"}
      </motion.span>

      <div className="grid gap-4 sm:grid-cols-2">
        <motion.div
          className="w-full rounded-xl flex items-center justify-center sm:col-span-2"
          style={{
            height: "clamp(240px, 30vw, 360px)",
            background: "rgba(255,255,255,0.012)",
            border: "1px solid rgba(255,255,255,0.04)",
            backgroundImage: "radial-gradient(circle at 1px 1px, rgba(255,255,255,0.03) 1px, transparent 0)",
            backgroundSize: "24px 24px",
          }}
          initial="hidden"
          whileInView="visible"
          viewport={viewportConfig}
          variants={fadeInUp}
          transition={transitions.slow}
        >
          <span className="font-body" style={{ fontSize: typography.size.caption, color: colors.faint }}>
            {locale === "cs" ? "Screenshot" : "Screenshot"}
          </span>
        </motion.div>
        <motion.div
          className="w-full rounded-xl flex items-center justify-center"
          style={{
            height: "clamp(180px, 22vw, 260px)",
            background: "rgba(255,255,255,0.012)",
            border: "1px solid rgba(255,255,255,0.04)",
            backgroundImage: "radial-gradient(circle at 1px 1px, rgba(255,255,255,0.03) 1px, transparent 0)",
            backgroundSize: "24px 24px",
          }}
          initial="hidden"
          whileInView="visible"
          viewport={viewportConfig}
          variants={fadeInUp}
          transition={{ ...transitions.slow, delay: 0.1 }}
        >
          <span className="font-body" style={{ fontSize: typography.size.caption, color: colors.faint }}>
            {locale === "cs" ? "Detail" : "Detail"}
          </span>
        </motion.div>
        <motion.div
          className="w-full rounded-xl flex items-center justify-center"
          style={{
            height: "clamp(180px, 22vw, 260px)",
            background: "rgba(255,255,255,0.012)",
            border: "1px solid rgba(255,255,255,0.04)",
            backgroundImage: "radial-gradient(circle at 1px 1px, rgba(255,255,255,0.03) 1px, transparent 0)",
            backgroundSize: "24px 24px",
          }}
          initial="hidden"
          whileInView="visible"
          viewport={viewportConfig}
          variants={fadeInUp}
          transition={{ ...transitions.slow, delay: 0.2 }}
        >
          <span className="font-body" style={{ fontSize: typography.size.caption, color: colors.faint }}>
            {locale === "cs" ? "Ukázka" : "Preview"}
          </span>
        </motion.div>
      </div>
    </div>
  );
}
