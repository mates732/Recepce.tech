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

function getItemById(id: string): NavItem | undefined {
  for (const item of navTree) {
    if (item.id === id) return item;
    if (item.children) {
      for (const child of item.children) {
        if (child.id === id) return child;
      }
    }
  }
  return undefined;
}

function getScreenLabel(screen: string, locale: Locale): string {
  if (screen === "root") return "";
  const item = getItemById(screen);
  if (!item) return "";
  return locale === "cs" ? item.labelCs : item.labelEn;
}

function getItemsForScreen(screen: string): NavItem[] {
  if (screen === "root") return navTree;
  if (screen === "projects") return childItems.projects;
  if (screen === "ai-assistants") return childItems["ai-assistants"];
  return [];
}

type ScreenId = "root" | "projects" | "ai-assistants";

function MobileNavigation({
  locale,
  onClose,
}: {
  locale: Locale;
  onClose: () => void;
}) {
  const [stack, setStack] = useState<ScreenId[]>(["root"]);
  const [direction, setDirection] = useState<number>(0);

  const currentScreen = stack[stack.length - 1];
  const items = getItemsForScreen(currentScreen);
  const isRoot = currentScreen === "root";
  const screenLabel = getScreenLabel(currentScreen, locale);

  const push = useCallback((id: ScreenId) => {
    setDirection(1);
    setStack((prev) => [...prev, id]);
  }, []);

  const pop = useCallback(() => {
    if (stack.length > 1) {
      setDirection(-1);
      setStack((prev) => prev.slice(0, -1));
    }
  }, [stack.length]);

  const getLabel = useCallback(
    (item: NavItem) => (locale === "cs" ? item.labelCs : item.labelEn),
    [locale],
  );

  const handleItemClick = useCallback(
    (item: NavItem) => {
      if (item.children) {
        if (item.id === "projects") push("projects");
        else if (item.id === "ai-assistants") push("ai-assistants");
      }
    },
    [push],
  );

  const switchTo: Locale = locale === "cs" ? "en" : "cs";

  const slideVariants = {
    enter: (dir: number) => ({
      x: dir > 0 ? "100%" : "-30%",
    }),
    center: { x: 0 },
    exit: (dir: number) => ({
      x: dir > 0 ? "-30%" : "100%",
    }),
  };

  const slideTransition = {
    duration: 0.275,
    ease: [0.22, 1, 0.36, 1] as const,
  };

  return (
    <div
      className="flex h-full flex-col bg-white"
      style={{
        paddingTop: "max(env(safe-area-inset-top), 0px)",
        paddingBottom: "max(env(safe-area-inset-bottom), 0px)",
      }}
    >
      {!isRoot && (
        <div className="flex-shrink-0 border-b border-black/[0.06]">
          <div
            className="flex items-center"
            style={{
              paddingLeft: "max(12px, env(safe-area-inset-left))",
              paddingRight: "max(20px, env(safe-area-inset-right))",
            }}
          >
            <button
              onClick={pop}
              className="flex min-h-[52px] cursor-pointer items-center gap-1 text-left focus-visible:opacity-60"
              style={{ color: "#007AFF" }}
              aria-label={`${locale === "cs" ? "Zpět" : "Back"} ${screenLabel}`}
            >
              <span className="text-2xl font-light leading-none">&lsaquo;</span>
              <span className="text-[17px] font-normal leading-none">
                {screenLabel}
              </span>
            </button>
          </div>
        </div>
      )}

      <div className="flex-1 overflow-y-auto">
        <div
          className="min-h-full"
          style={{
            paddingLeft: "max(24px, env(safe-area-inset-left))",
            paddingRight: "max(24px, env(safe-area-inset-right))",
          }}
        >
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={currentScreen}
              custom={direction}
              variants={slideVariants}
              initial={direction === 0 ? false : "enter"}
              animate="center"
              exit="exit"
              transition={slideTransition}
            >
              <nav
                role="navigation"
                aria-label={
                  isRoot ? "Main navigation" : screenLabel
                }
                className="pt-2"
              >
                {items.map((item) => {
                  const hasChildren = !!item.children;
                  const isLink = !!item.href && !hasChildren;
                  const label = getLabel(item);

                  const row = (
                    <div className="flex min-h-[56px] items-center justify-between py-[14px]">
                      <span
                        className="text-[24px] font-medium leading-tight tracking-tight"
                        style={{
                          color: "#111111",
                          fontFamily:
                            "var(--font-body), system-ui, sans-serif",
                        }}
                      >
                        {label}
                      </span>
                      {hasChildren && (
                        <span
                          className="text-[20px] leading-none"
                          style={{ color: "rgba(17,17,17,0.2)" }}
                          aria-hidden="true"
                        >
                          ›
                        </span>
                      )}
                    </div>
                  );

                  if (isLink) {
                    return (
                      <div key={item.id}>
                        <Link
                          href={`/${locale}${item.href}`}
                          onClick={onClose}
                          className="block no-underline transition-opacity duration-150 focus-visible:opacity-60 active:opacity-60"
                        >
                          {row}
                        </Link>
                        <div className="ml-0 h-px bg-black/[0.06]" />
                      </div>
                    );
                  }

                  return (
                    <div key={item.id}>
                      <button
                        onClick={() => handleItemClick(item)}
                        className="block w-full cursor-pointer text-left transition-opacity duration-150 focus-visible:opacity-60 active:opacity-60"
                        aria-haspopup={hasChildren ? "true" : undefined}
                      >
                        {row}
                      </button>
                      <div className="ml-0 h-px bg-black/[0.06]" />
                    </div>
                  );
                })}
              </nav>

              {isRoot && (
                <div className="mt-12">
                  <div className="flex items-center gap-3">
                    <Link
                      href={`/${locale}`}
                      onClick={onClose}
                      className="text-[13px] font-medium uppercase tracking-[0.04em] no-underline transition-opacity duration-200 focus-visible:opacity-60"
                      style={{
                        color:
                          locale === "cs"
                            ? "#111111"
                            : "rgba(17,17,17,0.35)",
                      }}
                    >
                      Česky
                    </Link>
                    <span
                      className="inline-block h-3 w-px"
                      style={{
                        backgroundColor: "rgba(17,17,17,0.12)",
                      }}
                      aria-hidden="true"
                    />
                    <Link
                      href={`/${switchTo}`}
                      onClick={onClose}
                      className="text-[13px] font-medium uppercase tracking-[0.04em] no-underline transition-opacity duration-200 focus-visible:opacity-60"
                      style={{
                        color:
                          locale === "en"
                            ? "#111111"
                            : "rgba(17,17,17,0.35)",
                      }}
                    >
                      English
                    </Link>
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

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
        {hasChildren && <span className="inline-block ml-2 align-middle" style={{ fontSize: "clamp(14px, 1.5vw, 20px)", color: chevronColor }}>›</span>}
      </span>
    );

    const underline = (
      <span className="block h-px w-0 mx-auto bg-gradient-to-r from-transparent via-[#111111]/20 to-transparent transition-all duration-500 group-hover:w-2/5" style={{ visibility: hasChildren ? "hidden" : "visible" }} />
    );

    if (isLink) {
      return (
        <Link href={`/${locale}${item.href}`} onClick={() => { setOpen(false); setLevel("root"); }} className="block no-underline py-1 group">
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

  const Column = ({ items, weight, align = "center", label }: {
    items: NavItem[];
    weight: "primary" | "secondary" | "tertiary";
    align?: "center" | "right";
    label?: string;
  }) => {
    const gap = weight === "primary" ? "gap-1" : "gap-0.5";
    const alignClass = align === "right" ? "items-end" : "items-center";
    return (
      <div className={`flex flex-col ${alignClass} ${gap}`}>
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
          className="transition-opacity duration-300 hover:opacity-50"
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
            {/* Desktop — unchanged */}
            <div
              className="relative z-10 hidden flex-col items-center justify-center h-full md:flex"
              style={{ padding: `clamp(80px, 12vh, 100px) clamp(48px, 8vw, 100px)` }}
            >
              <div className="flex items-center justify-center flex-1 w-full overflow-hidden">
                <motion.div
                  layout
                  transition={{ duration: 0.3, ease: [0.22, 0.8, 0.2, 1] }}
                  className="flex items-start"
                >
                  <Column items={navTree} weight={rootWeight} />

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
                        className="self-center ml-4 text-[10px] tracking-[0.15em] uppercase cursor-pointer transition-all duration-200 hover:opacity-60 whitespace-nowrap"
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
                      className="self-center ml-4 text-[10px] tracking-[0.15em] uppercase cursor-pointer transition-all duration-200 hover:opacity-60 whitespace-nowrap"
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
                <Link href={`/${locale}`} onClick={() => { setOpen(false); setLevel("root"); }} className="text-[9px] tracking-[0.18em] uppercase px-2.5 py-1.5 transition-all duration-200" style={{ color: locale === "cs" ? "#111111" : "rgba(17,17,17,0.35)" }}>Česky</Link>
                <span className="w-px h-3" style={{ background: "rgba(17,17,17,0.08)" }} aria-hidden="true" />
                <Link href={`/${switchTo}`} onClick={() => { setOpen(false); setLevel("root"); }} className="text-[9px] tracking-[0.18em] uppercase px-2.5 py-1.5 transition-all duration-200" style={{ color: locale === "en" ? "#111111" : "rgba(17,17,17,0.35)" }}>English</Link>
              </motion.div>
            </div>

            {/* Mobile — iOS-style */}
            <div className="flex h-full md:hidden">
              <MobileNavigation
                locale={locale}
                onClose={() => { setOpen(false); setLevel("root"); }}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
