import type { Variants, Transition } from "framer-motion";
import { easing, duration } from "./tokens";

// ─── Scroll reveal ──────────────────────────────────────────────
export const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 32 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: duration.reveal / 1000,
      ease: easing.reveal,
    },
  },
};

export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      duration: duration.reveal / 1000,
      ease: easing.reveal,
    },
  },
};

export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.92 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: duration.reveal / 1000,
      ease: easing.reveal,
    },
  },
};

export const slideInLeft: Variants = {
  hidden: { opacity: 0, x: -48 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: duration.reveal / 1000,
      ease: easing.reveal,
    },
  },
};

export const slideInRight: Variants = {
  hidden: { opacity: 0, x: 48 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: duration.reveal / 1000,
      ease: easing.reveal,
    },
  },
};

export const blurFadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      duration: (duration.reveal + 100) / 1000,
      ease: easing.reveal,
    },
  },
};

// ─── Container stagger ──────────────────────────────────────────
export const staggerContainer: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: duration.stagger,
      delayChildren: 0.1,
    },
  },
};

export const staggerItem: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: duration.reveal / 1000,
      ease: easing.reveal,
    },
  },
};

// ─── Transition presets ─────────────────────────────────────────
export const transitions = {
  fast: { duration: duration.hover / 1000, ease: easing.hover },
  normal: { duration: duration.card / 1000, ease: easing.hover },
  slow: { duration: duration.reveal / 1000, ease: easing.reveal },
  slower: { duration: (duration.reveal + 200) / 1000, ease: easing.reveal },
};

// ─── Hover / tap (CSS-driven — use as class hooks) ─────────────
export const scaleOnHover = {
  scale: 1.04,
  rotate: 2,
  transition: {
    duration: duration.card / 1000,
    ease: easing.hover,
  },
};

export const subtleScale: Transition = {
  duration: duration.hover / 1000,
  ease: easing.hover,
};

// ─── Page transition ────────────────────────────────────────────
export const pageTransition: Transition = {
  duration: duration.page / 1000,
  ease: easing.pageIn,
};

// ─── Viewport config ────────────────────────────────────────────
export const viewportConfig = { once: true, margin: "-60px" };
