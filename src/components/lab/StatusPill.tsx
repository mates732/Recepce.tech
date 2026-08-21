"use client";

import type { Locale } from "@/lib/types";

const STATUS_COLORS: Record<string, string> = {
  Production: "#34D399",
  Beta: "#FF6B3D",
  Testing: "#FBBF24",
  Experiment: "#9AA1AB",
  Prototype: "#FF4A2E",
  Research: "#9AA1AB",
  Building: "#F472B6",
};

const STATUS_LABELS_CS: Record<string, string> = {
  Production: "V provozu",
  Beta: "Beta",
  Testing: "Testování",
  Experiment: "Experiment",
  Prototype: "Prototyp",
  Research: "Výzkum",
  Building: "Ve vývoji",
};

export default function StatusPill({ status, locale }: { status: string; locale: Locale }) {
  const color = STATUS_COLORS[status] ?? "#9AA1AB";
  const label = locale === "cs" ? (STATUS_LABELS_CS[status] ?? status) : status;
  return (
    <span
      className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 font-mono text-label-sm font-semibold uppercase tracking-[0.12em] whitespace-nowrap"
      style={{
        color,
        background: `${color}1A`,
        border: `1px solid ${color}40`,
      }}
    >
      <span
        aria-hidden="true"
        className="inline-block w-1.5 h-1.5 rounded-full"
        style={{ background: color, animation: "pulse-dot 2.4s ease-in-out infinite" }}
      />
      {label}
    </span>
  );
}