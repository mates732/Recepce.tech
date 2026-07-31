"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import type { Locale } from "@/lib/types";
import { SOCIALS } from "@/config/socials";

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
  const [videos, setVideos] = useState<
    { id: string; title: string; thumbnail: string; url: string; published: string }[]
  >([]);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  useEffect(() => {
    if (!channelId) return;
    let cancelled = false;
    async function fetchData() {
      try {
        const res = await fetch(`/api/youtube/feed?channelId=${channelId}`);
        if (!res.ok || cancelled) return;
        const data = await res.json();
        if (data.videos) setVideos(data.videos);
      } catch {}
    }
    fetchData();
    return () => {
      cancelled = true;
    };
  }, [channelId]);

  return (
    <div style={{ background: "#F7F8FA" }}>
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
                fontSize: "clamp(32px, 4vw, 56px)",
                letterSpacing: "-0.03em",
                color: "#111111",
              }}
            >
              YouTube
            </h1>
            <p
              className="font-body mt-3 leading-relaxed"
              style={{
                fontSize: "clamp(15px, 1.2vw, 18px)",
                color: "#5F6368",
                maxWidth: "55ch",
              }}
            >
              {locale === "cs"
                ? "Ka\u017ed\u00fd produkt, experiment i launch dokumentuji ve\u0159ejn\u011b. Bez p\u0159ikr\u00e1\u0161lov\u00e1n\u00ed. Jen skute\u010dn\u00fd v\u00fdvoj."
                : "Every product, experiment and launch is documented in public. No embellishment. Just real development."}
            </p>
          </div>

          {/* ─── VIDEO LIST ─── */}
          <div className="mb-6">
            <span
              className="font-mono text-[10px] font-semibold tracking-[0.15em] uppercase"
              style={{ color: "#9CA3AF" }}
            >
              {locale === "cs" ? "Nejnov\u011bj\u0161\u00ed videa" : "Latest Videos"}
            </span>
          </div>

          <div>
            {videos.map((video, i) => {
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
                        fontWeight: 450,
                        letterSpacing: "-0.03em",
                        color: isHovered ? "#111111" : "rgba(17,17,17,0.12)",
                        minWidth: "clamp(28px, 2.5vw, 36px)",
                      }}
                    >
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span
                      className="font-body flex-1 min-w-0 break-words leading-snug transition-all duration-500"
                      style={{
                        fontSize: "clamp(15px, 1.2vw, 17px)",
                        fontWeight: isHovered ? 500 : 400,
                        color: isHovered ? "#111111" : "rgba(17,17,17,0.55)",
                      }}
                    >
                      {video.title}
                    </span>
                    <span
                      className="font-mono hidden flex-shrink-0 text-xs sm:block"
                      style={{ color: "rgba(17,17,17,0.2)" }}
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
                    <div className="h-px" style={{ background: "rgba(17,17,17,0.04)" }} />
                  )}
                </div>
              );
            })}
          </div>

          {/* ─── FOOTER CTA ─── */}
          <div
            className="mt-16 sm:mt-20 pt-8 sm:pt-10 text-center"
            style={{ borderTop: "1px solid rgba(17,17,17,0.06)" }}
          >
            <p
              className="font-body mb-5"
              style={{ fontSize: "clamp(14px, 1vw, 16px)", color: "rgba(17,17,17,0.5)" }}
            >
              {locale === "cs"
                ? "Nov\u00e1 videa p\u0159ib\u00fdvaj\u00ed pravideln\u011b."
                : "New videos are added regularly."}
            </p>
            <a
              href={channelUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center gap-2 rounded-full px-6 py-2.5 text-sm font-medium transition-all duration-300"
              style={{ color: "#FFFFFF", background: "#111111" }}
              onMouseEnter={(e) => {
                e.currentTarget.style.opacity = "0.85";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.opacity = "1";
              }}
            >
              {locale === "cs" ? "Otev\u0159\u00edt YouTube" : "Open YouTube"}
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
