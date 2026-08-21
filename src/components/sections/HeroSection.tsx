"use client";

import { useRef } from "react";
import { motion, useTransform, type MotionValue } from "framer-motion";
import { useElementScrollProgress, OFFSET_TOP_OUT } from "@/lib/scroll";
import ParticleField from "@/components/lab/ParticleField";
import type { Locale } from "@/lib/types";
import { getPage } from "@/content/repository";

interface HeroSectionProps {
  locale: Locale;
}

function seg(p: number, a: number, b: number): number {
  if (b <= a) return p >= b ? 1 : 0;
  return Math.min(1, Math.max(0, (p - a) / (b - a)));
}

function smoothstep(x: number): number {
  return x * x * (3 - 2 * x);
}

let scrollTweenId = 0;

function cancelScrollTween(id: number): void {
  if (scrollTweenId !== id) return;
  scrollTweenId = 0;
  window.removeEventListener("wheel", cancelScrollTweenListener);
  window.removeEventListener("touchstart", cancelScrollTweenListener);
  window.removeEventListener("keydown", cancelScrollTweenListener);
}

function cancelScrollTweenListener(): void {
  cancelScrollTween(scrollTweenId);
}

let reducedMotionCache: boolean | null = null;

function prefersReducedMotion(): boolean {
  if (reducedMotionCache === null && typeof window !== "undefined") {
    reducedMotionCache = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
  }
  return reducedMotionCache === true;
}

/** Jemný magnetický posun primárního CTA za kurzorem (max ~3 px). */
function magnetic(e: React.MouseEvent<HTMLElement>): void {
  if (prefersReducedMotion()) return;
  const el = e.currentTarget;
  const rect = el.getBoundingClientRect();
  const dx = e.clientX - (rect.left + rect.width / 2);
  const dy = e.clientY - (rect.top + rect.height / 2);
  const mx = Math.max(-3, Math.min(3, dx * 0.05));
  const my = Math.max(-3, Math.min(3, dy * 0.05));
  el.style.transform = `translate(${mx}px, ${my}px)`;
}

function resetMagnetic(e: React.MouseEvent<HTMLElement>): void {
  e.currentTarget.style.transform = "translate(0px, 0px)";
}

/** Aktivní (stisknutý) stav tlačítka — rychlý, bez per-frame stavu. */
function press(e: React.MouseEvent<HTMLElement>): void {
  e.currentTarget.style.scale = "0.97";
}

function unpress(e: React.MouseEvent<HTMLElement>): void {
  e.currentTarget.style.scale = "1";
}

function scrollToSection(id: string): void {
  const target = document.getElementById(id);
  if (!target) return;
  const nav = document.querySelector("nav");
  const headerOffset = nav ? nav.getBoundingClientRect().height + 16 : 24;
  const to = Math.max(
    0,
    target.getBoundingClientRect().top + window.scrollY - headerOffset
  );
  const from = window.scrollY;
  const distance = to - from;
  if (Math.abs(distance) < 2) return;

  const prefersReduced = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;
  if (prefersReduced || typeof requestAnimationFrame !== "function") {
    window.scrollTo(0, to);
    return;
  }

  const tweenId = ++scrollTweenId;
  const duration = Math.min(900, Math.max(350, Math.abs(distance) * 0.35));
  const start = performance.now();
  const ease = (t: number) =>
    t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

  window.addEventListener("wheel", cancelScrollTweenListener, {
    passive: true,
  });
  window.addEventListener("touchstart", cancelScrollTweenListener, {
    passive: true,
  });
  window.addEventListener("keydown", cancelScrollTweenListener);

  const step = (now: number) => {
    if (scrollTweenId !== tweenId) return;
    const t = Math.min(1, (now - start) / duration);
    window.scrollTo(0, from + distance * ease(t));
    if (t < 1) {
      requestAnimationFrame(step);
    } else {
      cancelScrollTween(tweenId);
    }
  };
  requestAnimationFrame(step);
}

export default function HeroSection({ locale }: HeroSectionProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const progress = useElementScrollProgress(sectionRef, OFFSET_TOP_OUT);

  const page = getPage("home");
  const hero = page?.data.hero;
  const title = hero?.title[locale] ?? "";
  const subtitle = hero?.subtitle[locale] ?? "";
  const proof = hero?.proof[locale] ?? "";
  const ctaLabel = hero?.ctaLabel[locale] ?? "";
  const altCtaLabel = hero?.altCtaLabel[locale] ?? "";

  const words = title.split(" ");
  const isItalicWord = (word: string) =>
    (hero?.emphasis[locale] ?? []).some((e) => word.includes(e));

  const contentOpacity = useTransform(
    progress,
    (p) => 1 - smoothstep(seg(p, 0.1, 0.55))
  );
  const contentY = useTransform(
    progress,
    (p) => -32 * smoothstep(seg(p, 0.05, 0.5))
  );
  const bgOpacity = useTransform(
    progress,
    (p) => 1 - smoothstep(seg(p, 0.35, 0.8))
  );

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden flex flex-col items-center justify-center"
      style={{
        minHeight: "100dvh",
        padding: "clamp(24px, 5vw, 80px)",
        paddingTop: "max(80px, 8vh)",
        paddingBottom: "max(40px, 5vh)",
      }}
    >
      <motion.div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none"
        style={{ opacity: bgOpacity }}
      >
        <ParticleField className="absolute inset-0 w-full h-full" />
<div
            className="absolute inset-0"
            style={{
              background:
                "radial-gradient(ellipse 80% 60% at 50% 0%, rgba(255,74,46,0.10) 0%, transparent 60%), radial-gradient(ellipse 60% 50% at 80% 100%, rgba(255,107,61,0.05) 0%, transparent 60%), radial-gradient(ellipse 50% 40% at 15% 90%, rgba(232,52,31,0.05) 0%, transparent 60%)",
            }}
          />
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to bottom, transparent 60%, #0A0A0B 100%)",
          }}
        />
      </motion.div>

      <h1 className="sr-only">{title}</h1>

      <motion.div
        className="relative z-10 w-full flex flex-col items-center text-center"
        style={{
          maxWidth: "860px",
          opacity: contentOpacity,
          y: contentY,
          willChange: "transform",
        }}
      >
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="font-mono flex items-center gap-2.5"
          style={{
            fontSize: "var(--text-label-fluid)",
            letterSpacing: "0.22em",
            textTransform: "uppercase",
            color: "var(--color-accent)",
          }}
        >
          <span
            aria-hidden="true"
            className="inline-block w-1.5 h-1.5 rounded-full"
            style={{ background: "#FF6B3D", animation: "pulse-dot 2.4s ease-in-out infinite" }}
          />
          Digital Systems Studio
        </motion.p>

        <motion.h2
          className="font-heading leading-none mt-8"
          style={{
            fontSize: "var(--text-hero)",
            letterSpacing: "-0.03em",
            color: "#F4F6F8",
          }}
          initial="hidden"
          animate="visible"
          variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.09, delayChildren: 0.3 } } }}
        >
          {words.map((word, i) => (
            <motion.span
              key={i}
              className="inline-block"
              variants={{
                hidden: { opacity: 0, y: 28, filter: "blur(6px)" },
                visible: {
                  opacity: 1,
                  y: 0,
                  filter: "blur(0px)",
                  transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] },
                },
              }}
            >
              <span className={isItalicWord(word) ? "gradient-text" : undefined}>
                {word}
              </span>
              {"\u00A0"}
            </motion.span>
          ))}
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.7, ease: [0.16, 1, 0.3, 1] }}
          className="font-mono mt-6"
          style={{
            fontSize: "var(--text-label-fluid)",
            color: "#9AA1AB",
            letterSpacing: "0.14em",
            textTransform: "uppercase",
          }}
        >
          {subtitle}
        </motion.p>

        <motion.p
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.85, ease: [0.16, 1, 0.3, 1] }}
          className="font-body mt-4"
          style={{ fontSize: "var(--text-body)", color: "#6E7683" }}
        >
          {proof}
        </motion.p>

        <motion.div
          className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-3.5 sm:gap-4"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 2.0, ease: [0.16, 1, 0.3, 1] }}
        >
          <a
            href={hero?.ctaHref ?? "#systems-audit"}
            onClick={(e) => {
              e.preventDefault();
              scrollToSection(hero?.scrollTarget ?? "systems-audit");
            }}
            onMouseMove={magnetic}
            onMouseDown={press}
            onMouseUp={unpress}
            onMouseEnter={(e) => {
              e.currentTarget.style.boxShadow = "0 0 40px var(--color-accent-glow)";
            }}
            onMouseLeave={(e) => {
              resetMagnetic(e);
              unpress(e);
              e.currentTarget.style.boxShadow = "none";
            }}
            className="group inline-flex items-center gap-2.5 px-7 py-3.5 rounded-full text-sm font-medium cursor-pointer"
            style={{
              background: "var(--color-accent)",
              color: "#0A0A0B",
              transition: "box-shadow 0.3s ease, transform 0.25s ease-out, scale 0.15s ease-out",
            }}
          >
            {ctaLabel}
            <svg
              width="15"
              height="15"
              viewBox="0 0 16 16"
              fill="none"
              aria-hidden="true"
              className="transition-transform duration-300 group-hover:translate-y-0.5"
            >
              <path d="M8 1v12m0 0l-4-4m4 4l4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </a>

          <a
            href={hero?.altCtaHref ?? "#live-systems"}
            onClick={(e) => {
              e.preventDefault();
              scrollToSection(hero?.altScrollTarget ?? "live-systems");
            }}
            onMouseDown={press}
            onMouseUp={unpress}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = "rgba(255,255,255,0.35)";
              e.currentTarget.style.color = "#F4F6F8";
            }}
            onMouseLeave={(e) => {
              unpress(e);
              e.currentTarget.style.borderColor = "rgba(255,255,255,0.14)";
              e.currentTarget.style.color = "#9AA1AB";
            }}
            className="group inline-flex items-center gap-2.5 px-7 py-3.5 rounded-full text-sm font-medium cursor-pointer"
            style={{
              color: "#9AA1AB",
              border: "1px solid rgba(255,255,255,0.14)",
              transition: "border-color 0.3s ease, color 0.3s ease, scale 0.15s ease-out",
            }}
          >
            {altCtaLabel}
          </a>
        </motion.div>
      </motion.div>
    </section>
  );
}
