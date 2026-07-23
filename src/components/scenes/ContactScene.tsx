"use client";

import type { Locale } from "@/lib/types";
import { t } from "@/lib/utils";
import { colors, typography, duration, ease } from "@/design/tokens";
import type { RefObject } from "react";

interface Props {
  locale: Locale;
  containerRef: RefObject<HTMLDivElement | null>;
  badgeRef: RefObject<HTMLParagraphElement | null>;
  titleRef: RefObject<HTMLHeadingElement | null>;
  subtitleRef: RefObject<HTMLParagraphElement | null>;
  ctaRef: RefObject<HTMLAnchorElement | null>;
}

export default function ContactScene({
  locale,
  containerRef,
  badgeRef,
  titleRef,
  subtitleRef,
  ctaRef,
}: Props) {
  return (
    <div
      ref={containerRef}
      className="absolute inset-0 flex flex-col items-center justify-center text-center"
      style={{
        zIndex: 2,
        opacity: 0,
        willChange: "opacity",
        pointerEvents: "none",
        padding: "clamp(32px, 6vw, 80px)",
      }}
    >
      {/* Hidden badge ref — kept for animation compatibility */}
      <p
        ref={badgeRef}
        style={{ fontSize: "12px", opacity: 0, position: "absolute" }}
        aria-hidden="true"
      />

      <h2
        ref={titleRef}
        className="font-heading"
        style={{
          fontSize: "clamp(48px, 10vw, 120px)",
          lineHeight: "1.0",
          letterSpacing: typography.letterSpacing.tight,
          fontWeight: typography.weight.medium,
          marginBottom: "clamp(16px, 2.5vh, 28px)",
          opacity: 0,
          willChange: "opacity, transform, filter",
        }}
      >
        {t(locale, "contact.title")}
      </h2>

      <p
        ref={subtitleRef}
        className="font-body"
        style={{
          fontSize: typography.size.bodyLg,
          color: colors.secondary,
          maxWidth: "40ch",
          lineHeight: typography.lineHeight.relaxed,
          marginBottom: "clamp(32px, 5vh, 52px)",
          opacity: 0,
          willChange: "opacity, transform, filter",
        }}
      >
        {t(locale, "contact.subtitle")}
      </p>

      <a
        ref={ctaRef}
        href={`/${locale}/contact`}
        className="font-body"
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: "8px",
          padding: "16px 44px",
          background: colors.primary,
          color: colors.bg,
          borderRadius: "9999px",
          fontSize: typography.size.body,
          fontWeight: typography.weight.medium,
          letterSpacing: typography.letterSpacing.normal,
          textDecoration: "none",
          cursor: "pointer",
          transition: `transform ${duration.normal} ${ease.default}, box-shadow ${duration.normal} ${ease.default}`,
          opacity: 0,
          willChange: "opacity, transform, filter",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = "scale(1.04)";
          e.currentTarget.style.boxShadow = "0 0 40px rgba(250,250,250,0.08)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = "scale(1)";
          e.currentTarget.style.boxShadow = "none";
        }}
      >
        {t(locale, "nav.contact")}
      </a>
    </div>
  );
}
