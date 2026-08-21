"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import type { Locale } from "@/lib/types";
import { t } from "@/lib/utils";
import { list, getPage } from "@/content/repository";
import ProjectCard from "@/components/ProjectCard";

interface Props {
  locale: Locale;
}

const ASSISTANT_IDS = ["voice", "chat"];

export default function CommunicationContent({ locale }: Props) {
  const isCs = locale === "cs";
  const badge = getPage("communication")?.data.badge[locale] ?? "";
  const items = list("project").filter((p) => ASSISTANT_IDS.includes(p.id));

  return (
    <div
      className="relative flex flex-col items-center justify-center"
      style={{
        minHeight: "100dvh",
        padding: "clamp(80px, 12vh, 100px) clamp(48px, 8vw, 100px)",
        background: "#0A0A0B",
      }}
    >
      <div className="flex flex-col items-center w-full max-w-3xl mx-auto">
        <motion.span
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="text-label font-mono font-semibold tracking-[0.15em] uppercase mb-8 sm:mb-10"
          style={{ color: "#6E7683" }}
        >
          {badge}
        </motion.span>

        <div className="flex flex-col sm:flex-row items-center gap-6 sm:gap-8 w-full justify-center">
          {items.map((item, i) => (
            <div key={item.id} className="w-full sm:w-1/2 max-w-[320px]">
              <ProjectCard
                locale={locale}
                name={item.name[locale]}
                desc={item.tagline[locale]}
                badge={item.badge[locale]}
                poster={item.poster}
                href={item.href}
                index={i}
              />
            </div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            delay: 0.04 * items.length + 0.2,
            duration: 0.4,
            ease: [0.22, 0.8, 0.2, 1],
          }}
          className="mt-12 sm:mt-14"
        >
          <Link
            href={`/${locale}/projekty`}
            className="inline-block transition-all duration-200 hover:opacity-60"
            style={{
              fontSize: "var(--text-body)",
              color: "rgba(255,255,255,0.25)",
              fontWeight: 400,
            }}
          >
            &larr; {t(locale, "ui.back")}
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
