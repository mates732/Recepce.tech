"use client";

import { elsewhereLinks } from "@/data/elsewhere";
import { typography, colors, duration, ease } from "@/design/tokens";
import { motion } from "framer-motion";
import { fadeInUp, staggerContainer, staggerItem, transitions, viewportConfig } from "@/design/animations";

interface Props {
  locale: string;
}

export default function Elsewhere({ locale }: Props) {
  return (
    <section
      id="elsewhere"
      className="relative w-full"
      style={{ padding: `clamp(100px, 14vw, 160px) clamp(24px, 5vw, 64px)` }}
    >
      <div className="mx-auto" style={{ maxWidth: "700px" }}>
        <motion.span
          className="block font-body mb-12"
          style={{
            fontSize: typography.size.micro,
            letterSpacing: typography.letterSpacing.mega,
            textTransform: "uppercase",
            color: colors.faint,
          }}
          initial="hidden"
          whileInView="visible"
          viewport={viewportConfig}
          variants={fadeInUp}
          transition={transitions.slower}
        >
          {locale === "cs" ? "Jinde" : "Elsewhere"}
        </motion.span>

        <motion.div
          className="flex flex-col gap-3"
          initial="hidden"
          whileInView="visible"
          viewport={viewportConfig}
          variants={staggerContainer}
          transition={transitions.slow}
        >
          {elsewhereLinks.map((link) => (
            <motion.a
              key={link.label}
              href={link.href}
              className="group flex items-center gap-3 font-body py-2"
              style={{
                fontSize: typography.size.body,
                color: "rgba(160,160,160,0.5)",
                transition: `color ${duration.slow} ${ease.default}`,
              }}
              variants={staggerItem}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = colors.primary;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = "rgba(160,160,160,0.5)";
              }}
            >
              <span>{link.label}</span>
              <svg
                width="12"
                height="12"
                viewBox="0 0 12 12"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                className="transition-all duration-500 ease-out will-change-transform group-hover:translate-x-1 opacity-0 group-hover:opacity-60"
              >
                <path d="M2 10L10 2M10 2H4M10 2v6" />
              </svg>
            </motion.a>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
