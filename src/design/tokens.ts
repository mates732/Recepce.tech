export const colors = {
  primary: "#111111",
  secondary: "#5F6368",
  muted: "#9CA3AF",
  faint: "rgba(17,17,17,0.04)",

  bg: "#F7F8FA",
  surface: "#FFFFFF",
  card: "#FCFCFD",

  accent: "#111111",
  accentSecondary: "#5F6368",
  accentSoft: "rgba(17,17,17,0.06)",
  accentSecondarySoft: "rgba(17,17,17,0.04)",

  border: "rgba(17,17,17,0.08)",
  borderHi: "rgba(17,17,17,0.12)",

  violetMuted: "#6B7280",
  violetFaint: "rgba(17,17,17,0.06)",
  borderViolet: "rgba(17,17,17,0.12)",

  accentMuted: "rgba(17,17,17,0.7)",
  accentFaint: "rgba(17,17,17,0.04)",
} as const;

export const typography = {
  fontFamily: {
    heading: "var(--font-heading), Georgia, serif",
    body: "var(--font-body), system-ui, sans-serif",
    mono: "var(--font-mono), monospace",
  },
  size: {
    display: "clamp(64px, 8vw, 120px)",
    h1: "clamp(40px, 6vw, 80px)",
    h2: "clamp(32px, 4.5vw, 56px)",
    h3: "clamp(24px, 3vw, 40px)",
    h4: "clamp(18px, 2vw, 28px)",
    bodyLg: "clamp(16px, 1.5vw, 20px)",
    body: "clamp(14px, 1.2vw, 16px)",
    bodySm: "clamp(12px, 1vw, 14px)",
    caption: "clamp(10px, 0.8vw, 11px)",
    micro: "clamp(9px, 0.7vw, 10px)",
  },
  weight: {
    regular: "400",
    medium: "500",
    semibold: "600",
    bold: "700",
  },
  lineHeight: {
    tight: "1.05",
    snug: "1.2",
    relaxed: "1.6",
  },
  letterSpacing: {
    snug: "-0.02em",
    tight: "-0.01em",
    normal: "0em",
    wide: "0.04em",
    wider: "0.08em",
    ultra: "0.12em",
    mega: "0.2em",
  },
} as const;

export const spacing = {
  section: {
    px: "clamp(24px, 5vw, 80px)",
    py: "clamp(64px, 12vw, 160px)",
  },
  container: {
    maxWidth: "min(1200px, calc(100vw - clamp(48px, 10vw, 160px)))",
    narrow: "min(720px, calc(100vw - clamp(48px, 10vw, 160px)))",
  },
  stack: {
    sm: "clamp(6px, 0.6vw, 8px)",
    md: "clamp(12px, 1.2vw, 16px)",
    lg: "clamp(20px, 1.8vw, 24px)",
    xl: "clamp(32px, 3vw, 40px)",
    xxl: "clamp(48px, 5vw, 64px)",
  },
} as const;

export const radius = {
  sm: "clamp(3px, 0.3vw, 4px)",
  md: "clamp(6px, 0.6vw, 8px)",
  lg: "clamp(12px, 1.2vw, 16px)",
  xl: "clamp(18px, 1.8vw, 24px)",
  full: "9999px",
} as const;

export const easing = {
  hover: [0.22, 1, 0.36, 1],
  pageIn: [0.76, 0, 0.24, 1],
  pageOut: [0.22, 1, 0.36, 1],
  reveal: [0.16, 1, 0.3, 1],
  spring: [0.34, 1.56, 0.64, 1],
} as const;

export const ease = {
  default: "cubic-bezier(0.22, 0.8, 0.2, 1)",
} as const;

export const duration = {
  hover: 200,
  card: 280,
  page: 600,
  reveal: 600,
  stagger: 0.06,
  floating: 9,
  gradient: 18,
  slow: "300ms",
  normal: "200ms",
} as const;
