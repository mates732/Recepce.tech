"use client";

import { useEffect, useRef } from "react";
import {
  motionValue,
  useReducedMotion,
  useTransform,
  type MotionValue,
} from "framer-motion";

export type ScrollAnchor = "start" | "end";
export type ScrollOffset = [
  [ScrollAnchor, ScrollAnchor],
  [ScrollAnchor, ScrollAnchor],
];

export const OFFSET_ENTRY_EXIT: ScrollOffset = [
  ["start", "end"],
  ["end", "start"],
];

export const OFFSET_TOP_OUT: ScrollOffset = [
  ["start", "start"],
  ["end", "start"],
];

export const OFFSET_FULL: ScrollOffset = [
  ["start", "start"],
  ["end", "end"],
];

interface Entry {
  el: HTMLElement;
  mv: MotionValue<number>;
  offset: ScrollOffset;
  rect: DOMRect | null;
  absTop: number | null;
}

let entries: Entry[] = [];
let viewportH = 0;
let rafId = 0;
let attached = false;
let frameCount = 0;
let scrollYSubscribers = 0;

const CULL = 1;
const FULL_MEASURE_EVERY = 60;

const windowScrollY = motionValue(0);

function clamp01(v: number) {
  return v < 0 ? 0 : v > 1 ? 1 : v;
}

function measure() {
  rafId = 0;
  frameCount += 1;
  const full = frameCount % FULL_MEASURE_EVERY === 0;
  const height = viewportH;
  const y = window.scrollY;
  const bandTop = y - height * CULL;
  const bandBottom = y + height * (1 + CULL);

  if (scrollYSubscribers > 0) {
    windowScrollY.set(y);
  }

  for (const e of entries) {
    const el = e.el;
    if (!el.isConnected) continue;
    let rect = e.rect;
    if (full || !rect) {
      rect = el.getBoundingClientRect();
      e.rect = rect;
      e.absTop = rect.top + y;
    } else if (
      e.absTop !== null &&
      e.absTop < bandBottom &&
      e.absTop + rect.height > bandTop
    ) {
      rect = el.getBoundingClientRect();
      e.rect = rect;
      e.absTop = rect.top + y;
    }

    const [[ta, ca], [tb, cb]] = e.offset;
    const c0 = (ca === "end" ? height : 0) - (ta === "end" ? rect.height : 0);
    const c1 = (cb === "end" ? height : 0) - (tb === "end" ? rect.height : 0);
    const denom = c0 - c1;
    e.mv.set(denom !== 0 ? clamp01((c0 - rect.top) / denom) : 0);
  }
}

function schedule() {
  if (rafId) return;
  rafId = requestAnimationFrame(measure);
}

function invalidate() {
  for (const e of entries) {
    e.rect = null;
    e.absTop = null;
  }
  schedule();
}

function onResize() {
  viewportH = window.innerHeight;
  invalidate();
}

function ensureAttached() {
  if (attached || typeof window === "undefined") return;
  attached = true;
  viewportH = window.innerHeight;
  window.addEventListener("scroll", schedule, { passive: true });
  window.addEventListener("resize", onResize, { passive: true });
  if (document.readyState === "complete") {
    invalidate();
  } else {
    window.addEventListener("load", invalidate, { once: true });
  }
}

function track(el: HTMLElement, mv: MotionValue<number>, offset: ScrollOffset) {
  ensureAttached();
  entries.push({ el, mv, offset, rect: null, absTop: null });
  schedule();
  return () => {
    entries = entries.filter((e) => e.mv !== mv);
  };
}

export function useElementScrollProgress(
  ref: React.RefObject<HTMLElement | null>,
  offset: ScrollOffset = OFFSET_ENTRY_EXIT,
  reducedMotionProgress = 0,
): MotionValue<number> {
  const shouldReduce = !!useReducedMotion();
  const offsetRef = useRef(offset);
  offsetRef.current = offset;
  const mvRef = useRef<MotionValue<number> | null>(null);
  if (mvRef.current === null) {
    mvRef.current = motionValue(reducedMotionProgress);
  }

  useEffect(() => {
    const mv = mvRef.current!;
    if (shouldReduce) {
      mv.set(reducedMotionProgress);
      return;
    }
    const el = ref.current;
    if (!el) return;
    return track(el, mv, offsetRef.current);
  }, [shouldReduce, reducedMotionProgress, ref]);

  return mvRef.current;
}

export function useParallax(
  ref: React.RefObject<HTMLElement | null>,
  from: number,
  to: number,
  offset: ScrollOffset = OFFSET_ENTRY_EXIT,
): MotionValue<number> {
  const shouldReduce = !!useReducedMotion();
  const progress = useElementScrollProgress(ref, offset);
  const y = useTransform(progress, [0, 1], [from, to]);
  useEffect(() => {
    if (shouldReduce) y.set(0);
  }, [shouldReduce, y]);
  return y;
}

export function useScrollY(): MotionValue<number> {
  useEffect(() => {
    scrollYSubscribers += 1;
    schedule();
    return () => {
      scrollYSubscribers -= 1;
    };
  }, []);
  return windowScrollY;
}
