// ── Colors ──────────────────────────────────────────────────────
export const colors = {
  primary: "#FAFAFA",
  secondary: "#A0A0A0",
  muted: "#666666",
  faint: "rgba(255,255,255,0.25)",

  bg: "#090909",
  surface: "rgba(17,17,17,0.25)",
  surfaceHi: "rgba(17,17,17,0.4)",

  accent: "#FAFAFA",
  accentMuted: "rgba(250,250,250,0.7)",
  accentFaint: "rgba(250,250,250,0.04)",

  border: "rgba(255,255,255,0.06)",
  borderHi: "rgba(255,255,255,0.12)",

  violetMuted: "#888888",
  violetFaint: "rgba(136,136,136,0.08)",
  borderViolet: "rgba(136,136,136,0.15)",
} as const;

// ── Typography ──────────────────────────────────────────────────
export const typography = {
  fontFamily: {
    heading: "var(--font-heading), system-ui, sans-serif",
    body: "var(--font-body), system-ui, sans-serif",
    mono: "var(--font-mono), monospace",
  },
  size: {
    display: "clamp(48px, 8vw, 96px)",
    h1: "clamp(36px, 6vw, 72px)",
    h2: "clamp(28px, 4vw, 48px)",
    h3: "clamp(22px, 3vw, 36px)",
    h4: "clamp(18px, 2.2vw, 24px)",
    bodyLg: "clamp(16px, 1.5vw, 20px)",
    body: "clamp(14px, 1.2vw, 16px)",
    bodySm: "clamp(12px, 1vw, 14px)",
    caption: "11px",
    micro: "10px",
  },
  weight: {
    regular: "400",
    medium: "500",
    bold: "600",
  },
  lineHeight: {
    tight: "1.1",
    snug: "1.3",
    relaxed: "1.6",
  },
  letterSpacing: {
    snug: "-0.01em",
    tight: "-0.02em",
    normal: "0em",
    wide: "0.04em",
    wider: "0.08em",
    ultra: "0.12em",
    mega: "0.2em",
  },
} as const;

// ── Spacing ─────────────────────────────────────────────────────
export const spacing = {
  section: {
    px: "clamp(24px, 5vw, 64px)",
    py: "clamp(80px, 12vw, 140px)",
  },
  container: {
    maxWidth: "1100px",
    narrow: "700px",
  },
  stack: {
    sm: "8px",
    md: "16px",
    lg: "24px",
    xl: "40px",
  },
} as const;

// ── Radius ──────────────────────────────────────────────────────
export const radius = {
  md: "8px",
  lg: "12px",
  xl: "20px",
  full: "9999px",
} as const;

// ── Easing curves (framer-motion arrays) ────────────────────────
export const easing = {
  hover: [0.22, 1, 0.36, 1],
  pageIn: [0.76, 0, 0.24, 1],
  pageOut: [0.22, 1, 0.36, 1],
  reveal: [0.16, 1, 0.3, 1],
  spring: [0.34, 1.56, 0.64, 1],
} as const;

// ── Easing (CSS strings for transition shorthand) ───────────────
export const ease = {
  default: "cubic-bezier(0.22, 0.8, 0.2, 1)",
} as const;

// ── Durations ───────────────────────────────────────────────────
export const duration = {
  // Milliseconds (for framer-motion, animations.ts divides by 1000)
  hover: 200,
  card: 280,
  page: 600,
  reveal: 600,
  stagger: 0.06,
  floating: 9,
  gradient: 18,

  // CSS strings (for CSS transition shorthand)
  slow: "300ms",
  normal: "200ms",
} as const;
