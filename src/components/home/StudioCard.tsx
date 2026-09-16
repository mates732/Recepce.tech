'use client';

import { motion, useMotionValue, useReducedMotion, useSpring, useTransform } from 'framer-motion';
import { useRef } from 'react';

/**
 * Digitální vizitka — fyzická karta položená v digitálním prostoru.
 * Přijíždí scrollem, na myš reaguje velmi jemným náklonem. Čitelnost první.
 */
export default function StudioCard() {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();

  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const rY = useSpring(useTransform(mx, [-0.5, 0.5], [4, -4]), { stiffness: 70, damping: 20 });
  const rX = useSpring(useTransform(my, [-0.5, 0.5], [-3, 3]), { stiffness: 70, damping: 20 });

  return (
    <motion.div
      ref={ref}
      initial={reduce ? false : { opacity: 0, y: 60, rotateX: 12 }}
      whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
      viewport={{ once: true, margin: '-15% 0px' }}
      transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
      style={{ perspective: 1000 }}
      onMouseMove={(e) => {
        const r = e.currentTarget.getBoundingClientRect();
        mx.set((e.clientX - r.left) / r.width - 0.5);
        my.set((e.clientY - r.top) / r.height - 0.5);
      }}
      onMouseLeave={() => {
        mx.set(0);
        my.set(0);
      }}
      className="relative mx-auto w-full max-w-2xl"
    >
      <motion.div
        style={{ rotateX: rX, rotateY: rY, transformStyle: 'preserve-3d' }}
        className="relative border border-panel-edge bg-panel px-8 py-12 text-center sm:px-12 sm:py-14"
      >
        {/* Rytá struktura — dvojité okraje jako u rytiny */}
        <div aria-hidden="true" className="pointer-events-none absolute inset-2.5 border border-border/70" />

        <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-accent">
          Digital Solutions
        </p>
        <p className="mt-5 text-[clamp(1.7rem,4vw,2.6rem)] font-semibold leading-none tracking-[-0.02em] text-ink">
          RECEPCE.TECH
        </p>
        <p className="mt-4 text-[11px] font-medium uppercase tracking-[0.2em] text-muted">
          Web × Virtuální asistenti
        </p>

        <div className="mx-auto mt-7 flex w-fit items-center gap-3 border-y border-border py-3 text-[11px] font-medium uppercase tracking-[0.18em] text-ink-2">
          <span>CZ / EU</span>
          <span aria-hidden="true" className="h-1 w-1 rounded-full bg-accent" />
          <a
            href="mailto:vojanmatyas@gmail.com"
            className="transition-colors duration-200 hover:text-accent"
          >
            vojanmatyas@gmail.com
          </a>
        </div>
      </motion.div>
    </motion.div>
  );
}
