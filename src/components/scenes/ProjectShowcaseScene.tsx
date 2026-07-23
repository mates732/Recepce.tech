"use client";

import { colors, typography } from "@/design/tokens";
import SafariFrame from "@/components/SafariFrame";
import DashboardFrame from "@/components/DashboardFrame";
import ConversationFrame from "@/components/ConversationFrame";
import type { RefObject } from "react";
import type { MockupType } from "@/data/showcaseProjects";

interface Props {
  url: string;
  title: string;
  description: string;
  features: string;
  previewLabel: string;
  accent: string;
  titleScale: number;
  mockupType: MockupType;
  microProgress?: number;
  containerRef: RefObject<HTMLDivElement | null>;
  frameRef: RefObject<HTMLDivElement | null>;
  titleRef: RefObject<HTMLHeadingElement | null>;
  descRef: RefObject<HTMLParagraphElement | null>;
  featuresRef: RefObject<HTMLParagraphElement | null>;
}

export default function ProjectShowcaseScene({
  url,
  title,
  description,
  features,
  previewLabel,
  accent,
  titleScale,
  mockupType,
  microProgress = 0,
  containerRef,
  frameRef,
  titleRef,
  descRef,
  featuresRef,
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
        gap: 0,
      }}
    >
      {/* ── Title ───────────────────────────────────────────────────── */}
      <h2
        ref={titleRef}
        className="font-heading text-center"
        style={{
          fontSize: `clamp(${30 * titleScale}px, ${4.8 * titleScale}vw, ${56 * titleScale}px)`,
          lineHeight: "1.05",
          letterSpacing: typography.letterSpacing.tight,
          fontWeight: typography.weight.medium,
          color: colors.primary,
          marginBottom: "clamp(10px, 1.5vh, 18px)",
          opacity: 0,
          willChange: "opacity, transform, filter",
        }}
      >
        {title}
      </h2>

      {/* ── Description ─────────────────────────────────────────────── */}
      <p
        ref={descRef}
        className="font-body text-center"
        style={{
          fontSize: typography.size.bodyLg,
          lineHeight: typography.lineHeight.relaxed,
          letterSpacing: typography.letterSpacing.normal,
          color: colors.secondary,
          maxWidth: "42ch",
          marginBottom: "clamp(28px, 4vh, 52px)",
          opacity: 0,
          willChange: "opacity, transform, filter",
        }}
      >
        {description}
      </p>

      {/* ── Preview — THE VISUAL HERO ─────────────────────────────── */}
      <div
        ref={frameRef}
        style={{
          width: "100%",
          maxWidth: "1100px",
          opacity: 0,
          willChange: "opacity, transform, filter",
        }}
      >
        {mockupType === "dashboard" && <DashboardFrame accent={accent} microProgress={microProgress} />}
        {mockupType === "conversation" && <ConversationFrame accent={accent} />}
        {mockupType === "browser" && (
          <SafariFrame url={url}>
            <div
              style={{
                width: "100%",
                height: "100%",
                background: `linear-gradient(135deg, #0a0a0a 0%, ${accent} 50%, #111111 100%)`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <span
                className="font-heading"
                style={{
                  fontSize: "clamp(28px, 4vw, 52px)",
                  fontWeight: typography.weight.medium,
                  color: colors.primary,
                  letterSpacing: typography.letterSpacing.tight,
                  opacity: 0.10,
                }}
              >
                {previewLabel}
              </span>
            </div>
          </SafariFrame>
        )}
      </div>

      {/* ── Capabilities ────────────────────────────────────────────── */}
      <p
        ref={featuresRef}
        className="font-body text-center"
        style={{
          fontSize: typography.size.bodySm,
          color: colors.muted,
          letterSpacing: typography.letterSpacing.wide,
          maxWidth: "56ch",
          marginTop: "clamp(24px, 3.5vh, 44px)",
          lineHeight: typography.lineHeight.relaxed,
          opacity: 0,
          willChange: "opacity, transform, filter",
        }}
      >
        {features}
      </p>
    </div>
  );
}
