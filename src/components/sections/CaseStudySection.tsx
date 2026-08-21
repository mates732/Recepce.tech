"use client";

import { useEffect, useRef, useState, useCallback, type UIEvent } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
  useMotionValue,
  useMotionValueEvent,
  type MotionValue,
} from "framer-motion";
import type { Locale } from "@/lib/types";
import { getPage } from "@/content/repository";

interface CaseCardData {
  category: string;
  name: string;
  description: string;
  keyPoints: string[];
  href: string;
  external?: boolean;
  visual?: string;
  visualStyle?: "image" | "wordmark";
}

const EASE = [0.16, 1, 0.3, 1] as const;

export default function CaseStudySection({ locale }: { locale: Locale }) {
  const data = getPage("home")?.data.caseStudies;
  const cases: CaseCardData[] = (data?.cases ?? []).map((c) => ({
    category: c.category[locale],
    name: c.name[locale],
    description: c.description[locale],
    keyPoints: c.keyPoints[locale],
    href: c.href,
    external: c.external,
    visual: c.visual,
    visualStyle: c.visualStyle,
  }));
  const title = data?.title[locale] ?? "";
  const subtitle = data?.subtitle[locale] ?? "";
  const hint = data?.hint[locale] ?? "";
  const cta = data?.cta[locale] ?? "";
  const archiveLabel = data?.archiveLabel[locale] ?? "";

  const shouldReduce = !!useReducedMotion();
  const [pinned, setPinned] = useState(false);
  const [isScrollJacking, setIsScrollJacking] = useState(false);
  const [progress, setProgress] = useState(0);
  const [hintDone, setHintDone] = useState(false);
  const [active, setActive] = useState(0);
  const [trackWidth, setTrackWidth] = useState(0);

  const containerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const viewportRef = useRef<HTMLDivElement>(null);

  // Refs for synchronous access in wheel handler (avoids state batching lag)
  const isScrollJackingRef = useRef(false);
  const trackWidthRef = useRef(0);

  // Horizontal progress motion value (drives the transform)
  const hjProgress = useMotionValue(0);

  // Pinned horizontal scroll only on desktop without reduced motion.
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 768px)");
    const update = () => setPinned(mq.matches && !shouldReduce);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, [shouldReduce]);

  // Measure track width vs viewport width for horizontal travel.
  useEffect(() => {
    if (!pinned || cases.length === 0) return;
    const measure = () => {
      if (!trackRef.current || !viewportRef.current) return;
      const tw = trackRef.current.scrollWidth;
      const vw = viewportRef.current.clientWidth;
      setTrackWidth(Math.max(0, tw - vw));
    };
    measure();
    const t1 = window.setTimeout(measure, 100);
    const t2 = window.setTimeout(measure, 400);
    const imgs = trackRef.current?.querySelectorAll("img") ?? [];
    const onImgLoad = () => measure();
    imgs.forEach((img) => {
      if (img.complete) return;
      img.addEventListener("load", onImgLoad, { once: true });
    });
    window.addEventListener("resize", measure);
    return () => {
      window.clearTimeout(t1);
      window.clearTimeout(t2);
      imgs.forEach((img) => img.removeEventListener("load", onImgLoad));
      window.removeEventListener("resize", measure);
    };
  }, [pinned, cases.length]);

  // ─── useScroll: tracks container position in viewport ───
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  // ─── Transform: hjProgress → horizontal x ───
  // Always called at top level (no conditional).
  const x = useTransform(hjProgress, (v) => -v * trackWidth);

  // Sync refs with state (synchronous access in wheel handler).
  useEffect(() => { isScrollJackingRef.current = isScrollJacking; }, [isScrollJacking]);
  useEffect(() => { trackWidthRef.current = trackWidth; }, [trackWidth]);

  // ─── Scroll-jacking: ONE permanent wheel handler ───
  // Uses refs so it never needs re-attachment — avoids state batching gaps.
  useEffect(() => {
    if (!pinned) return;

    const onWheel = (e: WheelEvent) => {
      // Only intercept when scroll-jacking is active.
      if (!isScrollJackingRef.current) return;
      const tw = trackWidthRef.current;
      if (tw <= 0) return;

      const delta = e.deltaY;
      if (Math.abs(delta) < 1) return;

      e.preventDefault();
      e.stopPropagation();

      const current = hjProgress.get();
      const step = (delta / tw) * 2.5;
      const next = Math.max(0, Math.min(1, current + step));

      hjProgress.set(next);

      // Release downward: scroll past section bottom
      if (next >= 1) {
        isScrollJackingRef.current = false;
        setIsScrollJacking(false);
        const el = containerRef.current;
        if (el) {
          const rect = el.getBoundingClientRect();
          const exitY = rect.top + window.scrollY + rect.height - window.innerHeight;
          window.scrollTo({ top: Math.max(0, exitY), behavior: "auto" });
        }
      }
      // Release upward: scroll past section top
      if (next <= 0) {
        isScrollJackingRef.current = false;
        setIsScrollJacking(false);
        const el = containerRef.current;
        if (el) {
          const rect = el.getBoundingClientRect();
          const entryY = rect.top + window.scrollY - window.innerHeight + 1;
          window.scrollTo({ top: Math.max(0, entryY), behavior: "auto" });
        }
      }
    };

    window.addEventListener("wheel", onWheel, { passive: false });
    return () => window.removeEventListener("wheel", onWheel);
  }, [pinned, hjProgress]);

  // ─── Sync progress + active card from hjProgress ───
  useMotionValueEvent(hjProgress, "change", (v) => {
    setProgress(v);
    setActive(
      Math.min(
        cases.length - 1,
        Math.max(0, Math.round(v * (cases.length - 1)))
      )
    );
  });

  // ─── Detect when section enters viewport → start scroll-jacking ───
  // 1) On mount: if section already visible, activate immediately.
  useEffect(() => {
    if (!pinned || trackWidth <= 0) return;
    const el = containerRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight && rect.bottom > 0 && hjProgress.get() < 0.01) {
      isScrollJackingRef.current = true;
      setIsScrollJacking(true);
      hjProgress.set(0);
    }
  }, [pinned, trackWidth, hjProgress]);

  // 2) On scroll: detect when section enters viewport.
  useEffect(() => {
    if (!pinned || trackWidth <= 0) return;
    const unsub = scrollYProgress.on("change", (v) => {
      if (v > 0 && v < 0.1 && !isScrollJackingRef.current && hjProgress.get() < 0.01) {
        isScrollJackingRef.current = true;
        setIsScrollJacking(true);
        hjProgress.set(0);
      }
    });
    return unsub;
  }, [pinned, trackWidth, isScrollJacking, scrollYProgress, hjProgress]);

  // Dismiss interaction hint.
  useEffect(() => {
    if (hintDone) return;
    const dismiss = () => setHintDone(true);
    window.addEventListener("wheel", dismiss, { passive: true });
    window.addEventListener("touchstart", dismiss, { passive: true });
    return () => {
      window.removeEventListener("wheel", dismiss);
      window.removeEventListener("touchstart", dismiss);
    };
  }, [hintDone]);

  // Mobile: native horizontal scroll.
  const onTrackScroll = (e: UIEvent<HTMLDivElement>) => {
    const el = e.currentTarget;
    const max = el.scrollWidth - el.clientWidth;
    const p = max > 0 ? el.scrollLeft / max : 0;
    setProgress(p);
    const mid = el.scrollLeft + el.clientWidth / 2;
    let idx = 0;
    Array.from(el.children).forEach((child, i) => {
      const c = child as HTMLElement;
      if (mid >= c.offsetLeft && mid <= c.offsetLeft + c.offsetWidth) idx = i;
    });
    setActive(idx);
  };

  const goToIndex = useCallback(
    (i: number) => {
      const idx = Math.max(0, Math.min(cases.length - 1, i));
      if (!pinned) {
        const track = trackRef.current;
        const card = track?.children[idx] as HTMLElement | undefined;
        if (track && card) {
          track.scrollTo({
            left: card.offsetLeft - 24,
            behavior: shouldReduce ? "auto" : "smooth",
          });
        }
        return;
      }
      // Pinned: set hjProgress to target index position.
      const n = cases.length - 1;
      const target = n > 0 ? idx / n : 0;
      hjProgress.set(target);
      // If scroll-jacking not yet active, activate it.
      if (!isScrollJacking) setIsScrollJacking(true);
    },
    [pinned, cases.length, shouldReduce, hjProgress, isScrollJacking]
  );

  if (cases.length === 0) return null;

  const n = cases.length;
  const estimatedTravelVw = Math.max(0, n * 44 - 100);
  const heightFactor = Math.max(1.2, 1 + estimatedTravelVw / 100);

  const trackStyle: React.CSSProperties = pinned
    ? { height: "100%", padding: "clamp(64px, 11vh, 96px) 0" }
    : {
        height: "clamp(480px, 72vh, 640px)",
        overflowX: "auto",
        scrollSnapType: "x mandatory",
        WebkitOverflowScrolling: "touch",
        scrollbarWidth: "none",
        msOverflowStyle: "none",
      };

  return (
    <section
      id="case-studies"
      className="relative overflow-hidden"
      style={{ background: "#0A0A0B" }}
    >
      {/* ─── Section header ─── */}
      <div
        className="mx-auto"
        style={{
          maxWidth: "1200px",
          padding: "clamp(48px, 8vw, 110px) clamp(24px, 5vw, 80px) clamp(24px, 4vw, 48px)",
        }}
      >
        <div className="flex items-center gap-3 mb-6">
          <span
            className="font-mono"
            style={{
              fontSize: "var(--text-label-fluid)",
              letterSpacing: "0.22em",
              color: "var(--color-accent)",
            }}
          >
            / 05
          </span>
          <span
            className="font-mono"
            style={{
              fontSize: "var(--text-label-fluid)",
              letterSpacing: "0.22em",
              textTransform: "uppercase",
              color: "#6E7683",
            }}
          >
            {title}
          </span>
        </div>

        <h2
          className="font-heading"
          style={{
            fontSize: "var(--text-h1-lg)",
            letterSpacing: "-0.03em",
            color: "#F4F6F8",
            maxWidth: "18ch",
          }}
        >
          {subtitle}
        </h2>

        <div className="mt-7 flex items-center gap-3">
          <HeartMark />
          <span
            className="font-mono"
            style={{
              fontSize: "var(--text-label-fluid)",
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              color: "#6E7683",
            }}
          >
            {hint}
          </span>
        </div>
      </div>

      {/* ─── Horizontal project archive ─── */}
      <div
        ref={containerRef}
        style={pinned ? { height: `calc(${heightFactor.toFixed(2)} * 100vh)` } : undefined}
      >
        <div
          ref={viewportRef}
          className={pinned ? "sticky top-0 overflow-hidden" : ""}
          style={pinned ? { height: "100vh" } : undefined}
        >
          {/* Persistent top row (pinned only) */}
          {pinned && (
            <div
              className="absolute top-0 inset-x-0 z-10 flex items-center justify-between"
              style={{ padding: "clamp(18px, 3vw, 40px) clamp(24px, 5vw, 80px)" }}
            >
              <span
                className="font-mono"
                style={{
                  fontSize: "var(--text-label)",
                  letterSpacing: "0.2em",
                  textTransform: "uppercase",
                  color: "#6E7683",
                }}
              >
                {archiveLabel}
              </span>
              <span className="flex items-center gap-3">
                {!hintDone && (
                  <span
                    className="font-mono"
                    style={{
                      fontSize: "var(--text-label-sm)",
                      letterSpacing: "0.18em",
                      textTransform: "uppercase",
                      color: "rgba(255,255,255,0.3)",
                    }}
                  >
                    {hint}
                  </span>
                )}
                <span
                  className="font-mono"
                  style={{
                    fontSize: "var(--text-label)",
                    letterSpacing: "0.2em",
                    color: "var(--color-accent)",
                  }}
                >
                  {String(active + 1).padStart(2, "0")} / {String(n).padStart(2, "0")}
                </span>
              </span>
            </div>
          )}

          {/* Track: x driven by hjProgress (scroll-jacked) */}
          <motion.div
            ref={trackRef}
            className="relative flex"
            style={{
              ...trackStyle,
              ...(pinned ? { x } : {}),
            }}
            onScroll={pinned ? undefined : onTrackScroll}
          >
            <div
              className="flex items-stretch gap-[clamp(20px,2vw,32px)]"
              style={{ padding: "0 clamp(24px,5vw,80px)", width: "max-content" }}
            >
              {cases.map((c, i) => (
                <CaseCard
                  key={c.name}
                  card={c}
                  index={i}
                  total={n}
                  active={i === active}
                  cta={cta}
                  locale={locale}
                />
              ))}
            </div>
          </motion.div>

          {/* Progress + controls */}
          <div
            className={pinned ? "absolute bottom-0 inset-x-0 z-10" : ""}
            style={{
              padding: pinned
                ? "clamp(18px, 3vw, 40px) clamp(24px, 5vw, 80px)"
                : "18px clamp(24px,5vw,80px) clamp(48px,8vw,110px)",
            }}
          >
            <div className="flex items-center justify-between gap-6">
              <div className="flex items-center gap-2">
                <ControlButton
                  label={locale === "cs" ? "Předchozí projekt" : "Previous project"}
                  arrow="←"
                  disabled={active === 0}
                  onClick={() => goToIndex(active - 1)}
                />
                <ControlButton
                  label={locale === "cs" ? "Další projekt" : "Next project"}
                  arrow="→"
                  disabled={active === n - 1}
                  onClick={() => goToIndex(active + 1)}
                />
              </div>

              <div
                className="relative h-px flex-1"
                style={{ background: "rgba(255,255,255,0.12)" }}
                role="progressbar"
                aria-valuemin={0}
                aria-valuemax={100}
                aria-valuenow={Math.round(progress * 100)}
              >
                <div
                  className="absolute top-0 left-0 h-[2px]"
                  style={{
                    width: `${Math.max(2, progress * 100)}%`,
                    background: "var(--color-accent)",
                    transform: "translateY(-50%)",
                    boxShadow: "0 0 12px rgba(255,74,46,0.5)",
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─── Case card ─── */

function CaseCard({
  card,
  index,
  total,
  active,
  cta,
  locale,
}: {
  card: CaseCardData;
  index: number;
  total: number;
  active: boolean;
  cta: string;
  locale: Locale;
}) {
  const content = (
    <div
      className="flex flex-col overflow-hidden rounded-2xl transition-all duration-500 h-full"
      style={{
        width: "clamp(320px, 42vw, 46rem)",
        background: "#121316",
        border: `1px solid ${
          active ? "rgba(255,74,46,0.55)" : "rgba(255,255,255,0.08)"
        }`,
        boxShadow: active
          ? "0 0 0 1px rgba(255,74,46,0.12), 0 24px 70px rgba(255,74,46,0.10)"
          : "0 2px 12px rgba(255,255,255,0.04)",
      }}
    >
      <div className="relative flex-1 overflow-hidden" style={{ minHeight: "46%" }}>
        {card.visualStyle === "image" && card.visual ? (
          <Image
            src={card.visual}
            alt={card.name}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 82vw, 42vw"
          />
        ) : (
          <WordmarkVisual name={card.name} />
        )}
        <span
          aria-hidden="true"
          className="absolute top-4 left-5 font-mono"
          style={{
            fontSize: "var(--text-label)",
            letterSpacing: "0.2em",
            color: "rgba(255,255,255,0.45)",
          }}
        >
          {String(index + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
        </span>
      </div>

      <div
        className="flex flex-col gap-3 p-6 sm:p-7"
        style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}
      >
        <span
          className="font-mono"
          style={{
            fontSize: "var(--text-label)",
            letterSpacing: "0.2em",
            textTransform: "uppercase",
            color: "var(--color-accent)",
          }}
        >
          {card.category}
        </span>
        <h3
          className="font-heading"
          style={{
            fontSize: "var(--text-h3)",
            color: "#F4F6F8",
            letterSpacing: "-0.02em",
          }}
        >
          {card.name}
        </h3>
        <p className="font-body text-sm leading-relaxed" style={{ color: "#9AA1AB" }}>
          {card.description}
        </p>
        <ul className="flex flex-col gap-1.5 mt-1">
          {card.keyPoints.map((point) => (
            <li
              key={point}
              className="flex items-start gap-2.5 font-body text-sm"
              style={{ color: "#C7CDD6" }}
            >
              <span
                aria-hidden="true"
                className="mt-2 inline-block w-1 h-1 rounded-full flex-shrink-0"
                style={{ background: "var(--color-accent)" }}
              />
              {point}
            </li>
          ))}
        </ul>
        <span
          className="group inline-flex items-center gap-2 font-mono text-label-fluid tracking-[0.16em] uppercase transition-colors duration-300 mt-3"
          style={{ color: "#9AA1AB" }}
        >
          <span className="transition-colors duration-300 group-hover:text-[var(--color-accent)]">
            {cta}
          </span>
          <svg
            width="13"
            height="13"
            viewBox="0 0 16 16"
            fill="none"
            aria-hidden="true"
            className="transition-transform duration-300 group-hover:translate-x-1"
          >
            <path
              d="M1 8h12m0 0L9 4m4 4l-4 4"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </span>
      </div>
    </div>
  );

  if (card.external) {
    return (
      <a
        href={card.href}
        target="_blank"
        rel="noopener noreferrer"
        className="block no-underline flex-shrink-0"
        style={{ scrollSnapAlign: "start" }}
      >
        {content}
      </a>
    );
  }

  return (
    <Link
      href={`/${locale}${card.href}`}
      className="block no-underline flex-shrink-0"
      style={{ scrollSnapAlign: "start" }}
    >
      {content}
    </Link>
  );
}

/* ─── Wordmark visual ─── */

function WordmarkVisual({ name }: { name: string }) {
  return (
    <div
      className="relative w-full h-full flex items-center justify-center lab-grid"
      style={{ background: "#17181D" }}
    >
      <div
        className="relative z-10 flex flex-col items-center gap-3 px-6 text-center"
        aria-hidden="true"
      >
        <span
          className="font-heading"
          style={{
            fontSize: "clamp(28px, 3.2vw, 52px)",
            letterSpacing: "-0.03em",
            color: "#F4F6F8",
            whiteSpace: "nowrap",
          }}
        >
          {name}
          <span style={{ color: "#6E7683", fontWeight: 400 }}>.tech</span>
        </span>
        <span
          className="font-mono"
          style={{
            fontSize: "var(--text-label)",
            letterSpacing: "0.24em",
            textTransform: "uppercase",
            color: "var(--color-accent)",
          }}
        >
          digital systems studio
        </span>
      </div>
    </div>
  );
}

/* ─── Heart signature ─── */

function HeartMark() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="var(--color-accent)"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M12 20.3C7.7 16.6 3.7 12.9 3.7 9 3.7 6.3 5.8 4.2 8.5 4.2c1.5 0 2.9.8 3.5 1.9.6-1.1 2-1.9 3.5-1.9 2.7 0 4.8 2.1 4.8 4.8 0 3.9-4 7.6-8.3 11.3z" />
    </svg>
  );
}

/* ─── Control button ─── */

function ControlButton({
  label,
  arrow,
  disabled,
  onClick,
}: {
  label: string;
  arrow: string;
  disabled: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      className="flex items-center justify-center w-10 h-10 rounded-full cursor-pointer transition-all duration-300"
      style={{
        border: "1px solid rgba(255,255,255,0.14)",
        color: disabled ? "rgba(255,255,255,0.2)" : "#9AA1AB",
        background: "transparent",
      }}
      onMouseEnter={(e) => {
        if (!disabled) {
          e.currentTarget.style.borderColor = "rgba(255,74,46,0.5)";
          e.currentTarget.style.color = "#F4F6F8";
        }
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = "rgba(255,255,255,0.14)";
        e.currentTarget.style.color = disabled ? "rgba(255,255,255,0.2)" : "#9AA1AB";
      }}
    >
      <span style={{ fontSize: 15 }}>{arrow}</span>
    </button>
  );
}
