"use client";

import { useState, useCallback } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import type { Locale } from "@/lib/types";

interface Props {
  locale: Locale;
}

interface NavItem {
  id: string;
  labelEn: string;
  labelCs: string;
  href?: string;
  external?: boolean;
  children?: NavItem[];
}

const navTree: NavItem[] = [
  {
    id: "zlaty-hreben",
    labelEn: "Zlat\u00fd H\u0159eben",
    labelCs: "Zlat\u00fd H\u0159eben",
    href: "/projekty/zlaty-hreben",
  },
];

export default function WebsitesContent({ locale }: Props) {
  const getLabel = (item: NavItem) => locale === "cs" ? item.labelCs : item.labelEn;

  const NavItemRow = ({ item, weight }: { item: NavItem; weight: "primary" | "secondary" | "tertiary" }) => {
    const hasChildren = !!item.children && !item.href;
    const isLink = !!item.href && !hasChildren && !item.external;

    const size = weight === "primary" ? "clamp(28px, 4vw, 56px)"
      : weight === "secondary" ? "clamp(22px, 3.2vw, 44px)"
      : "clamp(18px, 2.6vw, 36px)";

    const fontWeight = weight === "primary" ? 500 : weight === "secondary" ? 400 : 350;
    const textColor = weight === "primary" ? "#111111"
      : weight === "secondary" ? "rgba(17,17,17,0.40)"
      : "rgba(17,17,17,0.25)";

    const content = (
      <span
        className="relative block font-heading whitespace-nowrap"
        style={{
          fontSize: size,
          fontWeight,
          lineHeight: 1.15,
          letterSpacing: "-0.02em",
          color: textColor,
        }}
      >
        {getLabel(item)}
      </span>
    );

    const underline = (
      <span className="block h-px w-0 mx-auto bg-gradient-to-r from-transparent via-[#111111]/20 to-transparent transition-all duration-500 group-hover:w-2/5" />
    );

    if (isLink) {
      return (
        <Link href={`/${locale}${item.href}`} className="block no-underline py-1 group">
          {content}
          {underline}
        </Link>
      );
    }

    return (
      <button className="block text-left cursor-pointer py-1 group">
        {content}
        {underline}
      </button>
    );
  };

  const Column = ({ items, weight }: {
    items: NavItem[];
    weight: "primary" | "secondary" | "tertiary";
  }) => {
    const gap = weight === "primary" ? "gap-1" : "gap-0.5";
    return (
      <div className={`flex flex-col items-center ${gap}`}>
        {items.map((item, i) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 20, filter: "blur(6px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ delay: 0.04 * i, duration: 0.6, ease: [0.22, 0.8, 0.2, 1] }}
          >
            <NavItemRow item={item} weight={weight} />
          </motion.div>
        ))}
      </div>
    );
  };

  return (
    <div className="relative flex flex-col items-center justify-center" style={{ background: "#F7F8FA", minHeight: "100vh", padding: "clamp(80px, 10vw, 120px) clamp(24px, 5vw, 80px)" }}>
      <div className="flex flex-col items-center justify-center flex-1 w-full overflow-hidden">
        <motion.p
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="text-[10px] font-mono font-semibold tracking-[0.15em] uppercase mb-8 sm:mb-10"
          style={{ color: "#9CA3AF" }}
        >
          {locale === "cs" ? "WEBY" : "WEBS"}
        </motion.p>

        <motion.div
          layout
          transition={{ duration: 0.3, ease: [0.22, 0.8, 0.2, 1] }}
          className="flex items-start"
        >
          <Column items={navTree} weight="primary" />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            delay: 0.04 * navTree.length + 0.2,
            duration: 0.4,
            ease: [0.22, 0.8, 0.2, 1],
          }}
          className="mt-12 sm:mt-14"
        >
          <Link
            href={`/${locale}/projekty`}
            className="inline-block transition-all duration-200 hover:opacity-60"
            style={{
              fontSize: "clamp(14px, 1.5vw, 20px)",
              color: "rgba(17,17,17,0.25)",
              fontWeight: 350,
            }}
          >
            &larr; {locale === "cs" ? "Zp\u011bt" : "Back"}
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
