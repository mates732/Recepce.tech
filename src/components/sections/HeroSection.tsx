"use client";

import { useRef } from "react";
import { motion, useTransform, type MotionValue } from "framer-motion";
import { useElementScrollProgress, OFFSET_TOP_OUT } from "@/lib/scroll";
import type { Locale } from "@/lib/types";

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

  const title = locale === "cs"
    ? "Stavím inteligentní systémy."
    : "I build intelligent systems.";

  const subtitle = locale === "cs"
    ? "Cortex · AI asistenti · Weby · YouTube"
    : "Cortex · AI assistants · Websites · YouTube";

  const ctaLabel = locale === "cs" ? "Prozkoumat projekty" : "Explore projects";

  const words = title.split(" ");

  const isItalicWord = (word: string) =>
    word === "inteligentní" || word === "intelligent";

  const subOpacity = useTransform(
    progress,
    (p) => 1 - smoothstep(seg(p, 0.05, 0.2))
  );
  const subY = useTransform(
    progress,
    (p) => -24 * smoothstep(seg(p, 0, 0.2))
  );
  const ctaOpacity = useTransform(
    progress,
    (p) => 1 - smoothstep(seg(p, 0.1, 0.25))
  );
  const ctaY = useTransform(
    progress,
    (p) => -18 * smoothstep(seg(p, 0, 0.25))
  );
  const containerScale = useTransform(
    progress,
    (p) => 1 + 0.04 * smoothstep(seg(p, 0.15, 0.55))
  );

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden flex flex-col items-center justify-center"
      style={{
        minHeight: "100vh",
        padding: "clamp(24px, 5vw, 80px)",
        paddingTop: "max(80px, 8vh)",
        paddingBottom: "max(40px, 5vh)",
      }}
    >
      <motion.div
        className="relative z-10 w-full flex flex-col items-center"
        style={{ maxWidth: "640px", scale: containerScale, willChange: "transform" }}
      >
        {words.map((word, i) => (
          <HeroWord
            key={i}
            word={word}
            index={i}
            total={words.length}
            progress={progress}
            italic={isItalicWord(word)}
          />
        ))}

        <motion.p
          className="font-body mt-8 text-center"
          style={{
            fontSize: "clamp(11px, 1vw, 13px)",
            color: "#5F6368",
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            opacity: subOpacity,
            y: subY,
            willChange: "transform",
          }}
        >
          {subtitle}
        </motion.p>

        <motion.div
          className="mt-10"
          style={{ opacity: ctaOpacity, y: ctaY, willChange: "transform" }}
        >
          <a
            href="#ekosystem"
            onClick={(e) => {
              e.preventDefault();
              scrollToSection("ekosystem");
            }}
            className="font-body text-xs tracking-[0.2em] uppercase transition-colors duration-300 cursor-pointer"
            style={{ color: "#5F6368", textDecoration: "none" }}
            onMouseEnter={(e) => { e.currentTarget.style.color = "#111111"; }}
            onMouseLeave={(e) => { e.currentTarget.style.color = "#5F6368"; }}
          >
            {ctaLabel}
          </a>
        </motion.div>
      </motion.div>
    </section>
  );
}

function HeroWord({
  word,
  index,
  total,
  progress,
  italic,
}: {
  word: string;
  index: number;
  total: number;
  progress: MotionValue<number>;
  italic: boolean;
}) {
  const isLast = index === total - 1;

  const y = useTransform(progress, (p) =>
    isLast
      ? -44 * smoothstep(seg(p, 0.7, 1))
      : -(48 + index * 26) * smoothstep(seg(p, 0, 0.45))
  );
  const opacity = useTransform(progress, (p) =>
    isLast
      ? 1 - smoothstep(seg(p, 0.72, 0.95))
      : 1 - smoothstep(seg(p, 0.18 + index * 0.05, 0.45 + index * 0.05))
  );
  const scale = useTransform(progress, (p) =>
    isLast ? 1 + 0.1 * smoothstep(seg(p, 0.45, 0.68)) : 1
  );

  return (
    <motion.span
      className="block text-center"
      style={{ y, opacity, scale, willChange: "transform" }}
    >
      <span
        className="font-heading leading-none"
        style={{
          fontSize: "clamp(36px, 7vw, 90px)",
          letterSpacing: "-0.03em",
          color: "#111111",
          fontStyle: italic ? "italic" : "normal",
        }}
      >
        {word}
      </span>
    </motion.span>
  );
}
