"use client";

import { useState, useEffect, useCallback } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import type { Locale } from "@/lib/types";

interface NavbarProps {
  locale: Locale;
}

interface NavItem {
  key: string;
  label: Record<Locale, string>;
  href: Record<Locale, string>;
}

const navItems: NavItem[] = [
  {
    key: "nav.concierge",
    label: { cs: "Concierge", en: "Concierge" },
    href: { cs: "/cs/concierge", en: "/en/concierge" },
  },
  {
    key: "nav.profese",
    label: { cs: "Profese", en: "Industries" },
    href: { cs: "/cs/profese", en: "/en/profese" },
  },
  {
    key: "nav.status",
    label: { cs: "Status", en: "Status" },
    href: { cs: "/cs/status", en: "/en/status" },
  },
  {
    key: "nav.contact",
    label: { cs: "Kontakt", en: "Contact" },
    href: { cs: "/cs/contact", en: "/en/contact" },
  },
];

function NavLink({ item, locale, onClose, index }: { item: NavItem; locale: Locale; onClose: () => void; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20, filter: "blur(6px)" }}
      animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      transition={{
        delay: 0.04 * index,
        duration: 0.6,
        ease: [0.22, 0.8, 0.2, 1],
      }}
    >
      <Link
        href={item.href[locale]}
        onClick={onClose}
        className="group relative block py-1"
      >
      <span
        className="relative block font-heading transition-all duration-700"
        style={{
          fontSize: "clamp(24px, 3.5vw, 48px)",
          fontWeight: 400,
          lineHeight: 1.15,
          letterSpacing: "-0.02em",
          color: "rgba(183,188,199,0.7)",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.color = "#F3F4F6";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.color = "rgba(183,188,199,0.7)";
        }}
      >
        {item.label[locale]}
      </span>
      <span className="absolute left-1/2 -translate-x-1/2 -bottom-0.5 h-px w-0 bg-gradient-to-r from-transparent via-electric/20 to-transparent transition-all duration-700 group-hover:w-3/5" />
      </Link>
    </motion.div>
  );
}

export default function Navbar({ locale }: NavbarProps) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  const toggleMenu = useCallback(() => setOpen((v) => !v), []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  const switchTo: Locale = locale === "cs" ? "en" : "cs";

  return (
    <>
      <nav
        className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between"
        style={{
          padding: `max(18px, env(safe-area-inset-top)) clamp(24px,5vw,64px) 0`,
          paddingLeft: `max(clamp(24px,5vw,64px), env(safe-area-inset-left))`,
          paddingRight: `max(clamp(24px,5vw,64px), env(safe-area-inset-right))`,
        }}
      >
        <Link
          href={`/${locale}`}
          className="flex items-center gap-1.5 text-[14px] tracking-[-0.02em] transition-all duration-300 hover:opacity-70"
        >
          <span className="font-heading font-semibold">recepce</span>
          <span className="font-body" style={{ color: "rgba(183,188,199,0.7)", fontWeight: 400 }}>.tech</span>
        </Link>

        <button
          onClick={toggleMenu}
          aria-label="Menu"
          aria-expanded={open}
          className="group relative z-50 flex items-center gap-2 transition-all duration-300 hover:opacity-60"
        >
          <span
            className="font-body text-[11px] tracking-[0.12em] uppercase"
            style={{ color: "#7E8492" }}
          >
            {open ? "Zavřít" : "Menu"}
          </span>
          <div className="relative w-5 h-3">
            <span
              className={`absolute left-0 top-1/2 block h-px transition-all duration-300 ${
                open ? "w-5 -translate-y-1/2 rotate-45" : "w-5 -translate-y-[calc(50%+2.5px)]"
              }`}
              style={{ background: open ? "#B7BCC7" : "#7E8492" }}
            />
            <span
              className={`absolute left-0 top-1/2 -translate-y-1/2 block h-px transition-all duration-300 ${
                open ? "opacity-0" : "w-3 opacity-100"
              }`}
              style={{ background: "#7E8492" }}
            />
            <span
              className={`absolute left-0 top-1/2 block h-px transition-all duration-300 ${
                open ? "w-5 -translate-y-1/2 -rotate-45" : "w-5 -translate-y-[calc(50%-2.5px)]"
              }`}
              style={{ background: open ? "#B7BCC7" : "#7E8492" }}
            />
          </div>
        </button>
      </nav>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4, ease: [0.22, 0.8, 0.2, 1] }}
            className="fixed inset-0 z-40 overflow-hidden"
            style={{ background: "#020308" }}
            onClick={(e) => {
              if (e.target === e.currentTarget) setOpen(false);
            }}
          >
            {/* Ambient background for menu */}
            <div className="absolute inset-0 pointer-events-none">
              <div
                className="absolute top-[10%] left-[20%] w-[500px] h-[500px] rounded-full"
                style={{
                  background: "radial-gradient(circle, rgba(0,194,255,0.06) 0%, transparent 70%)",
                  animation: "float-orb 20s ease-in-out infinite",
                }}
              />
              <div
                className="absolute bottom-[20%] right-[15%] w-[400px] h-[400px] rounded-full"
                style={{
                  background: "radial-gradient(circle, rgba(124,107,255,0.04) 0%, transparent 70%)",
                  animation: "float-orb-2 25s ease-in-out infinite",
                }}
              />
            </div>

            <div
              className="absolute inset-0 pointer-events-none opacity-[0.012]"
              style={{
                backgroundImage:
                  "linear-gradient(rgba(126,132,146,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(126,132,146,0.05) 1px, transparent 1px)",
                backgroundSize: "60px 60px",
                maskImage: "radial-gradient(ellipse at 50% 50%, black, transparent 75%)",
                WebkitMaskImage: "radial-gradient(ellipse at 50% 50%, black, transparent 75%)",
              }}
            />

            <div
              className="relative z-10 flex flex-col items-center justify-center h-full"
              style={{
                padding: `clamp(80px, 12vh, 100px) clamp(48px, 8vw, 100px)`,
                paddingLeft: `max(clamp(48px, 8vw, 100px), env(safe-area-inset-left))`,
                paddingRight: `max(clamp(48px, 8vw, 100px), env(safe-area-inset-right))`,
              }}
            >
              <div className="flex flex-col items-center gap-2">
                {navItems.map((item, i) => (
                  <NavLink key={item.key} item={item} locale={locale} onClose={() => setOpen(false)} index={i} />
                ))}
              </div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5, duration: 0.4 }}
                className="flex items-center justify-center gap-1 mt-10"
              >
                <Link
                  href={`/${locale}`}
                  onClick={() => setOpen(false)}
                  className="font-body text-[9px] tracking-[0.18em] uppercase px-2.5 py-1.5 transition-all duration-200"
                  style={{
                    color: locale === "cs" ? "#B7BCC7" : "rgba(126,132,146,0.45)",
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.opacity = "0.7"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.opacity = "1"; }}
                >
                  Česky
                </Link>
                <span className="w-px h-3" style={{ background: "rgba(255,255,255,0.06)" }} />
                <Link
                  href={`/${switchTo}`}
                  onClick={() => setOpen(false)}
                  className="font-body text-[9px] tracking-[0.18em] uppercase px-2.5 py-1.5 transition-all duration-200"
                  style={{
                    color: locale === "en" ? "#B7BCC7" : "rgba(126,132,146,0.45)",
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.opacity = "0.7"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.opacity = "1"; }}
                >
                  English
                </Link>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
