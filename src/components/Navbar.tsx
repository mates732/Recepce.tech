"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import type { Locale } from "@/lib/types";
import { switchLocalePath, t } from "@/lib/utils";
import { getSite } from "@/content/repository";

interface NavbarProps {
  locale: Locale;
}

const site = getSite();

const navItems = [
  { id: "home", labels: { cs: "Domů", en: "Home" }, href: "/" },
  {
    id: "projects",
    labels: { cs: "Projekty", en: "Projects" },
    children: [
      { id: "cortex", labels: { cs: "Cortex", en: "Cortex" }, href: "/projekty/cortex" },
      {
        id: "asistenti",
        labels: { cs: "Asistenti", en: "Assistants" },
        href: "/projekty/asistenti",
        children: [
          { id: "telefonni", labels: { cs: "Telefonní asistent", en: "Phone Assistant" }, href: "/projekty/asistenti/telefonni-asistent" },
          { id: "chat", labels: { cs: "Chat asistent", en: "Chat Assistant" }, href: "/projekty/asistenti/chat-asistent" },
        ],
      },
      { id: "weby", labels: { cs: "Weby", en: "Websites" }, href: "/projekty/weby" },
    ],
  },
  { id: "about", labels: { cs: "O mně", en: "About" }, href: "/o-mne" },
  { id: "contact", labels: { cs: "Kontakt", en: "Contact" }, href: "/kontakt" },
];

export default function Navbar({ locale }: NavbarProps) {
  const [open, setOpen] = useState(false);
  const [submenuOpen, setSubmenuOpen] = useState(false);
  const [thirdOpen, setThirdOpen] = useState(false);
  const pathname = usePathname();

  const toggleMenu = useCallback(() => setOpen((v) => !v), []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (thirdOpen) {
          setThirdOpen(false);
        } else if (submenuOpen) {
          setSubmenuOpen(false);
        } else {
          setOpen(false);
        }
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [submenuOpen, thirdOpen]);

  useEffect(() => {
    if (!open) {
      setSubmenuOpen(false);
      setThirdOpen(false);
    }
  }, [open]);

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
  const getLabel = (item: { labels: Record<string, string> }) => item.labels[locale];
  const switchPath = (target: Locale) => (pathname ? switchLocalePath(pathname, target) : `/${target}`);

  const isActive = (href: string) => {
    const target = `/${locale}${href}`.replace(/\/$/, "");
    return pathname?.replace(/\/$/, "") === target;
  };

  const handleOpenSubmenu = () => {
    setSubmenuOpen(true);
    setThirdOpen(false);
  };

  const handleOpenThird = () => {
    setThirdOpen(true);
  };

  const handleBackToSubmenu = () => {
    setThirdOpen(false);
  };

  const handleNavigate = (href: string) => {
    setOpen(false);
    setSubmenuOpen(false);
    setThirdOpen(false);
  };

  // Determine depth for left panel animation
  const depth = thirdOpen ? 2 : submenuOpen ? 1 : 0;

  const leftPanelVariants = {
    initial: { x: "0%", scale: 1, opacity: 1 },
    depth1: { x: "-5%", scale: 0.88, opacity: 0.6 },
    depth2: { x: "-10%", scale: 0.78, opacity: 0.4 },
  };

  const rightPanelVariants = {
    hidden: { x: "100%", opacity: 0 },
    visible: { x: "0%", opacity: 1 },
  };

  const projectsChildren = navItems.find(i => i.id === "projects")?.children ?? [];
  const asistentiItem = projectsChildren.find(c => c.id === "asistenti") as
    | { id: string; labels: Record<string, string>; href: string; children: { id: string; labels: Record<string, string>; href: string }[] }
    | undefined;
  const asistentiChildren = asistentiItem?.children ?? [];

  return (
    <>
      {/* ─── Top bar (logo + hamburger) ─── */}
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
          onMouseEnter={(e) => { e.currentTarget.style.color = "#F4F6F8"; }}
          onMouseLeave={(e) => { e.currentTarget.style.color = open ? "#F4F6F8" : "#9AA1AB"; }}
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

      {/* ─── Fullscreen overlay ─── */}
      <AnimatePresence>
        {open && (
          <motion.div
            ref={dialogRef}
            tabIndex={-1}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-0 z-50 overflow-hidden"
            style={{ background: "#050505", outline: "none" }}
            onClick={(e) => {
              if (e.target === e.currentTarget) {
                setOpen(false);
                setSubmenuOpen(false);
                setThirdOpen(false);
              }
            }}
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
            {/* Floating logo — top left */}
            <Link
              href={`/${locale}`}
              onClick={() => { setOpen(false); setSubmenuOpen(false); setThirdOpen(false); }}
              className="absolute top-0 left-0 z-20 transition-opacity duration-300 hover:opacity-50"
              style={{ padding: "max(10px, env(safe-area-inset-top)) clamp(40px,6vw,80px)" } as React.CSSProperties}
            >
              <span className="text-label-lg tracking-[-0.02em]">
                <span className="font-medium" style={{ color: "#F4F6F8" }}>{site?.brand.root}</span>
                <span style={{ color: "#6E7683", fontWeight: 400 }}>{site?.brand.suffix}</span>
              </span>
            </Link>

            {/* Floating close button — top right */}
            <button
              onClick={() => { setOpen(false); setSubmenuOpen(false); setThirdOpen(false); }}
              aria-label={t(locale, "ui.close")}
              className="absolute top-0 right-0 z-20 group relative flex items-center justify-center w-11 h-11 cursor-pointer transition-colors duration-300"
              style={{ color: "#9AA1AB", padding: "max(10px, env(safe-area-inset-top)) clamp(40px,6vw,80px)" } as React.CSSProperties}
              onMouseEnter={(e) => { e.currentTarget.style.color = "#F4F6F8"; }}
              onMouseLeave={(e) => { e.currentTarget.style.color = "#9AA1AB"; }}
            >
              <span className="relative block w-6" aria-hidden="true">
                <span
                  className="block h-[2px] rounded-full bg-current transition-all duration-300"
                  style={{ transform: "translateY(4px) rotate(45deg)" }}
                />
                <span
                  className="block h-[2px] rounded-full bg-current transition-all duration-300"
                  style={{ transform: "translateY(-4px) rotate(-45deg)" }}
                />
              </span>
            </button>

            {/* ─── Three-panel navigation container ─── */}
            <div className="relative z-10 flex h-full items-center justify-center overflow-hidden">
              <div className="flex items-center gap-[clamp(24px,3vw,60px)]">

                {/* ── Panel 1: Main menu ── */}
                <motion.div
                  initial="initial"
                  animate={
                    depth === 2 ? "depth2" : depth === 1 ? "depth1" : "initial"
                  }
                  variants={leftPanelVariants}
                  transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                  className="flex-shrink-0 text-center py-8"
                  style={{ transformOrigin: "right center" }}
                >
                  <div className="space-y-3 md:space-y-5">
                    {navItems.map((item, index) => (
                      <motion.div
                        key={item.id}
                        initial={{ opacity: 0, y: 30, filter: "blur(8px)" }}
                        animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                        transition={{ delay: 0.08 * index, duration: 0.7, ease: [0.22, 0.8, 0.2, 1] }}
                      >
                        {item.children ? (
                          <div className="space-y-1">
                            <button
                              onClick={handleOpenSubmenu}
                              className="w-full text-center group cursor-pointer"
                              style={{ background: "none", border: "none", padding: 0 }}
                            >
                              <span
                                className="relative inline-block font-heading whitespace-nowrap text-[clamp(48px,6vw,90px)] max-md:text-[clamp(36px,8vw,56px)] transition-colors duration-300"
                                style={{
                                  fontWeight: 500,
                                  lineHeight: "var(--leading-heading)",
                                  letterSpacing: "-0.03em",
                                  color: submenuOpen ? "#F4F6F8" : "rgba(244,246,248,0.7)",
                                }}
                              >
                                {getLabel(item)}
                                <span
                                  className="inline-block ml-3 align-middle text-[clamp(20px,2vw,28px)] max-md:text-[clamp(16px,3vw,22px)] transition-transform duration-300"
                                  style={{
                                    color: "rgba(244,246,248,0.3)",
                                    transform: submenuOpen ? "rotate(90deg)" : "rotate(0deg)",
                                  }}
                                >
                                  ›
                                </span>
                              </span>
                            </button>
                          </div>
                        ) : (
                          <Link
                            href={`/${locale}${item.href}`}
                            onClick={() => handleNavigate(item.href)}
                            aria-current={isActive(item.href) ? "page" : undefined}
                            className="block no-underline group"
                          >
                            <span
                              className="relative inline-block font-heading whitespace-nowrap text-[clamp(48px,6vw,90px)] max-md:text-[clamp(36px,8vw,56px)] transition-colors duration-300"
                              style={{
                                fontWeight: isActive(item.href) ? 500 : 400,
                                lineHeight: "var(--leading-heading)",
                                letterSpacing: "-0.03em",
                                color: isActive(item.href) ? "#F4F6F8" : "rgba(244,246,248,0.7)",
                              }}
                            >
                              {getLabel(item)}
                            </span>
                          </Link>
                        )}
                      </motion.div>
                    ))}

                    {/* Language switcher */}
                    <motion.div
                      initial={{ opacity: 0, y: 30, filter: "blur(8px)" }}
                      animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                      transition={{ delay: 0.08 * navItems.length, duration: 0.7, ease: [0.22, 0.8, 0.2, 1] }}
                      className="pt-8 md:pt-12 border-t border-white/5 mt-4 md:mt-8"
                    >
                      <div className="flex items-center justify-center gap-1">
                        <Link
                          href={switchPath("cs")}
                          onClick={() => { setOpen(false); setSubmenuOpen(false); setThirdOpen(false); }}
                          className="text-label-sm tracking-[0.18em] uppercase px-2.5 py-1.5 transition-all duration-200 max-md:text-label-lg max-md:px-3 max-md:py-[14px]"
                          style={{ color: locale === "cs" ? "#F4F6F8" : "rgba(244,246,248,0.35)" }}
                        >
                          Česky
                        </Link>
                        <span className="w-px h-3" style={{ background: "rgba(255,255,255,0.08)" }} aria-hidden="true" />
                        <Link
                          href={switchPath(switchTo)}
                          onClick={() => { setOpen(false); setSubmenuOpen(false); setThirdOpen(false); }}
                          className="text-label-sm tracking-[0.18em] uppercase px-2.5 py-1.5 transition-all duration-200 max-md:text-label-lg max-md:px-3 max-md:py-[14px]"
                          style={{ color: locale === "en" ? "#F4F6F8" : "rgba(244,246,248,0.35)" }}
                        >
                          English
                        </Link>
                      </div>
                    </motion.div>
                  </div>
                </motion.div>

                {/* ── Panel 2: Projekty submenu ── */}
                <AnimatePresence>
                  {submenuOpen && (
                    <motion.div
                      initial="hidden"
                      animate="visible"
                      exit="hidden"
                      variants={rightPanelVariants}
                      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                      className="flex-shrink-0 flex items-center justify-center py-8 pl-2"
                      style={{ transformOrigin: "left center" }}
                    >
                      <div className="text-center">
                        <div className="space-y-5">
                          {projectsChildren.map((child, childIndex) => {
                            const hasChildren = "children" in child && child.children;
                            return (
                              <motion.div
                                key={child.id}
                                initial={{ opacity: 0, x: 20, filter: "blur(6px)" }}
                                animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
                                transition={{ delay: 0.1 + 0.08 * childIndex, duration: 0.5, ease: [0.22, 0.8, 0.2, 1] }}
                              >
                                {hasChildren ? (
                                  <button
                                    onClick={handleOpenThird}
                                    className="w-full text-center group cursor-pointer"
                                    style={{ background: "none", border: "none", padding: 0 }}
                                  >
                                    <span
                                      className="relative inline-block font-heading whitespace-nowrap text-[clamp(28px,3.5vw,42px)] max-md:text-[clamp(22px,5vw,32px)] transition-colors duration-300"
                                      style={{
                                        fontWeight: thirdOpen ? 500 : 400,
                                        lineHeight: "var(--leading-heading)",
                                        letterSpacing: "-0.02em",
                                        color: thirdOpen ? "#F4F6F8" : "rgba(244,246,248,0.55)",
                                      }}
                                    >
                                      {getLabel(child)}
                                      <span
                                        className="inline-block ml-2 align-middle text-[clamp(16px,1.8vw,22px)] transition-transform duration-300"
                                        style={{
                                          color: "rgba(244,246,248,0.25)",
                                          transform: thirdOpen ? "rotate(90deg)" : "rotate(0deg)",
                                        }}
                                      >
                                        ›
                                      </span>
                                    </span>
                                  </button>
                                ) : (
                                  <Link
                                    href={`/${locale}${child.href}`}
                                    onClick={() => handleNavigate(child.href)}
                                    aria-current={isActive(child.href) ? "page" : undefined}
                                    className="block no-underline group"
                                  >
                                    <span
                                      className="relative inline-block font-heading whitespace-nowrap text-[clamp(28px,3.5vw,42px)] max-md:text-[clamp(22px,5vw,32px)] transition-colors duration-300"
                                      style={{
                                        fontWeight: isActive(child.href) ? 500 : 400,
                                        lineHeight: "var(--leading-heading)",
                                        letterSpacing: "-0.02em",
                                        color: isActive(child.href) ? "#F4F6F8" : "rgba(244,246,248,0.55)",
                                      }}
                                    >
                                      {getLabel(child)}
                                    </span>
                                  </Link>
                                )}
                              </motion.div>
                            );
                          })}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* ── Panel 3: Asistenti submenu ── */}
                <AnimatePresence>
                  {thirdOpen && (
                    <motion.div
                      initial="hidden"
                      animate="visible"
                      exit="hidden"
                      variants={rightPanelVariants}
                      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                      className="flex-shrink-0 flex flex-col items-start justify-center py-8 pl-2"
                    >
                      {/* Back button */}
                      <motion.button
                        initial={{ opacity: 0, x: 10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.05, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                        onClick={handleBackToSubmenu}
                        className="flex items-center gap-2 mb-6 cursor-pointer group"
                        style={{ background: "none", border: "none", padding: 0 }}
                      >
                        <span
                          className="inline-block text-[clamp(16px,1.5vw,20px)] transition-transform duration-300 group-hover:-translate-x-1"
                          style={{ color: "rgba(244,246,248,0.3)" }}
                        >
                          ←
                        </span>
                        <span
                          className="text-label-sm tracking-[0.12em] uppercase transition-colors duration-300 group-hover:text-white"
                          style={{ color: "rgba(244,246,248,0.35)" }}
                        >
                          {getLabel(asistentiItem!)}
                        </span>
                      </motion.button>

                      {/* Sub-items */}
                      <div className="space-y-4">
                        {asistentiChildren.map((child, childIndex) => (
                          <motion.div
                            key={child.id}
                            initial={{ opacity: 0, x: 20, filter: "blur(6px)" }}
                            animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
                            transition={{ delay: 0.12 + 0.08 * childIndex, duration: 0.5, ease: [0.22, 0.8, 0.2, 1] }}
                          >
                            <Link
                              href={`/${locale}${child.href}`}
                              onClick={() => handleNavigate(child.href)}
                              aria-current={isActive(child.href) ? "page" : undefined}
                              className="block no-underline group"
                            >
                              <span
                                className="relative inline-block font-heading whitespace-nowrap text-[clamp(22px,2.8vw,34px)] max-md:text-[clamp(18px,4.5vw,26px)] transition-colors duration-300"
                                style={{
                                  fontWeight: isActive(child.href) ? 500 : 400,
                                  lineHeight: "var(--leading-heading)",
                                  letterSpacing: "-0.02em",
                                  color: isActive(child.href) ? "#F4F6F8" : "rgba(244,246,248,0.45)",
                                }}
                              >
                                {getLabel(child)}
                              </span>
                            </Link>
                          </motion.div>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
