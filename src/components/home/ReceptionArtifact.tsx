'use client';

import { motion, useMotionValue, useScroll, useSpring, useTransform } from 'framer-motion';
import { useRef } from 'react';

/**
 * 3D artefakt hero — „digitální recepce“.
 * Vrstvený panel (karta rozhraní) s jemnou reakcí na pohyb myši a scroll.
 * Žádný random 3D objekt: obsahem je samotný produkt — recepce, která
 * bere poptávku a zapisuje rezervaci.
 */
export default function ReceptionArtifact() {
  const wrapRef = useRef<HTMLDivElement>(null);

  // Mouse tilt — tlumené pružiny, nic skáče
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const rY = useSpring(useTransform(mx, [-0.5, 0.5], [7, -7]), { stiffness: 90, damping: 18 });
  const rX = useSpring(useTransform(my, [-0.5, 0.5], [-5, 5]), { stiffness: 90, damping: 18 });

  // Scroll parallax — objekt „vkročí“ do prostoru
  const { scrollYProgress } = useScroll({ target: wrapRef, offset: ['start end', 'end start'] });
  const enterY = useTransform(scrollYProgress, [0, 0.35], [46, 0]);
  const enterRotX = useTransform(scrollYProgress, [0, 0.35], [10, 0]);

  function onMove(e: React.MouseEvent<HTMLDivElement>) {
    const r = e.currentTarget.getBoundingClientRect();
    mx.set((e.clientX - r.left) / r.width - 0.5);
    my.set((e.clientY - r.top) / r.height - 0.5);
  }
  function onLeave() {
    mx.set(0);
    my.set(0);
  }

  return (
    <div
      ref={wrapRef}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      className="relative [perspective:1200px]"
    >
      <motion.div
        style={{ rotateX: enterRotX, y: enterY }}
        initial={false}
        className="relative [transform-style:preserve-3d]"
      >
        {/* Zadní vrstvy — hloubka */}
        <div
          aria-hidden="true"
          className="absolute inset-0 translate-x-5 translate-y-5 border border-panel-edge [transform:translateZ(-60px)]"
        />
        <div
          aria-hidden="true"
          className="absolute inset-0 -translate-x-4 translate-y-3 border border-panel-edge/60 [transform:translateZ(-110px)]"
        />

        {/* Hlavní panel */}
        <motion.div
          style={{ rotateX: rX, rotateY: rY }}
          className="relative border border-panel-edge bg-panel p-6 [transform-style:preserve-3d] sm:p-7"
        >
          {/* Hlavička */}
          <div className="flex items-center justify-between gap-3">
            <p className="flex items-center gap-2.5 text-[10px] font-semibold uppercase tracking-[0.2em] text-ink">
              <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-accent" />
              Virtuální recepce
            </p>
            <p className="text-[9px] font-semibold uppercase tracking-[0.16em] text-faint">
              Online · 24/7
            </p>
          </div>

          {/* Konverzace */}
          <div className="mt-6 space-y-2.5 [transform:translateZ(30px)]">
            <p className="max-w-[86%] border border-border bg-surface-muted px-3.5 py-2.5 text-[13px] leading-relaxed text-ink-2">
              Dobrý den, chtěl bych se objednat na střih.
            </p>
            <p className="ml-auto max-w-[86%] border border-accent/25 bg-accent-soft px-3.5 py-2.5 text-[13px] leading-relaxed text-ink">
              Dobrý den. Ve středu máme volno ve 14:00 — mám vám termín rezervovat?
            </p>
            <p className="max-w-[86%] border border-border bg-surface-muted px-3.5 py-2.5 text-[13px] leading-relaxed text-ink-2">
              Ano, prosím.
            </p>
          </div>

          {/* Výsledek */}
          <div className="mt-6 flex items-center gap-2.5 border-t border-border pt-4">
            <span aria-hidden="true" className="h-1 w-1 rounded-full bg-accent" />
            <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-muted">
              Rezervace zapsána · středa 14:00
            </p>
            <span className="ml-auto text-[10px] font-semibold tabular-nums text-accent">4 s</span>
          </div>

          {/* Lime detail — spodní hrana karty */}
          <div aria-hidden="true" className="absolute -bottom-px left-6 right-6 h-px bg-accent/70" />
        </motion.div>
      </motion.div>
    </div>
  );
}
