"use client";

import { useEffect, useRef } from "react";

/**
 * Globální vermilionová záře sledující kurzor.
 * Objeví se při prvním pohybu myši, drží se pod ukazatelem,
 * nikdy neblokuje interakci (pointer-events: none).
 */
export default function CursorGlow() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || typeof window === "undefined") return;
    let raf = 0;
    let shown = false;
    const onMove = (e: MouseEvent) => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        el.style.transform = `translate(${e.clientX}px, ${e.clientY}px) translate(-50%, -50%)`;
        if (!shown) {
          shown = true;
          el.style.opacity = "1";
        }
      });
    };
    window.addEventListener("mousemove", onMove, { passive: true });
    return () => {
      window.removeEventListener("mousemove", onMove);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div
      ref={ref}
      aria-hidden="true"
      data-cursor-glow=""
      className="pointer-events-none fixed"
      style={{
        left: 0,
        top: 0,
        width: 200,
        height: 200,
        zIndex: 0,
        willChange: "transform, opacity",
        opacity: 0,
        transition: "opacity 0.35s ease",
        background:
          "radial-gradient(circle, rgba(255,74,46,0.30) 0%, rgba(255,74,46,0.14) 35%, rgba(255,74,46,0.05) 55%, transparent 70%)",
        filter: "blur(8px)",
      }}
    />
  );
}
