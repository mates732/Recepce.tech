"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import type { Locale } from "@/lib/types";
import { t } from "@/lib/utils";
import type { YoutubeVideo } from "@/services/youtube";
import { SOCIALS } from "@/config/socials";
import { getPage } from "@/content/repository";
import StateNotice from "@/components/StateNotice";

interface Props {
  locale: Locale;
  channelUrl: string;
}

const channelId = SOCIALS.youtubeChannelId;

function fmtDate(d: string, locale: Locale) {
  try {
    return new Date(d).toLocaleDateString(
      locale === "cs" ? "cs-CZ" : "en-US",
      { year: "numeric", month: "short", day: "numeric" },
    );
  } catch {
    return "";
  }
}

export default function YouTubeContent({ locale, channelUrl }: Props) {
  const page = getPage("youtube");
  const [videos, setVideos] = useState<YoutubeVideo[]>([]);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [feedStatus, setFeedStatus] = useState<"loading" | "ready" | "error">(
    channelId ? "loading" : "ready"
  );
  const [retryKey, setRetryKey] = useState(0);

  useEffect(() => {
    if (!channelId) return;
    let cancelled = false;
    setFeedStatus("loading");
    async function fetchData() {
      try {
        const res = await fetch(`/api/youtube/feed?channelId=${channelId}`);
        if (cancelled) return;
        if (!res.ok) {
          setFeedStatus("error");
          return;
        }
        const data = await res.json();
        if (cancelled) return;
        if (Array.isArray(data.videos)) setVideos(data.videos);
        setFeedStatus("ready");
      } catch {
        if (!cancelled) setFeedStatus("error");
      }
    }
    fetchData();
    return () => {
      cancelled = true;
    };
  }, [channelId, retryKey]);

  return (
    <div style={{ background: "#0A0A0B" }}>
      <div
        style={{
          padding:
            "clamp(48px, 6vw, 80px) clamp(24px, 5vw, 80px) clamp(80px, 10vw, 120px)",
        }}
      >
        <div className="mx-auto" style={{ maxWidth: "960px" }}>
          {/* ─── INTRO ─── */}
          <div className="mb-12 sm:mb-16">
            <h1
              className="font-heading leading-tight"
              style={{
                fontSize: "var(--text-h1-md)",
                letterSpacing: "-0.03em",
                color: "#F4F6F8",
              }}
            >
              {page?.data.title[locale]}
            </h1>
            <p
              className="font-body mt-3 leading-relaxed"
              style={{
                fontSize: "var(--text-lead)",
                color: "#9AA1AB",
                maxWidth: "55ch",
              }}
            >
              {page?.data.subtitle[locale]}
            </p>
          </div>

          {/* ─── VIDEO LIST ─── */}
          <div className="mb-6">
            <span
              className="font-mono text-label font-semibold tracking-[0.15em] uppercase"
              style={{ color: "#6E7683" }}
            >
              {page?.data.latestLabel[locale]}
            </span>
          </div>

          <div>
            {feedStatus === "error" && (
              <StateNotice
                variant="error"
                message={t(locale, "ui.videosFailed")}
                actionLabel={t(locale, "ui.retry")}
                onAction={() => setRetryKey((k) => k + 1)}
              />
            )}
            {feedStatus === "ready" && videos.length === 0 && (
              <StateNotice
                variant="empty"
                message={t(locale, "ui.emptyVideos")}
                actionLabel={t(locale, "ui.retry")}
                onAction={() => setRetryKey((k) => k + 1)}
              />
            )}
            {feedStatus === "loading" && (
              <div aria-busy="true" aria-label={t(locale, "ui.loading")}>
                {[0, 1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="flex items-center gap-4 sm:gap-5 py-3 sm:py-4"
                  >
                    <div
                      className="flex-shrink-0 rounded-full"
                      style={{
                        width: "clamp(28px, 2.5vw, 36px)",
                        height: "clamp(13px, 1vw, 15px)",
                        background: "rgba(255,255,255,0.07)",
                        animation: `skeleton-pulse 1.6s ease-in-out infinite ${i * 0.1}s`,
                      }}
                    />
                    <div
                      className="flex-1 rounded-full"
                      style={{
                        height: "clamp(13px, 1vw, 15px)",
                        maxWidth: `${85 - i * 7}%`,
                        background: "rgba(255,255,255,0.07)",
                        animation: `skeleton-pulse 1.6s ease-in-out infinite ${i * 0.1}s`,
                      }}
                    />
                  </div>
                ))}
              </div>
            )}
            {feedStatus === "ready" && videos.map((video, i) => {
              const isHovered = hoveredIndex === i;
              return (
                <div key={video.id} className="relative">
                  <a
                    href={video.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group relative z-10 flex items-center gap-4 py-3 sm:gap-5 sm:py-4 no-underline"
                    onMouseEnter={() => setHoveredIndex(i)}
                    onMouseLeave={() => setHoveredIndex(null)}
                  >
                    <span
                      className="font-heading flex-shrink-0 leading-none transition-all duration-500"
                      style={{
                        fontSize: isHovered ? "clamp(18px, 1.8vw, 28px)" : "clamp(13px, 1vw, 15px)",
                        fontWeight: 500,
                        letterSpacing: "-0.03em",
                        color: isHovered ? "#F4F6F8" : "rgba(255,255,255,0.12)",
                        minWidth: "clamp(28px, 2.5vw, 36px)",
                      }}
                    >
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span
                      className="font-body flex-1 min-w-0 break-words leading-snug transition-all duration-500"
                      style={{
                        fontSize: "var(--text-body)",
                        fontWeight: isHovered ? 500 : 400,
                        color: isHovered ? "#F4F6F8" : "rgba(255,255,255,0.55)",
                      }}
                    >
                      {video.title}
                    </span>
                    <span
                      className="font-mono hidden flex-shrink-0 text-xs sm:block"
                      style={{ color: "rgba(255,255,255,0.2)" }}
                    >
                      {fmtDate(video.published, locale)}
                    </span>
                  </a>

                  {/* Hover thumbnail */}
                  <motion.div
                    initial={false}
                    animate={{ opacity: isHovered ? 1 : 0 }}
                    transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                    className="pointer-events-none absolute right-0 top-1/2 z-0 -translate-y-1/2 overflow-hidden rounded-xl"
                    style={{ width: "clamp(160px, 18vw, 260px)", aspectRatio: "16/9" }}
                  >
                    <Image
                      src={video.thumbnail}
                      alt={video.title}
                      fill
                      className="object-cover"
                      sizes="260px"
                    />
                  </motion.div>

                  {i < videos.length - 1 && (
                    <div className="h-px" style={{ background: "rgba(255,255,255,0.04)" }} />
                  )}
                </div>
              );
            })}
          </div>

          {/* ─── FOOTER CTA ─── */}
          <div
            className="mt-16 sm:mt-20 pt-8 sm:pt-10 text-center"
            style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}
          >
            <p
              className="font-body mb-5"
              style={{ fontSize: "var(--text-body)", color: "rgba(255,255,255,0.5)" }}
            >
              {page?.data.footerText[locale]}
            </p>
            <a
              href={channelUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center gap-2 rounded-full px-6 py-2.5 text-sm font-medium transition-all duration-300"
              style={{ color: "#0A0A0B", background: "var(--color-accent)" }}
              onMouseEnter={(e) => {
                e.currentTarget.style.opacity = "0.85";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.opacity = "1";
              }}
            >
              {page?.data.cta[locale]}
              <span className="inline-block transition-transform duration-300 group-hover:translate-x-[3px]">
                &rarr;
              </span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
