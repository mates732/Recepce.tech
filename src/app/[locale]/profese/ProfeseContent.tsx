"use client";

import { useEffect, useRef, useState } from "react";
import type { Locale } from "@/lib/types";
import { t } from "@/lib/utils";
import { PROFESSIONS } from "./professionsData";
import Link from "next/link";

interface Props {
  locale: Locale;
}

interface ScrollState {
  activeIdx: number;
  nextIdx: number;
  blend: number;
}

function lerpRGBA(a: string, b: string, t: number): string {
  const ra = /rgba$$(\d+),(\d+),(\d+),([\d.]+)$$/.exec(a);
  const rb = /rgba$$(\d+),(\d+),(\d+),([\d.]+)$$/.exec(b);
  if (!ra || !rb) return t < 0.5 ? a : b;
  return `rgba(${Math.round(+ra[1] + (+rb[1] - +ra[1]) * t)},${Math.round(+ra[2] + (+rb[2] - +ra[2]) * t)},${Math.round(+ra[3] + (+rb[3] - +ra[3]) * t)},${(+ra[4] + (+rb[4] - +ra[4]) * t).toFixed(3)})`;
}

export default function ProfeseContent({ locale }: Props) {
  const [scrollState, setScrollState] = useState<ScrollState>({ activeIdx: 0, nextIdx: 0, blend: 0 });
  const [hasScrolled, setHasScrolled] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const isCs = locale === "cs";

  useEffect(() => {
    const container = scrollRef.current;
    if (!container) return;
    let scrolled = false;
    let ticking = false;
    const handleScroll = () => {
      if (!scrolled && container!.scrollTop > 60) { scrolled = true; setHasScrolled(true); }
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const sections = container!.querySelectorAll<HTMLElement>("[data-section]");
        const cr = container!.getBoundingClientRect();
        const mid = cr.top + cr.height / 2;
        let active = 0;
        let minDist = Infinity;
        const positions: { mid: number }[] = [];
        sections.forEach((s, i) => {
          const r = s.getBoundingClientRect();
          const sm = r.top + r.height / 2;
          positions.push({ mid: sm });
          const d = Math.abs(sm - mid);
          if (d < minDist) { minDist = d; active = i; }
        });
        const nxt = positions[active].mid < mid
          ? Math.min(active + 1, sections.length - 1)
          : Math.max(active - 1, 0);
        const td = Math.abs(positions[nxt].mid - positions[active].mid);
        const tr = Math.abs(mid - positions[active].mid);
        const bl = td > 0 ? Math.min(1, tr / td) : 0;
        setScrollState({ activeIdx: active, nextIdx: nxt, blend: bl });
        ticking = false;
      });
    };
    container.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => container.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollTo = (profIdx: number) => {
    const container = scrollRef.current;
    if (!container) return;
    container.querySelector<HTMLElement>(`[data-section="${profIdx + 1}"]`)
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const s2p = (s: number) =>
    s === 0 ? 0 : s <= PROFESSIONS.length ? s - 1 : PROFESSIONS.length - 1;

  const ap = PROFESSIONS[s2p(scrollState.activeIdx)];
  const np = PROFESSIONS[s2p(scrollState.nextIdx)];
  const b = scrollState.blend;
  const bg1 = lerpRGBA(ap?.colors?.glow1 ?? "rgba(160,160,160,0.06)", np?.colors?.glow1 ?? "rgba(160,160,160,0.06)", b);
  const bg2 = lerpRGBA(ap?.colors?.glow2 ?? "rgba(96,96,96,0.04)", np?.colors?.glow2 ?? "rgba(96,96,96,0.04)", b);

  const weight = (idx: number): number => {
    const { activeIdx, nextIdx, blend } = scrollState;
    if (activeIdx === nextIdx) return idx === activeIdx ? 1 : 0.03;
    if (idx === activeIdx) return Math.max(0.05, 1 - blend * 0.75);
    if (idx === nextIdx) return Math.max(0.05, 0.12 + blend * 0.6);
    const d = Math.min(Math.abs(idx - activeIdx), Math.abs(idx - nextIdx));
    return Math.max(0.03, 0.12 - d * 0.045);
  };

  const sIdx = scrollState.activeIdx >= 1 && scrollState.activeIdx <= PROFESSIONS.length
    ? scrollState.activeIdx - 1 : -1;

  return (
    <div className="relative h-screen overflow-hidden" style={{ background: "#020308" }}>
      <div className="fixed inset-0 pointer-events-none z-[1]" aria-hidden="true">
        <div
          className="absolute top-[8%] left-[12%] w-[700px] h-[700px] rounded-full"
          style={{
            background: `radial-gradient(circle, ${bg1} 0%, transparent 70%)`,
            animation: "float-orb 20s ease-in-out infinite",
            willChange: "transform",
          }}
        />
        <div
          className="absolute top-[35%] right-[8%] w-[550px] h-[550px] rounded-full"
          style={{
            background: `radial-gradient(circle, ${bg2} 0%, transparent 70%)`,
            animation: "float-orb-2 25s ease-in-out infinite",
            willChange: "transform",
          }}
        />
        <div
          className="absolute bottom-[15%] left-[25%] w-[450px] h-[450px] rounded-full"
          style={{
            background: `radial-gradient(circle, ${bg1} 0%, transparent 70%)`,
            animation: "float-orb-3 18s ease-in-out infinite",
            willChange: "transform",
          }}
        />
        <div
          className="absolute top-[20%] left-[30%] w-[300px] h-[800px]"
          style={{
            background: `linear-gradient(180deg, transparent, ${bg1.replace("0.07)", "0.035)")}, transparent)`,
            animation: "drift-light 15s ease-in-out infinite",
            filter: "blur(80px)",
            willChange: "transform, opacity",
          }}
        />
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[600px]"
          style={{
            background: `radial-gradient(ellipse 50% 40% at 50% 50%, ${bg1} 0%, transparent 70%)`,
          }}
        />
      </div>

      {!hasScrolled && (
        <div
          className="fixed bottom-14 left-1/2 -translate-x-1/2 z-40 flex flex-col items-center gap-3 pointer-events-none select-none"
          style={{ animation: "fade-in 1.2s ease 1s both" }}
        >
          <span className="font-mono text-[9px] tracking-[0.2em] uppercase" style={{ color: "#7E8492" }}>
            {isCs ? "Pokračujte" : "Scroll"}
          </span>
          <div className="relative w-px h-10" style={{ background: "rgba(126,132,146,0.18)", boxShadow: "0 0 8px rgba(126,132,146,0.07)" }}>
            <div
              className="absolute top-0 left-1/2 -translate-x-1/2 w-[2px] h-[2px] rounded-full"
              style={{
                background: "rgba(183,188,199,0.7)",
                animation: "scroll-dot 2.4s ease-in-out infinite",
                boxShadow: "0 0 6px rgba(126,132,146,0.35)",
              }}
            />
          </div>
        </div>
      )}

      <aside className="fixed left-0 top-0 z-20 flex-col justify-center h-screen hidden sm:flex" style={{ padding: "120px 0 60px clamp(12px,2vw,48px)", width: "clamp(48px,8vw,80px)" }}>
        <div className="font-mono text-[9px] tracking-[0.18em] uppercase mb-8 select-none" style={{ color: "rgba(126,132,146,0.28)" }}>
          {t(locale, "profese.industries")}
        </div>
        <nav className="flex flex-col items-start">
          {PROFESSIONS.map((p, i) => (
            <button
              key={p.id}
              onClick={() => scrollTo(i)}
              className="group flex items-center gap-3 py-2.5 text-left w-full"
              style={{ opacity: i === sIdx ? 1 : 0.18 }}
              onMouseEnter={(e) => { if (i !== sIdx) e.currentTarget.style.opacity = "0.4"; }}
              onMouseLeave={(e) => { if (i !== sIdx) e.currentTarget.style.opacity = "0.18"; }}
            >
              <span
                className="w-px rounded-full flex-shrink-0 transition-all duration-500"
                style={{
                  height: i === sIdx ? "20px" : "0",
                  width: "1px",
                  background: p.colors.accent,
                  boxShadow: i === sIdx ? `0 0 6px ${p.colors.accent}` : "none",
                }}
              />
              <span
                className="font-mono text-[10px] tracking-[0.12em] flex-shrink-0"
                style={{ color: i === sIdx ? p.colors.accent : "rgba(126,132,146,0.55)" }}
              >
                {String(i + 1).padStart(2, "0")}
              </span>
              <span
                className="font-heading font-medium tracking-[-0.02em] text-[#F3F4F6] leading-tight truncate hidden lg:inline"
                style={{ fontSize: "clamp(11px,0.75vw,13px)", opacity: i === sIdx ? 1 : 0.5 }}
              >
                {isCs ? p.cs.name : p.en.name}
              </span>
            </button>
          ))}
        </nav>
      </aside>

      <div className="sm:hidden fixed bottom-0 left-0 right-0 z-30 flex items-center justify-center gap-3 px-4 py-3" style={{ background: "linear-gradient(0deg, rgba(8,8,10,0.95) 0%, rgba(8,8,10,0.4) 80%, transparent 100%)" }}>
        {PROFESSIONS.map((p, i) => (
          <button
            key={p.id}
            onClick={() => scrollTo(i)}
            className="font-mono text-[9px] tracking-[0.1em]"
            style={{
              color: i === sIdx ? p.colors.accent : "rgba(126,132,146,0.55)",
              transform: i === sIdx ? "scale(1.15)" : "scale(1)",
              transition: "transform 300ms ease, color 300ms ease",
            }}
          >
            {String(i + 1).padStart(2, "0")}
          </button>
        ))}
      </div>

      <main
        ref={scrollRef}
        className="relative z-10 h-full overflow-y-auto scroll-hide"
        style={{
          marginLeft: "clamp(48px,8vw,80px)",
          WebkitOverflowScrolling: "touch",
          scrollSnapType: "y mandatory",
        }}
      >
        <section
          data-section="0"
          className="flex flex-col items-center justify-center snap-start text-center relative"
          style={{ height: "100dvh", padding: "clamp(80px,12vh,120px) clamp(32px,6vw,96px)" }}
        >
          <div
            className="w-full flex flex-col items-center"
            style={{
              maxWidth: "520px",
              opacity: weight(0),
              transform: `translateY(${(1 - weight(0)) * 20}px)`,
              backfaceVisibility: "hidden",
            }}
          >
            <div className="font-mono text-[10px] tracking-[0.15em] uppercase mb-6" style={{ color: "rgba(126,132,146,0.35)", transition: "color 0.4s ease, text-shadow 0.4s ease" }} onMouseEnter={(e) => { e.currentTarget.style.color = "rgba(126,132,146,0.55)"; }} onMouseLeave={(e) => { e.currentTarget.style.color = "rgba(126,132,146,0.35)"; }}>00.</div>
            <p
              className="font-heading"
              style={{
                fontSize: "clamp(18px, 2.4vw, 28px)",
                lineHeight: 1.35,
                fontWeight: 400,
                letterSpacing: "-0.03em",
                color: "rgba(183,188,199,0.7)",
              }}
            >
              {t(locale, "profese.intro")}
            </p>
          </div>
        </section>

        {PROFESSIONS.map((p, i) => {
          const d = isCs ? p.cs : p.en;
          const w = weight(i + 1);
          const y = (1 - w) * 20;
          return (
            <section
              key={p.id}
              data-section={i + 1}
              className="flex flex-col justify-center snap-start relative"
              style={{ height: "100dvh", padding: "clamp(60px,8vh,100px) clamp(32px,6vw,96px)" }}
            >
              <div
                style={{
                  maxWidth: w > 0.5 ? "560px" : "500px",
                  opacity: w,
                  transform: `translateY(${y}px)`,
                  backfaceVisibility: "hidden",
                }}
              >
                <div style={{ opacity: Math.min(1, w * 1.3) }}>
                  <span
                    className="font-mono text-[10px] tracking-[0.15em] uppercase transition-all duration-300"
                    style={{ color: p.colors.accent }}
                    onMouseEnter={(e) => { e.currentTarget.style.textShadow = `0 0 12px ${p.colors.accent}30`; }}
                    onMouseLeave={(e) => { e.currentTarget.style.textShadow = "none"; }}
                  >
                    {String(i + 1).padStart(2, "0")}. {d.name}
                  </span>
                </div>

                <div
                  className="font-mono text-[8px] tracking-[0.12em] uppercase mb-4 transition-all duration-300"
                  style={{ color: p.colors.accent, opacity: Math.min(0.35, w * 0.5) }}
                  onMouseEnter={(e) => { e.currentTarget.style.opacity = "0.55"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.opacity = `${Math.min(0.35, w * 0.5)}`; }}
                >
                  {d.tags[0]}
                </div>

                <Link
                  href={`/${locale}/profese/${p.id}`}
                  className="block no-underline"
                >
                  <h1
                    className="font-heading mb-4"
                    style={{
                      fontSize: "clamp(34px, 5vw, 72px)",
                      lineHeight: 1.0,
                      fontWeight: 500,
                      letterSpacing: "-0.04em",
                      color: "#F3F4F6",
                      textShadow: w > 0.7 ? "0 0 80px rgba(126,132,146,0.14)" : "0 0 0 transparent",
                      backfaceVisibility: "hidden",
                      transition: "color 0.4s ease, text-shadow 0.4s ease",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.color = p.colors.accent;
                      e.currentTarget.style.textShadow = `0 0 60px ${p.colors.accent}25`;
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.color = "#F3F4F6";
                      e.currentTarget.style.textShadow = w > 0.7 ? "0 0 80px rgba(126,132,146,0.14)" : "0 0 0 transparent";
                    }}
                  >
                    {d.name}
                  </h1>
                </Link>

                <p
                  style={{
                    fontSize: "clamp(15px, 1.15vw, 17px)",
                    lineHeight: 1.7,
                    color: "#B7BCC7",
                    maxWidth: "46ch",
                    marginBottom: w > 0.5 ? "24px" : "0",
                    opacity: Math.min(1, Math.max(0, w * 2 - 0.5)),
                    backfaceVisibility: "hidden",
                  }}
                >
                  {d.desc}
                </p>

                <div
                  className="flex flex-wrap gap-2 overflow-hidden"
                  style={{
                    marginBottom: w > 0.5 ? "28px" : "0",
                    maxHeight: w > 0.3 ? `${w * 200}px` : "0",
                    opacity: Math.min(1, Math.max(0, w * 2 - 0.7)),
                  }}
                >
                  {d.tags.map((tag) => (
                    <span
                      key={tag}
                      className="font-mono text-[10px] tracking-[0.04em] px-3 py-1.5 rounded-full border transition-all duration-300"
                      style={{
                        color: p.colors.accent,
                        opacity: 0.65,
                        borderColor: `${p.colors.accent}18`,
                        background: `${p.colors.accent}08`,
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.opacity = "0.85";
                        e.currentTarget.style.borderColor = `${p.colors.accent}40`;
                        e.currentTarget.style.background = `${p.colors.accent}14`;
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.opacity = "0.65";
                        e.currentTarget.style.borderColor = `${p.colors.accent}18`;
                        e.currentTarget.style.background = `${p.colors.accent}08`;
                      }}
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                <Link
                  href={`/${locale}/profese/${p.id}`}
                  className="group inline-flex items-center gap-2.5 text-[13px] font-medium tracking-[-0.01em] no-underline"
                  style={{
                    color: p.colors.accent,
                    opacity: Math.min(0.65, Math.max(0, w * 1.5 - 0.75)),
                    transform: `translateY(${(1 - Math.min(1, Math.max(0, w * 1.5 - 0.75))) * 8}px)`,
                    pointerEvents: w > 0.6 ? "auto" : "none",
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.opacity = "0.9"; e.currentTarget.style.textShadow = `0 0 20px ${p.colors.accent}20`; }}
                  onMouseLeave={(e) => { e.currentTarget.style.opacity = "0.65"; e.currentTarget.style.textShadow = "none"; }}
                >
                  <span>{t(locale, "profese.explore")}</span>
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" className="transition-transform duration-500 ease-out group-hover:translate-x-1">
                    <path d="M2 6h8M6 2l4 4-4 4" />
                  </svg>
                </Link>
              </div>

              <div
                className="absolute bottom-0 left-[clamp(32px,6vw,96px)] right-[clamp(32px,6vw,96px)] h-px"
                style={{
                  background: `linear-gradient(90deg, transparent, ${p.colors.accent}${w > 0.5 ? "30" : "10"}, transparent)`,
                  opacity: Math.min(0.8, w * 1.2),
                }}
              />
            </section>
          );
        })}

        <section
          data-section={PROFESSIONS.length + 1}
          className="flex flex-col snap-start relative"
          style={{ height: "100dvh", padding: "clamp(60px,8vh,100px) clamp(32px,6vw,96px)" }}
        >
          <div className="flex-1 flex flex-col justify-center">
            <div style={{ maxWidth: "400px" }}>
              <p
                className="font-heading mb-6"
                style={{
                  fontSize: "clamp(20px, 2vw, 32px)",
                  lineHeight: 1.25,
                  fontWeight: 400,
                  letterSpacing: "-0.03em",
                  color: "rgba(183,188,199,0.6)",
                }}
              >
                {t(locale, "profese.ctaTitle")}
              </p>
              <Link
                href={`/${locale}/contact`}
                className="group inline-flex items-center gap-2.5 text-[14px] font-medium tracking-[-0.01em] no-underline transition-all duration-500 ease-out"
                style={{ color: "rgba(0,194,255,0.6)" }}
                onMouseEnter={(e) => { e.currentTarget.style.color = "rgba(0,194,255,0.9)"; e.currentTarget.style.textShadow = "0 0 20px rgba(0,194,255,0.15)"; }}
                onMouseLeave={(e) => { e.currentTarget.style.color = "rgba(0,194,255,0.6)"; e.currentTarget.style.textShadow = "none"; }}
              >
                <span>{t(locale, "profese.contactUs")}</span>
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" className="transition-transform duration-500 ease-out group-hover:translate-x-1">
                  <path d="M3 7h8M7 3l4 4-4 4" />
                </svg>
              </Link>
            </div>
          </div>
          <div className="flex justify-center pb-4">
            <p
              className="font-heading text-center"
              style={{
                fontSize: "clamp(11px, 0.85vw, 13px)",
                fontWeight: 400,
                letterSpacing: "0.06em",
                color: "rgba(126,132,146,0.35)",
              }}
            >
              {t(locale, "profese.footer")}
            </p>
          </div>
        </section>
      </main>
    </div>
  );
}
