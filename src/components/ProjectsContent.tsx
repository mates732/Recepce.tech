"use client";

import { useState, useCallback } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import type { Locale } from "@/lib/types";
import { SOCIALS } from "@/config/socials";

interface Props {
  locale: Locale;
}

interface NavItem {
  id: string;
  labelEn: string;
  labelCs: string;
  href?: string;
  children?: NavItem[];
}

const navTree: NavItem[] = [
  { id: "cortex", labelEn: "Cortex", labelCs: "Cortex", href: "/cortex" },
  {
    id: "ai-assistants", labelEn: "AI Assistants", labelCs: "AI Asistenti",
    children: [
      { id: "voice", labelEn: "Voice Assistant", labelCs: "Voice Asistent", href: "/projekty/ai-sistent/voice-assistant" },
      { id: "receptionist", labelEn: "Chat Assistant", labelCs: "Chat Asistent", href: "/projekty/ai-sistent/chat-assistant" },
    ],
  },
  {
    id: "websites", labelEn: "Websites", labelCs: "Weby",
    children: [
      { id: "zlaty-hreben", labelEn: "Zlat\u00fd H\u0159eben", labelCs: "Zlat\u00fd H\u0159eben", href: "/projekty/zlaty-hreben" },
    ],
  },
  { id: "youtube", labelEn: "YouTube", labelCs: "YouTube", href: SOCIALS.youtube || undefined },
];

const childItems: Record<string, NavItem[]> = {
  "ai-assistants": navTree.find((n) => n.id === "ai-assistants")?.children || [],
  websites: navTree.find((n) => n.id === "websites")?.children || [],
};

type Level = "root" | "ai-assistants" | "websites";

export default function ProjectsContent({ locale }: Props) {
  const [level, setLevel] = useState<Level>("root");
  const getLabel = (item: NavItem) => locale === "cs" ? item.labelCs : item.labelEn;

  const showAi = level === "ai-assistants";
  const showWebsites = level === "websites";

  const handleActivate = useCallback((item: NavItem) => {
    if (item.children) {
      if (item.id === "ai-assistants") setLevel((prev) => prev === "ai-assistants" ? "root" : "ai-assistants");
      else if (item.id === "websites") setLevel((prev) => prev === "websites" ? "root" : "websites");
    } else if (item.href) {
      if (item.id === "youtube") {
        window.open(item.href, "_blank", "noopener");
      }
    }
  }, []);

  const NavItemRow = ({ item, weight }: { item: NavItem; weight: "primary" | "secondary" | "tertiary" }) => {
    const hasChildren = !!item.children;
    const isLink = !!item.href && !hasChildren && item.id !== "youtube";

    const size = weight === "primary" ? "clamp(28px, 4vw, 56px)"
      : weight === "secondary" ? "clamp(22px, 3.2vw, 44px)"
      : "clamp(18px, 2.6vw, 36px)";

    const fontWeight = weight === "primary" ? 500 : weight === "secondary" ? 400 : 350;
    const textColor = weight === "primary" ? "#111111"
      : weight === "secondary" ? "rgba(17,17,17,0.40)"
      : "rgba(17,17,17,0.25)";

    const chevronColor = weight === "primary" ? "rgba(17,17,17,0.20)"
      : "rgba(17,17,17,0.10)";

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
        {hasChildren && (
          <span
            className="inline-block ml-2 align-middle"
            style={{ fontSize: "clamp(14px, 1.5vw, 20px)", color: chevronColor }}
          >
            &rsaquo;
          </span>
        )}
      </span>
    );

    const underline = (
      <span
        className="block h-px w-0 mx-auto bg-gradient-to-r from-transparent via-[#111111]/20 to-transparent transition-all duration-500 group-hover:w-2/5"
        style={{ visibility: hasChildren ? "hidden" : "visible" }}
      />
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
      <button onClick={() => handleActivate(item)} className="block text-left cursor-pointer py-1 group">
        {content}
        {underline}
      </button>
    );
  };

  const Column = ({ items, weight, label }: {
    items: NavItem[];
    weight: "primary" | "secondary" | "tertiary";
    label?: string;
  }) => {
    const gap = weight === "primary" ? "gap-1" : "gap-0.5";
    return (
      <div className={`flex flex-col items-center ${gap}`}>
        {label && (
          <span className="text-[9px] tracking-[0.2em] uppercase mb-4" style={{ color: "rgba(17,17,17,0.15)", fontWeight: 500 }}>
            {label}
          </span>
        )}
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

  const Section = ({ children, show }: { children: React.ReactNode; show: boolean }) => (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 30 }}
          transition={{ duration: 0.25, ease: [0.22, 0.8, 0.2, 1] }}
          className="flex flex-col items-center md:flex-row md:items-start"
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );

  const Divider = () => (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="max-md:w-full max-md:h-px max-md:my-5 w-px self-stretch mx-3 sm:mx-4"
      style={{ background: "rgba(17,17,17,0.04)" }}
    />
  );

  const rootWeight = level === "root" ? "primary" as const : "tertiary" as const;
  const childWeight = level === "ai-assistants" || level === "websites" ? "primary" as const : "secondary" as const;

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
          {locale === "cs" ? "Projekty" : "Projects"}
        </motion.p>

        <motion.div
          layout
          transition={{ duration: 0.3, ease: [0.22, 0.8, 0.2, 1] }}
          className="flex flex-col items-center md:flex-row md:items-start"
        >
          {/* Root column */}
          <Column items={navTree} weight={rootWeight} />

          {/* AI Assistants column */}
          <Section show={showAi}>
            <Divider />
            <Column items={childItems["ai-assistants"]} weight={childWeight} />
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              onClick={() => setLevel("root")}
              className="self-center max-md:ml-0 max-md:mt-2 ml-4 text-[10px] tracking-[0.15em] uppercase cursor-pointer transition-all duration-200 hover:opacity-60 whitespace-nowrap"
              style={{ color: "#9CA3AF" }}
            >
              &larr; {locale === "cs" ? "Zp\u011bt" : "Back"}
            </motion.button>
          </Section>

          {/* Websites column */}
          <Section show={showWebsites}>
            <Divider />
            <Column items={childItems.websites} weight={childWeight} />
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              onClick={() => setLevel("root")}
              className="self-center max-md:ml-0 max-md:mt-2 ml-4 text-[10px] tracking-[0.15em] uppercase cursor-pointer transition-all duration-200 hover:opacity-60 whitespace-nowrap"
              style={{ color: "#9CA3AF" }}
            >
              &larr; {locale === "cs" ? "Zp\u011bt" : "Back"}
            </motion.button>
          </Section>
        </motion.div>
      </div>
    </div>
  );
}
