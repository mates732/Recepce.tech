"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import type { Locale } from "@/lib/types";

interface NavbarProps {
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
  { id: "home", labelEn: "Home", labelCs: "Domů", href: "/" },
  {
    id: "projects", labelEn: "Projects", labelCs: "Projekty",
    children: [
      { id: "cortex", labelEn: "Cortex", labelCs: "Cortex", href: "/cortex" },
      {
        id: "ai-assistants", labelEn: "AI Assistants", labelCs: "AI Asistenti",
        children: [
          { id: "overview", labelEn: "Overview", labelCs: "Přehled", href: "/ai.assistent" },
          { id: "voice", labelEn: "Voice Assistant", labelCs: "Voice asistent", href: "/projekty/ai-sistent/voice-assistant" },
          { id: "chat", labelEn: "Chat Assistant", labelCs: "Chat asistent", href: "/projekty/ai-sistent/chat-assistant" },
        ],
      },
      { id: "websites", labelEn: "Websites", labelCs: "Weby", href: "/webs" },
      { id: "youtube", labelEn: "YouTube", labelCs: "YouTube", href: "/youtube" },
    ],
  },
  { id: "about", labelEn: "About", labelCs: "O mně", href: "/about" },
  { id: "contact", labelEn: "Contact", labelCs: "Kontakt", href: "/contact" },
];

type Level = "root" | "projects" | "ai-assistants";

const childItems: Record<string, NavItem[]> = {
  projects: navTree.find((n) => n.id === "projects")?.children || [],
  "ai-assistants": navTree.find((n) => n.id === "projects")?.children?.find((n) => n.id === "ai-assistants")?.children || [],
};


export default function Navbar({ locale }: NavbarProps) {
  const [open, setOpen] = useState(false);
  const [level, setLevel] = useState<Level>("root");
  const pathname = usePathname();

  const navBg = (() => {
    if (!pathname) return "#F7F8FA";
    if (pathname.includes("/ai.assistent") || pathname.includes("/voice-assistant") || pathname.includes("/chat-assistant")) return "#FFFFFF";
    return "#F7F8FA";
  })();

  const toggleMenu = useCallback(() => setOpen((v) => !v), []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") { setOpen(false); setLevel("root"); }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    if (!open) setLevel("root");
  }, [open]);

  const switchTo: Locale = locale === "cs" ? "en" : "cs";
  const getLabel = (item: NavItem) => locale === "cs" ? item.labelCs : item.labelEn;

  const showProjects = level === "projects" || level === "ai-assistants";
  const showAi = level === "ai-assistants";

  const handleActivate = (item: NavItem) => {
    if (item.children) {
      if (item.id === "projects") setLevel(showProjects ? "root" : "projects");
      else if (item.id === "ai-assistants") setLevel(showAi ? "projects" : "ai-assistants");
    } else if (item.href) {
      setOpen(false);
      setLevel("root");
    }
  };

  const NavItemRow = ({ item, weight }: { item: NavItem; weight: "primary" | "secondary" | "tertiary" }) => {
    const hasChildren = !!item.children;
    const isLink = !!item.href && !hasChildren;

    const size = weight === "primary" ? "text-[clamp(28px,4vw,56px)] max-md:text-[clamp(23px,3.3vw,46px)]"
      : weight === "secondary" ? "text-[clamp(22px,3.2vw,44px)] max-md:text-[clamp(18px,2.6vw,36px)]"
      : "text-[clamp(18px,2.6vw,36px)] max-md:text-[clamp(15px,2.1vw,30px)]";

    const fontWeight = weight === "primary" ? 500 : weight === "secondary" ? 400 : 350;
    const textColor = weight === "primary" ? "#111111"
      : weight === "secondary" ? "rgba(17,17,17,0.40)"
      : "rgba(17,17,17,0.25)";

    const chevronColor = weight === "primary" ? "rgba(17,17,17,0.20)"
      : "rgba(17,17,17,0.10)";

    const content = (
      <span
        className={`relative block font-heading whitespace-nowrap ${size}`}
        style={{
          fontWeight,
          lineHeight: 1.15,
          letterSpacing: "-0.02em",
          color: textColor,
        }}
      >
        {getLabel(item)}
        {hasChildren && <span className="inline-block ml-2 align-middle text-[clamp(14px,1.5vw,20px)] max-md:text-[clamp(11px,1.2vw,16px)]" style={{ color: chevronColor }}>›</span>}
      </span>
    );

    const underline = (
      <span className="block h-px w-0 mx-auto bg-gradient-to-r from-transparent via-[#111111]/20 to-transparent transition-all duration-500 group-hover:w-2/5" style={{ visibility: hasChildren ? "hidden" : "visible" }} />
    );

    if (isLink) {
      return (
        <Link href={`/${locale}${item.href}`} onClick={() => { setOpen(false); setLevel("root"); }} className="block no-underline py-1 max-md:py-2.5 group">
          {content}
          {underline}
        </Link>
      );
    }

    return (
      <button onClick={() => handleActivate(item)} className="block text-left cursor-pointer py-1 max-md:py-2.5 group">
        {content}
        {underline}
      </button>
    );
  };

  const Column = ({ items, weight, align = "center", label, className = "" }: {
    items: NavItem[];
    weight: "primary" | "secondary" | "tertiary";
    align?: "center" | "right";
    label?: string;
    className?: string;
  }) => {
    const gap = weight === "primary" ? "gap-1" : "gap-0.5";
    const alignClass = align === "right" ? "items-end" : "items-center";
    return (
      <div className={`flex flex-col ${alignClass} ${gap} ${className}`}>
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
          className="flex items-start"
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
      className="w-px self-stretch mx-3 sm:mx-4"
      style={{ background: "rgba(17,17,17,0.04)" }}
    />
  );

  const rootWeight = level === "root" ? "primary" as const : "tertiary" as const;
  const projectsWeight = level === "projects" ? "primary" as const : "secondary" as const;

  return (
    <>
      <nav
        className="fixed top-0 left-0 right-0 z-40 flex items-center justify-between"
        style={{
          padding: `${"max(10px, env(safe-area-inset-top))"} ${"clamp(24px,5vw,80px)"}`,
          paddingLeft: `max(clamp(24px,5vw,80px), env(safe-area-inset-left))`,
          paddingRight: `max(clamp(24px,5vw,80px), env(safe-area-inset-right))`,
          background: navBg,
        }}
      >
        <Link href={`/${locale}`} className="transition-opacity duration-300 hover:opacity-50">
          <span className="text-[11px] tracking-[-0.02em]">
            <span className="font-medium">recepce</span>
            <span className="text-[#5F6368]" style={{ fontWeight: 400 }}>.tech</span>
          </span>
        </Link>

        <button
          onClick={toggleMenu}
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          className="transition-opacity duration-300 hover:opacity-50 max-md:py-2.5 max-md:pl-6 max-md:pr-0"
        >
          <span className="text-[10px] tracking-[0.15em] uppercase" style={{ color: open ? "#111111" : "#9CA3AF" }}>
            {open ? (locale === "cs" ? "Zavřít" : "Close") : (locale === "cs" ? "Menu" : "Menu")}
          </span>
        </button>

        <div
          aria-hidden="true"
          className="absolute left-0 right-0 pointer-events-none"
          style={{
            top: "100%",
            height: "clamp(8px, 1.5vw, 16px)",
            background: `linear-gradient(to bottom, ${navBg}, transparent)`,
          }}
        />
      </nav>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-0 z-30 overflow-hidden"
            style={{ background: "#F7F8FA" }}
            onClick={(e) => { if (e.target === e.currentTarget) { setOpen(false); setLevel("root"); } }}
            role="dialog"
            aria-modal="true"
            aria-label="Navigation menu"
          >
            {/* Navigation — same overlay layout for desktop and mobile */}
            <div
              className="relative z-10 flex flex-col items-center justify-center h-full px-[clamp(48px,8vw,100px)] max-md:px-6"
              style={{ paddingTop: "clamp(80px, 12vh, 100px)", paddingBottom: "clamp(80px, 12vh, 100px)" }}
            >
              <div className="flex items-center justify-center flex-1 w-full overflow-hidden">
                <motion.div
                  layout
                  transition={{ duration: 0.3, ease: [0.22, 0.8, 0.2, 1] }}
          className="flex items-start max-md:flex-wrap"
                >
                  <Column items={navTree} weight={rootWeight} className={showAi ? "max-md:hidden" : ""} />

                  <Section show={showProjects}>
                    <Divider />
                    <Column
                      items={childItems.projects}
                      weight={projectsWeight}
                      align={level === "projects" ? "right" : "center"}
                    />
                    {!showAi && (
                      <motion.button
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        onClick={() => setLevel("root")}
                        className="self-center ml-4 text-[10px] tracking-[0.15em] uppercase cursor-pointer transition-all duration-200 hover:opacity-60 whitespace-nowrap max-md:text-[12px] max-md:px-2 max-md:py-[13px] max-md:basis-full max-md:ml-0 max-md:mt-4 max-md:text-center"
                        style={{ color: "#9CA3AF" }}
                      >
                        ← {locale === "cs" ? "Zpět" : "Back"}
                      </motion.button>
                    )}
                  </Section>

                  <Section show={showAi}>
                    <Divider />
                    <Column
                      items={childItems["ai-assistants"]}
                      weight="primary"
                      align="right"
                    />
                    <motion.button
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.2 }}
                      onClick={() => setLevel("projects")}
                      className="self-center ml-4 text-[10px] tracking-[0.15em] uppercase cursor-pointer transition-all duration-200 hover:opacity-60 whitespace-nowrap max-md:text-[12px] max-md:px-2 max-md:py-[13px] max-md:basis-full max-md:ml-0 max-md:mt-4 max-md:text-center"
                      style={{ color: "#9CA3AF" }}
                    >
                      ← {locale === "cs" ? "Zpět" : "Back"}
                    </motion.button>
                  </Section>
                </motion.div>
              </div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5, duration: 0.4 }}
                className="flex items-center justify-center gap-1 mt-8"
              >
                <Link href={`/${locale}`} onClick={() => { setOpen(false); setLevel("root"); }} className="text-[9px] tracking-[0.18em] uppercase px-2.5 py-1.5 transition-all duration-200 max-md:text-[11px] max-md:px-3 max-md:py-[14px]" style={{ color: locale === "cs" ? "#111111" : "rgba(17,17,17,0.35)" }}>Česky</Link>
                <span className="w-px h-3" style={{ background: "rgba(17,17,17,0.08)" }} aria-hidden="true" />
                <Link href={`/${switchTo}`} onClick={() => { setOpen(false); setLevel("root"); }} className="text-[9px] tracking-[0.18em] uppercase px-2.5 py-1.5 transition-all duration-200 max-md:text-[11px] max-md:px-3 max-md:py-[14px]" style={{ color: locale === "en" ? "#111111" : "rgba(17,17,17,0.35)" }}>English</Link>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
