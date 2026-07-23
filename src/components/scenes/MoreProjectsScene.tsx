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
}

export default function MoreProjectsScene({
  locale,
  containerRef,
  headingRef,
  subtitleRef,
}: Props) {
  return (
    <div
      ref={containerRef}
      className="absolute inset-0 flex flex-col items-center justify-center"
      style={{
        zIndex: 2,
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
          fontSize: "clamp(22px, 3.2vw, 38px)",
          lineHeight: "1.1",
          letterSpacing: typography.letterSpacing.tight,
          fontWeight: typography.weight.regular,
          color: colors.secondary,
          marginBottom: "clamp(10px, 1.5vh, 18px)",
          opacity: 0,
          willChange: "opacity, transform, filter",
        }}
      >
        {t(locale, "more.heading")}
      </h2>

      <p
        ref={subtitleRef}
        className="font-body text-center"
        style={{
          fontSize: typography.size.bodySm,
          color: colors.muted,
          lineHeight: typography.lineHeight.relaxed,
          letterSpacing: typography.letterSpacing.wide,
          opacity: 0,
          willChange: "opacity, transform, filter",
        }}
      >
        {t(locale, "more.subtitle")}
      </p>
    </div>
  );
}
