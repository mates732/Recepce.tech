"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import type { Locale } from "@/lib/types";

interface ProjectCardProps {
  locale: Locale;
  name: string;
  desc: string;
  poster: string;
  href: string;
  external?: boolean;
  badge?: string;
  index?: number;
}

export default function ProjectCard({
  locale,
  name,
  desc,
  poster,
  href,
  external,
  badge,
  index = 0,
}: ProjectCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.5, delay: index * 0.06, ease: [0.16, 1, 0.3, 1] }}
      className="h-full"
    >
      <Link
        href={external ? href : `/${locale}${href}`}
        target={external ? "_blank" : undefined}
        rel={external ? "noopener noreferrer" : undefined}
        className="group block no-underline h-full"
      >
        <div
          className="relative h-full rounded-2xl overflow-hidden transition-all duration-500 group-hover:-translate-y-1"
          style={{
            background: "#121316",
            border: "1px solid rgba(255,255,255,0.06)",
            boxShadow: "0 2px 12px rgba(255,255,255,0.04)",
          }}
        >
          <div className="relative aspect-[3/4] overflow-hidden" style={{ background: "#1B1D22" }}>
            <Image
              src={poster}
              alt={name}
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            />
            {badge && (
              <span
                className="absolute top-3 left-3 rounded-full px-2.5 py-1 font-mono text-label-sm font-semibold uppercase tracking-[0.12em]"
                style={{
                  background: "rgba(255,255,255,0.9)",
                  color: "#9AA1AB",
                  border: "1px solid rgba(255,255,255,0.08)",
                }}
              >
                {badge}
              </span>
            )}
          </div>
          <div
            className="px-4 py-3.5 sm:px-5 sm:py-4 flex items-start justify-between gap-3"
            style={{ background: "#121316", borderTop: "1px solid rgba(255,255,255,0.04)" }}
          >
            <div className="min-w-0">
              <p
                className="font-heading text-sm sm:text-base"
                style={{ color: "#F4F6F8", letterSpacing: "-0.01em" }}
              >
                {name}
              </p>
              <p className="font-body text-xs mt-0.5 leading-relaxed" style={{ color: "#9AA1AB" }}>
                {desc}
              </p>
            </div>
            <span
              className="shrink-0 mt-0.5 inline-block transition-transform duration-300 group-hover:translate-x-[3px]"
              style={{ fontSize: "var(--text-body)", color: "rgba(255,255,255,0.20)" }}
              aria-hidden="true"
            >
              &rarr;
            </span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
