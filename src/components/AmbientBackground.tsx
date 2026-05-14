"use client";

import { usePathname } from "next/navigation";

type AmbientVariant = "home" | "intelligence" | "concierge" | "atmosfera" | "private" | "live-demo" | "status" | "contact" | "demo";

const variantColors: Record<AmbientVariant, { orbs: string[]; glow: string }> = {
  home: {
    orbs: [
      "rgba(18,48,74,0.35)",
      "rgba(13,34,56,0.25)",
      "rgba(0,194,255,0.04)",
    ],
    glow: "rgba(18,48,74,0.2)",
  },
  intelligence: {
    orbs: [
      "rgba(124,107,255,0.12)",
      "rgba(18,48,74,0.3)",
      "rgba(0,194,255,0.04)",
    ],
    glow: "rgba(124,107,255,0.06)",
  },
  concierge: {
    orbs: [
      "rgba(0,194,255,0.1)",
      "rgba(18,48,74,0.25)",
      "rgba(124,107,255,0.04)",
    ],
    glow: "rgba(0,194,255,0.05)",
  },
  atmosfera: {
    orbs: [
      "rgba(124,107,255,0.08)",
      "rgba(13,34,56,0.2)",
      "rgba(243,244,246,0.03)",
    ],
    glow: "rgba(124,107,255,0.04)",
  },
  private: {
    orbs: [
      "rgba(243,244,246,0.04)",
      "rgba(13,34,56,0.2)",
      "rgba(124,107,255,0.03)",
    ],
    glow: "rgba(243,244,246,0.02)",
  },
  "live-demo": {
    orbs: [
      "rgba(0,194,255,0.1)",
      "rgba(18,48,74,0.3)",
      "rgba(124,107,255,0.04)",
    ],
    glow: "rgba(0,194,255,0.05)",
  },
  status: {
    orbs: [
      "rgba(18,48,74,0.3)",
      "rgba(0,194,255,0.06)",
      "rgba(124,107,255,0.03)",
    ],
    glow: "rgba(13,34,56,0.25)",
  },
  contact: {
    orbs: [
      "rgba(18,48,74,0.3)",
      "rgba(124,107,255,0.08)",
      "rgba(0,194,255,0.04)",
    ],
    glow: "rgba(13,34,56,0.2)",
  },
  demo: {
    orbs: [
      "rgba(0,194,255,0.08)",
      "rgba(18,48,74,0.25)",
      "rgba(124,107,255,0.04)",
    ],
    glow: "rgba(0,194,255,0.04)",
  },
};

function getVariant(pathname: string): AmbientVariant {
  const p = pathname.replace(/^\/(cs|en)/, "");
  if (p.startsWith("/demo")) return "demo";
  if (p.startsWith("/intelligence")) return "intelligence";
  if (p.startsWith("/concierge")) return "concierge";
  if (p.startsWith("/atmosfera")) return "atmosfera";
  if (p.startsWith("/private")) return "private";
  if (p.startsWith("/live-demo")) return "live-demo";
  if (p.startsWith("/status")) return "status";
  if (p.startsWith("/contact")) return "contact";
  return "home";
}

export default function AmbientBackground() {
  const pathname = usePathname();
  const variant = getVariant(pathname);
  const colors = variantColors[variant];

  return (
    <div className="fixed inset-0 pointer-events-none z-0" aria-hidden="true">
      {/* Primary floating orb */}
      <div
        className="absolute top-[8%] left-[12%] w-[700px] h-[700px] rounded-full"
        style={{
          background: `radial-gradient(circle, ${colors.orbs[0]} 0%, transparent 70%)`,
          animation: "float-orb 20s ease-in-out infinite",
          willChange: "transform",
        }}
      />
      {/* Secondary floating orb */}
      <div
        className="absolute top-[35%] right-[8%] w-[550px] h-[550px] rounded-full"
        style={{
          background: `radial-gradient(circle, ${colors.orbs[1]} 0%, transparent 70%)`,
          animation: "float-orb-2 25s ease-in-out infinite",
          willChange: "transform",
        }}
      />
      {/* Tertiary floating orb */}
      <div
        className="absolute bottom-[15%] left-[25%] w-[450px] h-[450px] rounded-full"
        style={{
          background: `radial-gradient(circle, ${colors.orbs[2]} 0%, transparent 70%)`,
          animation: "float-orb-3 18s ease-in-out infinite",
          willChange: "transform",
        }}
      />
      {/* Drifting light sweep */}
      <div
        className="absolute top-[20%] left-[30%] w-[300px] h-[800px]"
        style={{
          background: `linear-gradient(180deg, transparent, ${colors.glow}, transparent)`,
          animation: "drift-light 15s ease-in-out infinite",
          filter: "blur(80px)",
          willChange: "transform, opacity",
        }}
      />
      {/* Central ambient glow */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[600px]"
        style={{
          background: `radial-gradient(ellipse 50% 40% at 50% 50%, ${colors.glow} 0%, transparent 70%)`,
        }}
      />
      {/* Top gradient sweep */}
      <div
        className="absolute top-0 left-0 w-full h-[60%]"
        style={{
          background: `linear-gradient(180deg, ${colors.glow} 0%, transparent 100%)`,
        }}
      />
      {/* Subtle grid overlay */}
      <div
        className="absolute inset-0 opacity-[0.015]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(243,244,246,0.015) 1px, transparent 1px), linear-gradient(90deg, rgba(243,244,246,0.015) 1px, transparent 1px)",
          backgroundSize: "80px 80px",
          maskImage: "radial-gradient(ellipse at 50% 30%, black, transparent 75%)",
          WebkitMaskImage: "radial-gradient(ellipse at 50% 30%, black, transparent 75%)",
        }}
      />
      {/* Noise/grain overlay */}
      <div
        className="absolute inset-0 opacity-[0.012]"
        style={{
          backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='1'/%3E%3C/svg%3E\")",
          backgroundSize: "256px 256px",
          animation: "grain 0.5s steps(3) infinite",
        }}
      />
      {/* Cinematic vignette */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 55% 45% at 50% 50%, transparent 25%, rgba(2,3,8,0.4) 65%, rgba(2,3,8,0.7) 100%)",
        }}
      />
    </div>
  );
}
