"use client";

import { useEffect, useRef } from "react";

interface ParticleFieldProps {
  className?: string;
  density?: number;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  r: number;
  depth: number;
  hue: number;
  phase: number;
}

const COLORS = [
  { r: 255, g: 74, b: 46 }, // vermilion (accent)
  { r: 255, g: 107, b: 61 }, // lighter vermilion
  { r: 232, g: 52, b: 31 }, // deep vermilion
];

const LINK_DIST = 130;
const POINTER_RADIUS = 150;

/**
 * Living system core — hloubkové vrstvy částic, klidný pohyb,
 * jemná reakce na kurzor. RAF smyčka, DPR cap 2, pauza mimo viewport
 * i při skryté kartě, statický snímek při prefers-reduced-motion.
 */
export default function ParticleField({ className, density = 1 }: ParticleFieldProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = 0;
    let height = 0;
    let dpr = 1;
    let particles: Particle[] = [];
    let raf = 0;
    let running = false;
    let visible = true;
    let disposed = false;
    const pointer = { x: -9999, y: -9999, tx: -9999, ty: -9999 };

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const isMobile = window.matchMedia("(max-width: 768px)").matches;
    const densityScale = isMobile ? 0.45 : 1;
    const maxCount = isMobile ? 60 : 110;

    const countFor = (w: number, h: number) =>
      Math.min(maxCount, Math.round((w * h) / 16000) * density * densityScale);

    const spawn = (w: number, h: number): Particle => {
      const depth = 0.45 + Math.random() * 0.55;
      return {
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.16 * depth,
        vy: (Math.random() - 0.5) * 0.16 * depth - 0.04 * depth,
        r: (0.5 + Math.random() * 1.4) * depth,
        depth,
        hue: Math.floor(Math.random() * COLORS.length),
        phase: Math.random() * Math.PI * 2,
      };
    };

    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = canvas.clientWidth;
      height = canvas.clientHeight;
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const target = countFor(width, height);
      particles = Array.from({ length: target }, () => spawn(width, height));
      drawFrame(0);
    };

    const drawFrame = (t: number) => {
      ctx.clearRect(0, 0, width, height);

      const c = COLORS[Math.floor(t / 2000) % COLORS.length];

      // centrální core glow — jemně reaguje na kurzor
      const pointerPullX = (pointer.x - width / 2) * 0.02;
      const pointerPullY = (pointer.y - height / 2.35) * 0.02;
      const coreX = width / 2 + pointerPullX;
      const coreY = height / 2.35 + pointerPullY;
      const coreR = Math.min(width, height) * 0.16;
      const pulse = 0.5 + 0.5 * Math.sin(t / 1400 + Math.PI / 2);
      const grad = ctx.createRadialGradient(coreX, coreY, 0, coreX, coreY, coreR);
      grad.addColorStop(0, `rgba(${c.r},${c.g},${c.b},${0.05 + pulse * 0.04})`);
      grad.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, width, height);

      // plynulé dohánění kurzoru
      pointer.x += (pointer.tx - pointer.x) * 0.08;
      pointer.y += (pointer.ty - pointer.y) * 0.08;

      for (const p of particles) {
        // jemná reakce na kurzor — odpudivá síla
        const dx = p.x - pointer.x;
        const dy = p.y - pointer.y;
        const dist2 = dx * dx + dy * dy;
        if (dist2 < POINTER_RADIUS * POINTER_RADIUS && dist2 > 0.01) {
          const dist = Math.sqrt(dist2);
          const force = (1 - dist / POINTER_RADIUS) * 0.045 * p.depth;
          p.x += (dx / dist) * force;
          p.y += (dy / dist) * force;
        }

        p.x += p.vx;
        p.y += p.vy;
        if (p.x < -20) p.x = width + 20;
        if (p.x > width + 20) p.x = -20;
        if (p.y < -20) p.y = height + 20;
        if (p.y > height + 20) p.y = -20;
      }

      // spojnice — jen mezi hloubkově blízkými částicemi
      for (let i = 0; i < particles.length; i++) {
        const a = particles[i];
        for (let j = i + 1; j < particles.length; j++) {
          const b = particles[j];
          if (Math.abs(a.depth - b.depth) > 0.35) continue;
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const d2 = dx * dx + dy * dy;
          if (d2 < LINK_DIST * LINK_DIST) {
            const alpha = (1 - Math.sqrt(d2) / LINK_DIST) * 0.14 * Math.min(a.depth, b.depth);
            const ca = COLORS[a.hue];
            const cb = COLORS[b.hue];
            ctx.strokeStyle = `rgba(${Math.round((ca.r + cb.r) / 2)},${Math.round(
              (ca.g + cb.g) / 2
            )},${Math.round((ca.b + cb.b) / 2)},${alpha.toFixed(3)})`;
            ctx.lineWidth = 0.75;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
        }
      }

      // částice
      for (const p of particles) {
        const ca = COLORS[p.hue];
        const twinkle = 0.3 + 0.45 * p.depth * (0.5 + 0.5 * Math.sin(t / 900 + p.phase));
        ctx.fillStyle = `rgba(${ca.r},${ca.g},${ca.b},${twinkle.toFixed(3)})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
      }
    };

    const loop = (t: number) => {
      if (!running || disposed) return;
      drawFrame(t);
      raf = requestAnimationFrame(loop);
    };

    const start = () => {
      if (running || disposed) return;
      running = true;
      raf = requestAnimationFrame(loop);
    };

    const stop = () => {
      running = false;
      cancelAnimationFrame(raf);
    };

    const onVisibility = () => {
      if (document.hidden) {
        stop();
      } else if (visible) {
        start();
      }
    };

    const onPointerMove = (e: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      pointer.tx = e.clientX - rect.left;
      pointer.ty = e.clientY - rect.top;
    };

    const onPointerLeave = () => {
      pointer.tx = -9999;
      pointer.ty = -9999;
    };

    const io = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting;
        if (visible) start();
        else stop();
      },
      { rootMargin: "120px" }
    );
    io.observe(canvas);

    document.addEventListener("visibilitychange", onVisibility);
    window.addEventListener("resize", resize);
    window.addEventListener("pointermove", onPointerMove, { passive: true });
    window.addEventListener("pointerleave", onPointerLeave, { passive: true });

    resize();

    if (!reduceMotion) {
      start();
    }

    return () => {
      disposed = true;
      stop();
      io.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerleave", onPointerLeave);
    };
  }, [density]);

  return <canvas ref={canvasRef} className={className} aria-hidden="true" />;
}
