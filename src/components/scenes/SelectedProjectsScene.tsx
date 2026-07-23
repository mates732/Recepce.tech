"use client";

import type { Locale } from "@/lib/types";
import { t } from "@/lib/utils";
import { colors, typography } from "@/design/tokens";
import type { RefObject } from "react";

interface Props {
  locale: Locale;
  containerRef: RefObject<HTMLDivElement | null>;
  headingRef: RefObject<HTMLHeadingElement | null>;
  subtitleRef: RefObject<HTMLParagraphElement | null>;
  item0Ref: RefObject<HTMLDivElement | null>;
  item1Ref: RefObject<HTMLDivElement | null>;
  item2Ref: RefObject<HTMLDivElement | null>;
  item3Ref: RefObject<HTMLDivElement | null>;
}

const projects = [
  { nameKey: "selected.cortex.name" as const, descKey: "selected.cortex.desc" as const, num: "01" },
  { nameKey: "selected.recepce.name" as const, descKey: "selected.recepce.desc" as const, num: "02" },
  { nameKey: "selected.zlaty.name" as const, descKey: "selected.zlaty.desc" as const, num: "03" },
  { nameKey: "selected.ponici.name" as const, descKey: "selected.ponici.desc" as const, num: "04" },
];

export default function SelectedProjectsScene({
  locale,
  containerRef,
  headingRef,
  subtitleRef,
  item0Ref,
  item1Ref,
  item2Ref,
  item3Ref,
}: Props) {
  const itemRefs = [item0Ref, item1Ref, item2Ref, item3Ref];

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 flex flex-col items-center justify-center"
      style={{
        zIndex: 3,
        opacity: 0,
        willChange: "opacity",
        pointerEvents: "none",
        padding: "clamp(32px, 6vw, 80px)",
      }}
    >
      <h2
        ref={headingRef}
        className="font-heading text-center"
        style={{
          fontSize: typography.size.h1,
          lineHeight: "1.05",
          letterSpacing: typography.letterSpacing.tight,
          fontWeight: typography.weight.medium,
          color: colors.primary,
          marginBottom: "clamp(10px, 1.5vh, 18px)",
          opacity: 0,
          willChange: "opacity, transform, filter",
        }}
      >
        {t(locale, "selected.heading")}
      </h2>

      <p
        ref={subtitleRef}
        className="font-body text-center"
        style={{
          fontSize: typography.size.body,
          color: colors.secondary,
          lineHeight: typography.lineHeight.relaxed,
          letterSpacing: typography.letterSpacing.wide,
          marginBottom: "clamp(44px, 7vh, 72px)",
          opacity: 0,
          willChange: "opacity, transform, filter",
        }}
      >
        {t(locale, "selected.subtitle")}
      </p>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "clamp(28px, 4vh, 48px)",
          width: "100%",
          maxWidth: "440px",
        }}
      >
        {projects.map((project, i) => (
          <div
            key={project.nameKey}
            ref={itemRefs[i]}
            style={{
              opacity: 0,
              willChange: "opacity, transform, filter",
              display: "flex",
              alignItems: "flex-start",
              gap: "clamp(16px, 2.5vw, 28px)",
            }}
          >
            <span
              className="font-mono"
              style={{
              fontSize: "12px",
              color: colors.muted,
              letterSpacing: typography.letterSpacing.wider,
              marginTop: "3px",
              flexShrink: 0,
              }}
            >
              {project.num}
            </span>
            <div style={{ display: "flex", flexDirection: "column", gap: "3px" }}>
              <span
                className="font-heading"
                style={{
                  fontSize: "clamp(20px, 2.8vw, 28px)",
                  fontWeight: typography.weight.medium,
                  letterSpacing: typography.letterSpacing.snug,
                  color: colors.primary,
                  lineHeight: "1.2",
                }}
              >
                {t(locale, project.nameKey)}
              </span>
              <span
                className="font-body"
                style={{
                  fontSize: typography.size.bodySm,
                  color: colors.muted,
                  letterSpacing: typography.letterSpacing.wide,
                  lineHeight: "1.4",
                }}
              >
                {t(locale, project.descKey)}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
