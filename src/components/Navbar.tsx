"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import type { Locale } from "@/lib/types";
import { switchLocalePath, t } from "@/lib/utils";
import { getSite } from "@/content/repository";
import type { NavItem } from "@/content/types";

interface NavbarProps {
  locale: Locale;
}

const site = getSite();

const navTree: NavItem[] = site?.navigation ?? [];

type Level = "root" | "projects" | "communication";

const childItems: Record<string, NavItem[]> = {
  projects: navTree.find((n) => n.id === "projects")?.children || [],
  communication: navTree.find((n) => n.id === "projects")?.children?.find((n) => n.id === "communication")?.children || [],
};


export default function Navbar({ locale }: NavbarProps) {
  const [open, setOpen] = useState(false);
  const [level, setLevel] = useState<Level>("root");
  const pathname = usePathname();

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

  // Fokus do menu při otevření, návrat na toggle při zavření (klávesnice).
  // Na úvodním mountu se toggle nefokusuje — zamezí trvalému zobrazení
  // focus ringu (modrý outline) na triggeru bez uživatelské interakce.
  const toggleRef = useRef<HTMLButtonElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const prevOpenRef = useRef(open);

  useEffect(() => {
    if (prevOpenRef.current === open) return;
    prevOpenRef.current = open;
    if (open) {
      dialogRef.current?.focus();
    } else {
      toggleRef.current?.focus();
    }
  }, [open]);

  const switchTo: Locale = locale === "cs" ? "en" : "cs";
  const getLabel = (item: NavItem) => item.labels[locale];
  const switchPath = (target: Locale) => (pathname ? switchLocalePath(pathname, target) : `/${target}`);

  const isActive = (item: NavItem) => {
    if (!item.href) return false;
    const target = `/${locale}${item.href}`.replace(/\/$/, "");
    return pathname?.replace(/\/$/, "") === target;
  };

  const showProjects = level === "projects" || level === "communication";
  const showCommunication = level === "communication";

  const nonCommunicationProjects = childItems.projects.filter((item) => item.id !== "communication");
  const asistentiItem: NavItem = {
    id: "asistenti",
    labels: { cs: "Asistenti", en: "Assistants" },
  };
  const leftColumnItems = [...nonCommunicationProjects, asistentiItem];

  const handleActivate = (item: NavItem) => {
    if (item.children) {
      if (item.id === "projects") setLevel(showProjects ? "root" : "projects");
      else if (item.id === "communication") setLevel(showCommunication ? "projects" : "communication");
    } else if (item.href) {
      setOpen(false);
      setLevel("root");
    }
  };

  const NavItemRow = ({ item, weight }: { item: NavItem; weight: "primary" | "secondary" | "tertiary" }) => {
    const hasChildren = !!item.children;
    const isLink = !!item.href && !hasChildren;
    const active = isLink && isActive(item);

    const size = weight === "primary" ? "text-[clamp(28px,4vw,56px)] max-md:text-[clamp(23px,3.3vw,46px)]"
      : weight === "secondary" ? "text-[clamp(22px,3.2vw,44px)] max-md:text-[clamp(18px,2.6vw,36px)]"
      : "text-[clamp(18px,2.6vw,36px)] max-md:text-[clamp(15px,2.1vw,30px)]";

    const fontWeight = weight === "primary" ? 500 : weight === "secondary" ? 400 : 350;
    const textColor = active ? "var(--color-accent)"
      : weight === "primary" ? "#F4F6F8"
      : weight === "secondary" ? "rgba(244,246,248,0.40)"
      : "rgba(244,246,248,0.25)";

    const chevronColor = weight === "primary" ? "rgba(244,246,248,0.20)"
      : "rgba(244,246,248,0.10)";

    const content = (
      <span
        className={`relative block font-heading whitespace-nowrap ${size}`}
        style={{
          fontWeight,
          lineHeight: "var(--leading-heading)",
          letterSpacing: "-0.02em",
          color: textColor,
        }}
      >
        {getLabel(item)}
        {hasChildren && <span className="inline-block ml-2 align-middle text-[clamp(14px,1.5vw,20px)] max-md:text-[clamp(11px,1.2vw,16px)]" style={{ color: chevronColor }}>›</span>}
      </span>
    );

    const underline = (
      <span
        className={`block h-px mx-auto bg-gradient-to-r from-transparent via-[#F4F6F8]/25 to-transparent transition-all duration-500 ${active ? "w-2/5" : "w-0 group-hover:w-2/5"}`}
        style={{ visibility: hasChildren ? "hidden" : "visible" }}
      />
    );

    if (isLink) {
      return (
        <Link
          href={`/${locale}${item.href}`}
          onClick={() => { setOpen(false); setLevel("root"); }}
          aria-current={active ? "page" : undefined}
          className="block no-underline py-1 max-md:py-2.5 group"
        >
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
          <span className="text-label-sm tracking-[0.2em] uppercase mb-4" style={{ color: "rgba(244,246,248,0.15)", fontWeight: 500 }}>
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
          className="flex flex-wrap items-start justify-center"
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
      style={{ background: "rgba(255,255,255,0.06)" }}
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
        }}
      >
        <Link href={`/${locale}`} className="transition-opacity duration-300 hover:opacity-50">
          <span className="text-label-lg tracking-[-0.02em]">
            <span className="font-medium" style={{ color: "#F4F6F8" }}>{site?.brand.root}</span>
            <span style={{ color: "#6E7683", fontWeight: 400 }}>{site?.brand.suffix}</span>
          </span>
        </Link>

        <button
          ref={toggleRef}
          onClick={toggleMenu}
          aria-label={open ? t(locale, "ui.close") : t(locale, "ui.menu")}
          aria-expanded={open}
          className="group relative flex items-center justify-center w-11 h-11 cursor-pointer transition-colors duration-300"
          style={{ color: open ? "#F4F6F8" : "#9AA1AB" }}
          onMouseEnter={(e) => {
            e.currentTarget.style.color = "#F4F6F8";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.color = open ? "#F4F6F8" : "#9AA1AB";
          }}
        >
          <span className="relative block w-6" aria-hidden="true">
            <span
              className="block h-[2px] rounded-full bg-current transition-all duration-300"
              style={{ transform: open ? "translateY(4px) rotate(45deg)" : "translateY(-2px)" }}
            />
            <span
              className="block h-[2px] rounded-full bg-current transition-all duration-300"
              style={{ opacity: open ? 0 : 1 }}
            />
            <span
              className="block h-[2px] rounded-full bg-current transition-all duration-300"
              style={{ transform: open ? "translateY(-4px) rotate(-45deg)" : "translateY(2px)" }}
            />
          </span>
        </button>
      </nav>

      <AnimatePresence>
        {open && (
          <motion.div
            ref={dialogRef}
            tabIndex={-1}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-0 z-30 overflow-hidden"
            style={{ background: "#0A0A0B", outline: "none" }}
            onClick={(e) => { if (e.target === e.currentTarget) { setOpen(false); setLevel("root"); } }}
            onKeyDown={(e) => {
              if (e.key !== "Tab") return;
              const dialog = dialogRef.current;
              if (!dialog) return;
              const focusables = Array.from(dialog.querySelectorAll<HTMLElement>(
                'a[href], button:not([disabled]), input, select, textarea, [tabindex]:not([tabindex="-1"])'
              ));
              if (focusables.length === 0) return;
              const first = focusables[0];
              const last = focusables[focusables.length - 1];
              const active = document.activeElement;
              if (active === dialog) {
                e.preventDefault();
                (e.shiftKey ? last : first).focus();
              } else if (e.shiftKey && active === first) {
                e.preventDefault();
                last.focus();
              } else if (!e.shiftKey && active === last) {
                e.preventDefault();
                first.focus();
              }
            }}
            role="dialog"
            aria-modal="true"
            aria-label={t(locale, "ui.navigationMenu")}
          >
            {/* Navigation — same overlay layout for desktop and mobile */}
            <div
              className="relative z-10 flex flex-col h-full px-[clamp(48px,8vw,100px)] max-md:px-6"
              style={{ paddingTop: "clamp(80px, 12vh, 100px)" }}
            >
              {/* Menu items — scrollable so they never overlap the bottom layer */}
              <div className="flex-1 min-h-0 flex w-full overflow-y-auto">
                <motion.div
                  layout
                  transition={{ duration: 0.3, ease: [0.22, 0.8, 0.2, 1] }}
                  className="m-auto flex flex-wrap items-start justify-center gap-x-4 gap-y-5 py-4 px-1"
                >
                  <Column items={navTree} weight={rootWeight} className={showCommunication ? "max-md:hidden" : ""} />

                  {showCommunication ? (
                    <>
                      <Divider />
                      <Column
                        items={leftColumnItems}
                        weight={projectsWeight}
                        align="center"
                      />
                      <Divider />
                      <Column
                        items={childItems["communication"]}
                        weight="primary"
                        align="right"
                      />
                      <motion.button
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        onClick={() => setLevel("projects")}
                        className="self-center ml-4 text-label tracking-[0.15em] uppercase cursor-pointer transition-all duration-200 hover:opacity-60 whitespace-nowrap max-md:text-[12px] max-md:px-2 max-md:py-[13px] max-md:basis-full max-md:ml-0 max-md:mt-4 max-md:text-center"
                        style={{ color: "#6E7683" }}
                      >
                        ← {t(locale, "ui.back")}
                      </motion.button>
                    </>
                  ) : showProjects ? (
                    <>
                      <Divider />
                      <Column
                        items={childItems.projects}
                        weight={projectsWeight}
                        align={level === "projects" ? "right" : "center"}
                      />
                      <motion.button
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        onClick={() => setLevel("root")}
                        className="self-center ml-4 text-label tracking-[0.15em] uppercase cursor-pointer transition-all duration-200 hover:opacity-60 whitespace-nowrap max-md:text-[12px] max-md:px-2 max-md:py-[13px] max-md:basis-full max-md:ml-0 max-md:mt-4 max-md:text-center"
                        style={{ color: "#6E7683" }}
                      >
                        ← {t(locale, "ui.back")}
                      </motion.button>
                    </>
                  ) : null}
                </motion.div>
              </div>

              {/* Language switcher — just the texts on the background */}
              <div
                className="w-full flex justify-center"
                style={{ padding: "clamp(20px, 3vh, 32px) 0", paddingBottom: "max(clamp(20px, 3vh, 32px), env(safe-area-inset-bottom))" }}
              >
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5, duration: 0.4 }}
                  className="flex items-center justify-center gap-1"
                >
                  <Link href={switchPath("cs")} onClick={() => { setOpen(false); setLevel("root"); }} className="text-label-sm tracking-[0.18em] uppercase px-2.5 py-1.5 transition-all duration-200 max-md:text-label-lg max-md:px-3 max-md:py-[14px]" style={{ color: locale === "cs" ? "#F4F6F8" : "rgba(244,246,248,0.35)" }}>Česky</Link>
                  <span className="w-px h-3" style={{ background: "rgba(255,255,255,0.08)" }} aria-hidden="true" />
                  <Link href={switchPath(switchTo)} onClick={() => { setOpen(false); setLevel("root"); }} className="text-label-sm tracking-[0.18em] uppercase px-2.5 py-1.5 transition-all duration-200 max-md:text-label-lg max-md:px-3 max-md:py-[14px]" style={{ color: locale === "en" ? "#F4F6F8" : "rgba(244,246,248,0.35)" }}>English</Link>
                </motion.div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
