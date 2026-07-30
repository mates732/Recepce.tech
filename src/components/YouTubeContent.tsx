"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import type { Locale } from "@/lib/types";
import { SOCIALS } from "@/config/socials";

interface Props {
  locale: Locale;
  channelUrl: string;
}

const channelId = SOCIALS.youtubeChannelId;

export default function YouTubeContent({ locale, channelUrl }: Props) {
  const [videos, setVideos] = useState<{ id: string; title: string; thumbnail: string; url: string; published: string }[]>([]);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch(`/api/youtube/feed?channelId=${channelId}`);
        if (res.ok) {
          const data = await res.json();
          if (data.videos) setVideos(data.videos);
        }
      } catch {}
    }
    fetchData();
  }, []);

  const featured = videos[0];
  const archive = videos.slice(1);

  // Format date
  const fmtDate = (d: string) => {
    try { return new Date(d).toLocaleDateString(locale === "cs" ? "cs-CZ" : "en-US", { year: "numeric", month: "short", day: "numeric" }); }
    catch { return ""; }
  };

  // Estimate duration from title (just a placeholder — real duration would need API)
  const estDuration = "18:42";

  return (
    <div className="relative" style={{ background: "#F7F8FA" }}>
      {/* ─── HERO ─── */}
      <section className="relative flex flex-col justify-center" style={{ minHeight: "90vh", padding: "clamp(80px, 10vw, 120px) clamp(24px, 5vw, 80px)" }}>
        <div className="max-w-5xl mx-auto w-full">
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4 }}
            className="text-xs font-mono font-semibold tracking-widest uppercase"
            style={{ color: "rgba(17,17,17,0.15)" }}
          >
            YOUTUBE
          </motion.span>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            className="font-heading leading-tight mt-6 sm:mt-8"
            style={{ fontSize: "clamp(36px, 6vw, 80px)", letterSpacing: "-0.04em", color: "#111111", maxWidth: "14ch" }}
          >
            {locale === "cs" ? "Stav\u00edm AI syst\u00e9my. Ve\u0159ejn\u011b." : "Building AI in public."}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="font-body mt-4 leading-relaxed"
            style={{ fontSize: "clamp(14px, 1.1vw, 16px)", color: "#5F6368", maxWidth: "45ch" }}
          >
            {locale === "cs"
              ? "Ka\u017ed\u00fd produkt, experiment a launch je zdokumentovan\u00fd na YouTube. \u017e\u00e1dn\u00e9 st\u0159\u00edh\u00e1n\u00ed reality. Jen skute\u010dn\u00fd v\u00fdvoj."
              : "Every product, experiment and launch is documented on YouTube. No reality cutting. Just real development."}
          </motion.p>
        </div>
      </section>

      {/* ─── FEATURED FILM ─── */}
      {featured && (
        <section className="relative" style={{ padding: "0 clamp(24px, 5vw, 80px) clamp(80px, 10vw, 120px)" }}>
          <div className="max-w-6xl mx-auto">
            <a href={featured.url} target="_blank" rel="noopener noreferrer" className="group block">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                className="relative rounded-2xl overflow-hidden"
                style={{ aspectRatio: "16/9", background: "#111111" }}
              >
                <Image
                  src={featured.thumbnail}
                  alt={featured.title}
                  fill
                  className="object-cover transition-all duration-700 group-hover:scale-[1.02]"
                  sizes="90vw"
                  priority
                />
                <div className="absolute inset-0 transition-opacity duration-700 group-hover:opacity-0" style={{ background: "linear-gradient(180deg, transparent 40%, rgba(0,0,0,0.4) 100%)" }} />
              </motion.div>
            </a>

            <motion.div
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.15, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className="mt-6 sm:mt-8 flex flex-col sm:flex-row sm:items-end gap-4 sm:gap-8"
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 mb-2">
                  <span className="font-mono text-[10px] font-semibold tracking-widest uppercase" style={{ color: "rgba(17,17,17,0.25)" }}>EP. 01</span>
                  <span className="w-px h-3" style={{ background: "rgba(17,17,17,0.06)" }} />
                  <span className="font-mono text-[10px]" style={{ color: "rgba(17,17,17,0.2)" }}>{estDuration}</span>
                  <span className="w-px h-3" style={{ background: "rgba(17,17,17,0.06)" }} />
                  <span className="font-mono text-[10px]" style={{ color: "rgba(17,17,17,0.2)" }}>{fmtDate(featured.published)}</span>
                </div>
                <h2 className="font-heading leading-tight" style={{ fontSize: "clamp(20px, 2.2vw, 32px)", letterSpacing: "-0.02em", color: "#111111" }}>
                  {featured.title}
                </h2>
              </div>
              <a
                href={featured.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center gap-2 flex-shrink-0 transition-all duration-300"
                style={{ color: "#111111" }}
              >
                <span className="font-heading text-sm" style={{ letterSpacing: "-0.01em" }}>
                  {locale === "cs" ? "Otev\u0159\u00edt na YouTube" : "Open on YouTube"}
                </span>
                <span className="inline-block transition-transform duration-300 group-hover:translate-x-[3px]" style={{ fontSize: 16 }}>&rarr;</span>
              </a>
            </motion.div>
          </div>
        </section>
      )}

      {/* ─── FILM ARCHIVE ─── */}
      <section className="relative" style={{ padding: "clamp(80px, 10vw, 120px) clamp(24px, 5vw, 80px)" }}>
        <div className="max-w-4xl mx-auto">
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-xs font-mono font-semibold tracking-widest uppercase mb-8 sm:mb-10"
            style={{ color: "#9CA3AF" }}
          >
            {locale === "cs" ? "Filmov\u00fd archiv" : "Film Archive"}
          </motion.p>

          <div className="space-y-0">
            {archive.map((video, i) => {
              const isHovered = hoveredIndex === i;
              return (
                <div key={video.id}>
                  <a
                    href={video.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group block relative"
                    onMouseEnter={() => setHoveredIndex(i)}
                    onMouseLeave={() => setHoveredIndex(null)}
                  >
                    <div className="relative z-10 flex items-center gap-4 sm:gap-6 py-4 sm:py-5 transition-all duration-500">
                      <span
                        className="font-heading flex-shrink-0 leading-none transition-all duration-500"
                        style={{
                          fontSize: isHovered ? "clamp(20px, 2.2vw, 32px)" : "clamp(14px, 1.2vw, 18px)",
                          fontWeight: 450,
                          letterSpacing: "-0.03em",
                          color: isHovered ? "#111111" : "rgba(17,17,17,0.08)",
                          minWidth: "clamp(32px, 3.5vw, 48px)",
                        }}
                      >
                        {String(i + 2).padStart(3, "0")}
                      </span>
                      <div className="flex-1 min-w-0">
                        <span
                          className="font-heading block leading-tight transition-all duration-500"
                          style={{
                            fontSize: "clamp(15px, 1.4vw, 20px)",
                            fontWeight: isHovered ? 500 : 400,
                            letterSpacing: "-0.02em",
                            color: isHovered ? "#111111" : "rgba(17,17,17,0.45)",
                          }}
                        >
                          {video.title}
                        </span>
                      </div>
                      <span
                        className="font-mono text-xs flex-shrink-0 transition-all duration-500"
                        style={{ color: isHovered ? "rgba(17,17,17,0.4)" : "rgba(17,17,17,0.12)" }}
                      >
                        {estDuration}
                      </span>
                    </div>

                    {/* Hover thumbnail */}
                    <motion.div
                      initial={false}
                      animate={{ opacity: isHovered ? 1 : 0 }}
                      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                      className="absolute right-0 top-1/2 -translate-y-1/2 rounded-xl overflow-hidden pointer-events-none z-0"
                      style={{ width: "clamp(180px, 20vw, 280px)", aspectRatio: "16/9" }}
                    >
                      <Image src={video.thumbnail} alt="" fill className="object-cover" sizes="280px" />
                    </motion.div>
                  </a>
                  {i < archive.length - 1 && (
                    <div className="h-px" style={{ background: "rgba(17,17,17,0.04)" }} />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ─── QUOTE ─── */}
      <section className="relative flex items-center justify-center" style={{ minHeight: "70vh", padding: "clamp(80px, 12vw, 160px) clamp(24px, 5vw, 80px)" }}>
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="text-center max-w-4xl mx-auto"
        >
          <p className="font-heading leading-tight" style={{ fontSize: "clamp(32px, 5vw, 72px)", letterSpacing: "-0.04em", color: "#111111" }}>
            {locale === "cs" ? "Stav\u011bj." : "Build."}
          </p>
          <p className="font-heading leading-tight mt-4" style={{ fontSize: "clamp(32px, 5vw, 72px)", letterSpacing: "-0.04em", color: "rgba(17,17,17,0.15)" }}>
            {locale === "cs" ? "Shipuj." : "Ship."}
          </p>
          <p className="font-heading leading-tight mt-4" style={{ fontSize: "clamp(32px, 5vw, 72px)", letterSpacing: "-0.04em", color: "rgba(17,17,17,0.06)" }}>
            {locale === "cs" ? "Opakuj." : "Repeat."}
          </p>
        </motion.div>
      </section>

      {/* ─── FOOTER CTA ─── */}
      <section className="relative flex items-center justify-center" style={{ minHeight: "50vh", padding: "clamp(80px, 10vw, 120px) clamp(24px, 5vw, 80px)" }}>
        <div className="text-center max-w-2xl mx-auto">
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="font-heading leading-tight"
            style={{ fontSize: "clamp(20px, 2.5vw, 36px)", letterSpacing: "-0.03em", color: "#111111" }}
          >
            {locale === "cs"
              ? "Nov\u00e9 dokumenty vych\u00e1zej\u00ed pravideln\u011b."
              : "New documentaries are published regularly."}
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.12, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="mt-6"
          >
            <a
              href={channelUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center gap-2 px-7 py-3 rounded-full text-sm font-medium transition-all duration-300"
              style={{ color: "#FFFFFF", background: "#111111" }}
              onMouseEnter={(e) => { e.currentTarget.style.opacity = "0.85"; }}
              onMouseLeave={(e) => { e.currentTarget.style.opacity = "1"; }}
            >
              {locale === "cs" ? "Otev\u0159\u00edt YouTube" : "Open YouTube"}
              <span className="inline-block transition-transform duration-300 group-hover:translate-x-[3px]">&rarr;</span>
            </a>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
