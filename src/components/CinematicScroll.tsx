"use client";

import type { Locale } from "@/lib/types";
import { useScroll } from "framer-motion";
import { useRef, useState, useEffect } from "react";
import HeroScene from "@/components/scenes/HeroScene";
import SelectedProjectsScene from "@/components/scenes/SelectedProjectsScene";
import ProjectShowcaseScene from "@/components/scenes/ProjectShowcaseScene";
import MoreProjectsScene from "@/components/scenes/MoreProjectsScene";
import ContactScene from "@/components/scenes/ContactScene";
import { showcaseProjects } from "@/data/showcaseProjects";

/* ── Easing utilities ─────────────────────────────────────────────────── */

function cinematicEase(p: number): number {
  if (p <= 0) return 0;
  if (p >= 1) return 1;
  // Smooth acceleration — no dead zone, responds immediately
  return p * p * (3 - 2 * p);
}

function smoothstep(edge0: number, edge1: number, x: number): number {
  const t = Math.max(0, Math.min(1, (x - edge0) / (edge1 - edge0)));
  return t * t * (3 - 2 * t);
}

/** Interpolate a value based on progress through a range */
function interpolate(
  progress: number,
  inputRange: [number, number],
  outputRange: [number, number],
): number {
  const t = Math.max(0, Math.min(1, (progress - inputRange[0]) / (inputRange[1] - inputRange[0])));
  return outputRange[0] + (outputRange[1] - outputRange[0]) * t;
}

/** Cinematic enter: fade in from blur + translate + slight scale */
function cinematicEnter(
  v: number,
  start: number,
  end: number,
  opts: { blur?: number; ty?: number; scale?: number } = {},
) {
  const { blur = 3, ty = 14, scale = 0.97 } = opts;
  const t = smoothstep(start, end, v);
  return {
    opacity: t,
    blur: blur * (1 - t),
    ty: ty * (1 - t),
    scale: scale + (1 - scale) * t,
  };
}

/** Cinematic exit: fade out to blur + translate + slight scale */
function cinematicExit(
  v: number,
  start: number,
  end: number,
  opts: { blur?: number; ty?: number; scale?: number } = {},
) {
  const { blur = 3, ty = -14, scale = 1.03 } = opts;
  const t = smoothstep(start, end, v);
  return {
    opacity: 1 - t,
    blur: blur * t,
    ty: ty * t,
    scale: 1 + (scale - 1) * t,
  };
}

function useReducedMotion() {
  const [r, setR] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setR(mq.matches);
    const h = (e: MediaQueryListEvent) => setR(e.matches);
    mq.addEventListener("change", h);
    return () => mq.removeEventListener("change", h);
  }, []);
  return r;
}

/* ── Timeline ─────────────────────────────────────────────────────────── *
 *                                                                        *
 *  Raw scroll progress v: 0 → 1  (spacer 800svh)                       *
 *  Hero responds immediately — no dead zone                              *
 *                                                                        *
 *  SCENE 01 — HERO                                                       *
 *    0.00–0.04  HOLD (brief, then immediate response)                   *
 *    0.02–0.08  SPLIT (names reach ±120vw)                              *
 *    0.04–0.10  CONTAINER FADE                                           *
 *                                                                        *
 *  SCENE 02 — SELECTED PROJECTS                                          *
 *    0.06–0.12  ENTER                                                    *
 *    0.10–0.18  ITEMS STAGGER IN                                         *
 *    0.18–0.26  ACTIVE                                                   *
 *    0.24–0.30  BREAK APART + EXIT                                       *
 *                                                                        *
 *  SCENE 03 — CORTEX (flagship — 0.20 duration)                          *
 *    0.24–0.44  ENTER → HOLD → EXIT                                     *
 *    Visual lingers — final memory before transition.                    *
 *                                                                        *
 *  SCENES 04–06 — SHOWCASES (0.02 breathing gap between)                *
 *    AI Receptionist:   0.46–0.58  (0.12 — 1.5× base)                  *
 *    Zlatý Hřeben:      0.60–0.68  (0.08 — base)                       *
 *    Poníci:            0.70–0.78  (0.08 — base)                       *
 *                                                                        *
 *  SCENE 07 — MORE PROJECTS                                              *
 *    0.80–0.86  ENTER                                                    *
 *    0.88–0.92  EXIT                                                     *
 *                                                                        *
 *  SCENE 08 — CONTACT                                                    *
 *    0.94–0.98  ENTER                                                    *
 *    0.98–1.00  ACTIVE (final frame)                                     *
 *                                                                        *
 * ──────────────────────────────────────────────────────────────────────── */

/** Per-scene animation windows: ENTER (10%) → HOLD (80%) → EXIT (10%) */
const SHOWCASE_TIMING = [
  { enter: 0.24, exit: 0.44 },  // Cortex — flagship, 2× longer
  { enter: 0.46, exit: 0.58 },  // AI Receptionist — 1.5×
  { enter: 0.60, exit: 0.68 },  // Zlatý Hřeben — standard
  { enter: 0.70, exit: 0.78 },  // Poníci — standard
];

interface Props {
  locale: Locale;
}

export default function CinematicScroll({ locale }: Props) {
  const reducedMotion = useReducedMotion();
  const spacerRef = useRef<HTMLDivElement>(null);

  /* ── Scene 01 refs (Hero) ────────────────────────────────────────── */
  const s1ContainerRef = useRef<HTMLDivElement>(null);
  const s1MatyasRef = useRef<HTMLSpanElement>(null);
  const s1VojanRef = useRef<HTMLSpanElement>(null);
  const s1SubtitleRef = useRef<HTMLParagraphElement>(null);
  const s1CtaRef = useRef<HTMLAnchorElement>(null);

  /* ── Scene 02 refs (Selected Projects — chapter selector) ────────── */
  const s2ContainerRef = useRef<HTMLDivElement>(null);
  const s2HeadingRef = useRef<HTMLHeadingElement>(null);
  const s2SubtitleRef = useRef<HTMLParagraphElement>(null);
  const s2Item0Ref = useRef<HTMLDivElement>(null);
  const s2Item1Ref = useRef<HTMLDivElement>(null);
  const s2Item2Ref = useRef<HTMLDivElement>(null);
  const s2Item3Ref = useRef<HTMLDivElement>(null);

  /* ── Scenes 03–06 refs (generic showcases) ───────────────────────── */
  const showcaseContainers = useRef<[HTMLDivElement | null, HTMLDivElement | null, HTMLDivElement | null, HTMLDivElement | null]>([null, null, null, null]);
  const showcaseFrames = useRef<[HTMLDivElement | null, HTMLDivElement | null, HTMLDivElement | null, HTMLDivElement | null]>([null, null, null, null]);
  const showcaseTitles = useRef<[HTMLHeadingElement | null, HTMLHeadingElement | null, HTMLHeadingElement | null, HTMLHeadingElement | null]>([null, null, null, null]);
  const showcaseDescs = useRef<[HTMLParagraphElement | null, HTMLParagraphElement | null, HTMLParagraphElement | null, HTMLParagraphElement | null]>([null, null, null, null]);
  const showcaseFeatures = useRef<[HTMLParagraphElement | null, HTMLParagraphElement | null, HTMLParagraphElement | null, HTMLParagraphElement | null]>([null, null, null, null]);

  /* ── Scene 07 refs (More Projects) ───────────────────────────────── */
  const s7ContainerRef = useRef<HTMLDivElement>(null);
  const s7HeadingRef = useRef<HTMLHeadingElement>(null);
  const s7SubtitleRef = useRef<HTMLParagraphElement>(null);

  /* ── Scene 08 refs (Contact) ─────────────────────────────────────── */
  const s8ContainerRef = useRef<HTMLDivElement>(null);
  const s8BadgeRef = useRef<HTMLParagraphElement>(null);
  const s8TitleRef = useRef<HTMLHeadingElement>(null);
  const s8SubtitleRef = useRef<HTMLParagraphElement>(null);
  const s8CtaRef = useRef<HTMLAnchorElement>(null);

  const { scrollYProgress } = useScroll({
    target: spacerRef,
    offset: ["start start", "end start"],
  });

  /* ── Decoupled animation loop ───────────────────────────────────── *
   *                                                                   *
   *  Scroll sets targetProgress.                                      *
   *  requestAnimationFrame interpolates currentProgress toward it.    *
   *  Animation code reads currentProgress — never raw scroll.         *
   *                                                                   *
   *  This ensures:                                                    *
   *  - ENTER animations complete even during fast scrolling           *
   *  - Motion feels smooth and continuous                             *
   *  - The visitor never sees half-assembled compositions             *
   * ──────────────────────────────────────────────────────────────── */
  useEffect(() => {
    if (reducedMotion) return;

    const targetRef = { current: 0 };
    const currentRef = { current: 0 };
    let raf: number;

    // Subscribe to scroll — just update the target
    const unsubscribe = scrollYProgress.on("change", (v) => {
      targetRef.current = v;
    });

    // Animation loop — interpolate and render
    const tick = () => {
      const target = targetRef.current;
      const current = currentRef.current;

      // Dynamic lerp: faster when far behind, settles smoothly
      const gap = Math.abs(target - current);
      const lerpFactor = gap > 0.05 ? 0.14 : 0.10;

      // Snap if very close — avoids endless micro-iterations
      if (gap < 0.0001) {
        currentRef.current = target;
      } else {
        currentRef.current = current + (target - current) * lerpFactor;
      }

      const ep = cinematicEase(currentRef.current);
      renderFrame(ep);

      raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      unsubscribe();
    };
  }, [scrollYProgress, reducedMotion]);

  /* ── Render function — reads currentProgress, applies to DOM ────── */
  const renderFrame = (v: number) => {
        /* ═══ SCENE 01 — Hero names split ══════════════════════════════ */
        const travel = 120;
        const mx = v * -travel;
        const vx = v * travel;

        if (s1MatyasRef.current)
          s1MatyasRef.current.style.transform = `translateX(${mx}vw)`;
        if (s1VojanRef.current)
          s1VojanRef.current.style.transform = `translateX(${vx}vw)`;

        // Subtitle & CTA: blur + translate up as they exit
        const subExit = cinematicExit(v, 0.04, 0.10, { blur: 4, ty: -20, scale: 1 });

        if (s1SubtitleRef.current) {
          s1SubtitleRef.current.style.opacity = String(subExit.opacity);
          s1SubtitleRef.current.style.filter = `blur(${subExit.blur}px)`;
          s1SubtitleRef.current.style.transform = `translateY(${subExit.ty}px)`;
        }
        if (s1CtaRef.current) {
          s1CtaRef.current.style.opacity = String(subExit.opacity);
          s1CtaRef.current.style.filter = `blur(${subExit.blur}px)`;
          s1CtaRef.current.style.transform = `translateY(${subExit.ty * 0.8}px)`;
        }

        // Hero container: blur + translate up + fade
        if (s1ContainerRef.current) {
          const heroExit = cinematicExit(v, 0.04, 0.10, { blur: 3, ty: -24, scale: 1 });
          s1ContainerRef.current.style.opacity = String(heroExit.opacity);
          s1ContainerRef.current.style.filter = `blur(${heroExit.blur}px)`;
          s1ContainerRef.current.style.transform = `translateY(${heroExit.ty}px)`;
          s1ContainerRef.current.style.pointerEvents = heroExit.opacity < 0.01 ? "none" : "auto";
          s1ContainerRef.current.style.visibility = heroExit.opacity < 0.01 ? "hidden" : "visible";
        }

        /* ═══ SCENE 02 — Selected Projects (chapter selector) ══════════ */

        // Container: cinematic enter/exit with blur
        if (s2ContainerRef.current) {
          const enter2 = cinematicEnter(v, 0.06, 0.12, { blur: 4, ty: 20, scale: 0.98 });
          const exit2 = cinematicExit(v, 0.24, 0.30, { blur: 3, ty: -14, scale: 1.01 });
          const opacity = enter2.opacity * exit2.opacity;
          s2ContainerRef.current.style.opacity = String(opacity);
          s2ContainerRef.current.style.filter = `blur(${enter2.blur + exit2.blur}px)`;
          s2ContainerRef.current.style.transform = `translateY(${enter2.ty + exit2.ty}px) scale(${enter2.scale * exit2.scale})`;
          s2ContainerRef.current.style.pointerEvents = opacity > 0.5 ? "auto" : "none";
        }

        // Heading: cinematic enter, blur-out during break-apart
        if (s2HeadingRef.current) {
          const hIn = cinematicEnter(v, 0.06, 0.12, { blur: 3, ty: 12, scale: 0.98 });
          const hOut = cinematicExit(v, 0.24, 0.30, { blur: 4, ty: -14, scale: 1.01 });
          s2HeadingRef.current.style.opacity = String(hIn.opacity * hOut.opacity);
          s2HeadingRef.current.style.filter = `blur(${hIn.blur + hOut.blur}px)`;
          s2HeadingRef.current.style.transform = `translateY(${hIn.ty + hOut.ty}px) scale(${hIn.scale * hOut.scale})`;
        }

        // Subtitle: cinematic enter, blur-out
        if (s2SubtitleRef.current) {
          const sIn = cinematicEnter(v, 0.07, 0.13, { blur: 2, ty: 8, scale: 0.98 });
          const sOut = cinematicExit(v, 0.24, 0.30, { blur: 3, ty: -10, scale: 1.01 });
          s2SubtitleRef.current.style.opacity = String(sIn.opacity * sOut.opacity);
          s2SubtitleRef.current.style.filter = `blur(${sIn.blur + sOut.blur}px)`;
          s2SubtitleRef.current.style.transform = `translateY(${sIn.ty + sOut.ty}px)`;
        }

        // Items: staggered enter, then break-apart
        const itemRefs = [s2Item0Ref, s2Item1Ref, s2Item2Ref, s2Item3Ref];
        itemRefs.forEach((ref, i) => {
          if (ref.current) {
            // Staggered cinematic enter
            const enterStart = 0.10 + i * 0.02;
            const enterEnd = enterStart + 0.06;
            const itemIn = cinematicEnter(v, enterStart, enterEnd, {
              blur: 3,
              ty: 12 + i * 2,
              scale: 0.98,
            });

            // Break-apart phase
            const breakP = smoothstep(0.24, 0.30, v);

            if (i === 0) {
              // ── Item 01 (Cortex): brightens gradually, scales up, lifts ──
              const brighten = smoothstep(0.20, 0.28, v);
              const liftScale = 1 + 0.08 * breakP;
              const liftY = -8 * breakP;

              ref.current.style.opacity = String(itemIn.opacity * (0.6 + 0.4 * brighten));
              ref.current.style.filter = `blur(${itemIn.blur * (1 - brighten)}px)`;
              ref.current.style.transform = `translateY(${itemIn.ty + liftY}px) scale(${itemIn.scale * liftScale})`;
            } else {
              // ── Items 02–04: quietly recede into background ──
              const scatterDir = i % 2 === 0 ? -1 : 1;
              const scatterX = scatterDir * (30 + i * 18) * breakP;
              const scatterY = (i * 10) * breakP;
              const scatterBlur = breakP * 14;
              const dimFade = 1 - breakP;

              // Gradual dim — feels like falling into background, not disappearing
              const dimAmount = 0.55 + 0.45 * (1 - smoothstep(0.18, 0.24, v));

              ref.current.style.opacity = String(itemIn.opacity * dimAmount * dimFade);
              ref.current.style.filter = `blur(${itemIn.blur + scatterBlur}px)`;
              ref.current.style.transform = `translateY(${itemIn.ty + scatterY}px) translateX(${scatterX}px)`;
            }
          }
        });

        /* ═══ SCENES 03–06 — Generic showcase renderer ════════════════ *
         *                                                             *
         *  Visual hierarchy during exit:                              *
         *  1. Title + description fade first                          *
         *  2. Capabilities fade second                                *
         *  3. Main visual remains — final memory                      *
         *  4. Visual dissolves                                        *
         *                                                             *
         *  The main visual is always the emotional focus.             *
         *  It enters last and exits last.                             *
          * ─────────────────────────────────────────────────────────── */

        /* ── Cortex micro-interactions: progress through HOLD phase ── */
        const cortexHoldStart = SHOWCASE_TIMING[0].enter + (SHOWCASE_TIMING[0].exit - SHOWCASE_TIMING[0].enter) * 0.12;
        const cortexHoldEnd = SHOWCASE_TIMING[0].exit - (SHOWCASE_TIMING[0].exit - SHOWCASE_TIMING[0].enter) * 0.12;
        const microProgress = interpolate(v, [cortexHoldStart, cortexHoldEnd], [0, 1]);

        for (let i = 0; i < 4; i++) {
          const timing = SHOWCASE_TIMING[i];
          const container = showcaseContainers.current[i];
          const title = showcaseTitles.current[i];
          const desc = showcaseDescs.current[i];
          const frame = showcaseFrames.current[i];
          const features = showcaseFeatures.current[i];

          // Phase boundaries: 10% enter, 80% hold, 10% exit
          const window = timing.exit - timing.enter;
          const enterEnd = timing.enter + window * 0.10;
          const exitStart = timing.exit - window * 0.10;

          // ── Container: follows the visual (exits last) ──
          if (container) {
            const cBlurIn = smoothstep(timing.enter, enterEnd, v);
            // Container exits with the visual — fully gone by timing.exit + 0.01
            const cBlurOut = smoothstep(exitStart + window * 0.06, timing.exit + 0.01, v);
            const blur = 2 * (1 - cBlurIn) + 3 * cBlurOut;
            const ty = 6 * (1 - cBlurIn) + -8 * cBlurOut;
            const opacity = Math.min(cBlurIn, 1 - cBlurOut);
            container.style.opacity = String(opacity);
            container.style.filter = `blur(${blur}px)`;
            container.style.transform = `translateY(${ty}px)`;
            container.style.pointerEvents = opacity > 0.5 ? "auto" : "none";

            // Cortex micro-interactions: set CSS custom property for DashboardFrame
            if (i === 0) {
              container.style.setProperty("--micro", String(microProgress));
            }
          }

          // ── Staggered exit: title+desc → capabilities → visual ──
          const elements = [
            { el: title,    blur: 2, ty: 10, scale: 0.98, exitPct: 0   },
            { el: desc,     blur: 2, ty: 8,  scale: 1,    exitPct: 0   },
            { el: features, blur: 1, ty: 6,  scale: 1,    exitPct: 0.35 },
            { el: frame,    blur: 3, ty: 16, scale: 0.96, exitPct: 0.55 },
          ];

          for (const { el, blur: maxBlur, ty: maxTy, scale: minScale, exitPct } of elements) {
            if (!el) continue;

            // ENTER: all elements enter together
            const enterP = smoothstep(timing.enter, enterEnd, v);

            // EXIT: staggered — each element exits at its own point within the exit window
            const exitP = smoothstep(
              exitStart + window * exitPct,
              timing.exit + window * exitPct * 0.5,
              v,
            );

            const opacity = Math.min(enterP, 1 - exitP);
            const blur = maxBlur * ((1 - enterP) + exitP);
            const translateY = maxTy * ((1 - enterP) + exitP);
            const scale = minScale + (1 - minScale) * enterP + (minScale - 1) * exitP;

            el.style.opacity = String(opacity);
            el.style.filter = `blur(${blur}px)`;
            el.style.transform = `translateY(${translateY}px) scale(${scale})`;
          }
        }

        /* ═══ SCENE 07 — More Projects ═══════════════════════════════ */

        if (s7ContainerRef.current) {
          const c7Enter = cinematicEnter(v, 0.80, 0.86, { blur: 3, ty: 14, scale: 0.99 });
          const c7Exit = cinematicExit(v, 0.88, 0.92, { blur: 3, ty: -10, scale: 1 });
          const opacity = c7Enter.opacity * c7Exit.opacity;
          s7ContainerRef.current.style.opacity = String(opacity);
          s7ContainerRef.current.style.filter = `blur(${c7Enter.blur + c7Exit.blur}px)`;
          s7ContainerRef.current.style.transform = `translateY(${c7Enter.ty + c7Exit.ty}px) scale(${c7Enter.scale * c7Exit.scale})`;
          s7ContainerRef.current.style.pointerEvents = opacity > 0.5 ? "auto" : "none";
        }

        if (s7HeadingRef.current) {
          const h7 = cinematicEnter(v, 0.80, 0.84, { blur: 2, ty: 10, scale: 0.99 });
          const h7x = cinematicExit(v, 0.88, 0.92, { blur: 3, ty: -8, scale: 1 });
          s7HeadingRef.current.style.opacity = String(h7.opacity * h7x.opacity);
          s7HeadingRef.current.style.filter = `blur(${h7.blur + h7x.blur}px)`;
          s7HeadingRef.current.style.transform = `translateY(${h7.ty + h7x.ty}px) scale(${h7.scale * h7x.scale})`;
        }

        if (s7SubtitleRef.current) {
          const s7 = cinematicEnter(v, 0.81, 0.85, { blur: 2, ty: 6, scale: 1 });
          const s7x = cinematicExit(v, 0.88, 0.92, { blur: 2, ty: -6, scale: 1 });
          s7SubtitleRef.current.style.opacity = String(s7.opacity * s7x.opacity);
          s7SubtitleRef.current.style.filter = `blur(${s7.blur + s7x.blur}px)`;
          s7SubtitleRef.current.style.transform = `translateY(${s7.ty + s7x.ty}px)`;
        }

        /* ═══ SCENE 08 — Contact ═════════════════════════════════════ */

        if (s8ContainerRef.current) {
          const c8 = cinematicEnter(v, 0.94, 0.98, { blur: 3, ty: 14, scale: 0.99 });
          s8ContainerRef.current.style.opacity = String(c8.opacity);
          s8ContainerRef.current.style.filter = `blur(${c8.blur}px)`;
          s8ContainerRef.current.style.transform = `translateY(${c8.ty}px) scale(${c8.scale})`;
          s8ContainerRef.current.style.pointerEvents = c8.opacity > 0.5 ? "auto" : "none";
        }

        if (s8TitleRef.current) {
          const t8 = cinematicEnter(v, 0.945, 0.975, { blur: 3, ty: 12, scale: 0.98 });
          s8TitleRef.current.style.opacity = String(t8.opacity);
          s8TitleRef.current.style.filter = `blur(${t8.blur}px)`;
          s8TitleRef.current.style.transform = `translateY(${t8.ty}px) scale(${t8.scale})`;
        }

        if (s8SubtitleRef.current) {
          const st8 = cinematicEnter(v, 0.95, 0.98, { blur: 2, ty: 8, scale: 1 });
          s8SubtitleRef.current.style.opacity = String(st8.opacity);
          s8SubtitleRef.current.style.filter = `blur(${st8.blur}px)`;
          s8SubtitleRef.current.style.transform = `translateY(${st8.ty}px)`;
        }

        if (s8CtaRef.current) {
          const ct8 = cinematicEnter(v, 0.955, 0.98, { blur: 2, ty: 10, scale: 0.99 });
          s8CtaRef.current.style.opacity = String(ct8.opacity);
          s8CtaRef.current.style.filter = `blur(${ct8.blur}px)`;
          s8CtaRef.current.style.transform = `translateY(${ct8.ty}px) scale(${ct8.scale})`;
        }
  };

  return (
    <>
      {/* ═══ STICKY VIEWPORT — the cinematic canvas ════════════════════ */}
      <section
        className="relative w-full overflow-hidden"
        style={{
          height: "100svh",
          position: "sticky",
          top: 0,
          zIndex: 10,
        }}
      >
        <HeroScene
          locale={locale}
          containerRef={s1ContainerRef}
          matyasRef={s1MatyasRef}
          vojanRef={s1VojanRef}
          subtitleRef={s1SubtitleRef}
          ctaRef={s1CtaRef}
        />

        <SelectedProjectsScene
          locale={locale}
          containerRef={s2ContainerRef}
          headingRef={s2HeadingRef}
          subtitleRef={s2SubtitleRef}
          item0Ref={s2Item0Ref}
          item1Ref={s2Item1Ref}
          item2Ref={s2Item2Ref}
          item3Ref={s2Item3Ref}
        />

        {showcaseProjects.map((project, i) => (
          <ProjectShowcaseScene
            key={project.slug}
            url={project.url(locale)}
            title={project.title(locale)}
            description={project.description(locale)}
            features={project.features(locale)}
            previewLabel={project.previewLabel}
            accent={project.accent}
            titleScale={project.titleScale}
            mockupType={project.mockupType}
            containerRef={{
              get current() { return showcaseContainers.current[i]; },
              set current(v: HTMLDivElement | null) { showcaseContainers.current[i] = v; },
            } as React.RefObject<HTMLDivElement | null>}
            frameRef={{
              get current() { return showcaseFrames.current[i]; },
              set current(v: HTMLDivElement | null) { showcaseFrames.current[i] = v; },
            } as React.RefObject<HTMLDivElement | null>}
            titleRef={{
              get current() { return showcaseTitles.current[i]; },
              set current(v: HTMLHeadingElement | null) { showcaseTitles.current[i] = v; },
            } as React.RefObject<HTMLHeadingElement | null>}
            descRef={{
              get current() { return showcaseDescs.current[i]; },
              set current(v: HTMLParagraphElement | null) { showcaseDescs.current[i] = v; },
            } as React.RefObject<HTMLParagraphElement | null>}
            featuresRef={{
              get current() { return showcaseFeatures.current[i]; },
              set current(v: HTMLParagraphElement | null) { showcaseFeatures.current[i] = v; },
            } as React.RefObject<HTMLParagraphElement | null>}
          />
        ))}

        <MoreProjectsScene
          locale={locale}
          containerRef={s7ContainerRef}
          headingRef={s7HeadingRef}
          subtitleRef={s7SubtitleRef}
        />

        <ContactScene
          locale={locale}
          containerRef={s8ContainerRef}
          titleRef={s8TitleRef}
          subtitleRef={s8SubtitleRef}
          ctaRef={s8CtaRef}
          badgeRef={s8BadgeRef}
        />
      </section>

      {/* ═══ SCROLL TRACK — generates scroll progress ═════════════════ */}
      <div
        ref={spacerRef}
        className="relative"
        style={{ height: "800svh", zIndex: 1 }}
        aria-hidden="true"
      />
    </>
  );
}
