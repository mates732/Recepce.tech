"use client";

import { useRef } from "react";
import Link from "next/link";
import { motion, useTransform, useReducedMotion } from "framer-motion";
import { useParallax, useElementScrollProgress, OFFSET_TOP_OUT } from "@/lib/scroll";
import type { Locale } from "@/lib/types";
import { getPage } from "@/content/repository";
import type { AboutPageData } from "@/content/types";

interface Props {
  locale: Locale;
}

export default function AboutContent({ locale }: Props) {
  const shouldReduceMotion = useReducedMotion();
  const data = getPage("about")?.data;

  return (
    <div className="relative">
      <StatementSection locale={locale} shouldReduceMotion={!!shouldReduceMotion} data={data} />
      <WorksSection locale={locale} shouldReduceMotion={!!shouldReduceMotion} data={data} />
      <PersonalSection locale={locale} shouldReduceMotion={!!shouldReduceMotion} data={data} />
      <PrinciplesSection locale={locale} shouldReduceMotion={!!shouldReduceMotion} data={data} />
      <ProductMapSection locale={locale} shouldReduceMotion={!!shouldReduceMotion} data={data} />
    </div>
  );
}

/* ─── Section 1: Statement ─── */

function StatementSection({ locale, shouldReduceMotion, data }: { locale: Locale; shouldReduceMotion: boolean; data?: AboutPageData }) {
  const sectionRef = useRef<HTMLElement>(null);
  const progress = useElementScrollProgress(sectionRef, OFFSET_TOP_OUT);
  const y = useTransform(progress, [0, 1], [0, 32]);
  const opacity = useTransform(progress, [0, 0.7], [1, 0]);

  return (
    <section ref={sectionRef} className="relative flex flex-col items-center justify-center" style={{ minHeight: "100dvh", padding: "clamp(120px, 15vw, 180px) clamp(24px, 5vw, 80px)" }}>
      <motion.div style={{ y: shouldReduceMotion ? 0 : y, opacity: shouldReduceMotion ? 1 : opacity }} className="relative z-10 flex flex-col items-center text-center max-w-5xl mx-auto">
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="font-heading font-medium leading-none tracking-tight"
          style={{ fontSize: "var(--text-display)", letterSpacing: "-0.04em", color: "#F4F6F8" }}
        >
          {data?.statement.title[locale]}
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="font-heading font-medium mt-6"
          style={{ fontSize: "var(--text-h2)", letterSpacing: "-0.02em", color: "#9AA1AB" }}
        >
          {data?.statement.subtitle[locale]}
        </motion.p>
      </motion.div>
    </section>
  );
}

/* ─── Section 2: What I Do ─── */

function WorksSection({ locale, shouldReduceMotion, data }: { locale: Locale; shouldReduceMotion: boolean; data?: AboutPageData }) {
  const sectionRef = useRef<HTMLElement>(null);
  const y = useParallax(sectionRef, 30, -30);

  const items = (data?.works.items ?? []).map((item) => item[locale]);

  return (
    <section ref={sectionRef} className="relative" style={{ padding: "clamp(120px, 16vw, 200px) clamp(24px, 5vw, 80px)" }}>
      <div className="max-w-5xl mx-auto">
        {items.map((text, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.6, delay: i * 0.05, ease: [0.16, 1, 0.3, 1] }}
            className="flex items-start gap-6 sm:gap-12 pb-8 sm:pb-10 last:pb-0"
          >
            <span className="font-heading font-medium leading-none tracking-tight flex-shrink-0" style={{ fontSize: "var(--text-h1)", color: "rgba(255,255,255,0.06)" }}>
              {String(i + 1).padStart(2, "0")}
            </span>
            <div>
              <p className="font-heading font-medium leading-tight" style={{ fontSize: "var(--text-h2-lg)", letterSpacing: "-0.03em", color: "#F4F6F8" }}>
                {text}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

/* ─── Section 3: Personal ─── */

function PersonalSection({ locale, shouldReduceMotion, data }: { locale: Locale; shouldReduceMotion: boolean; data?: AboutPageData }) {
  const sectionRef = useRef<HTMLElement>(null);
  const y = useParallax(sectionRef, 30, -30);

  return (
    <section ref={sectionRef} className="relative" style={{ padding: "clamp(120px, 16vw, 200px) clamp(24px, 5vw, 80px)" }}>
      <motion.div style={{ y }} className="max-w-5xl mx-auto">
        <motion.span
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-xs font-mono font-semibold tracking-widest uppercase"
          style={{ color: "#6E7683" }}
        >
          {data?.personal.label[locale]}
        </motion.span>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1, duration: 0.6 }}
          className="font-heading font-medium leading-tight mt-8"
          style={{ fontSize: "var(--text-h1-md)", letterSpacing: "-0.03em", color: "#F4F6F8" }}
        >
          {data?.personal.title[locale]}
        </motion.p>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="font-heading font-medium mt-6 leading-relaxed"
          style={{ fontSize: "var(--text-h4)", color: "#9AA1AB", maxWidth: "40ch" }}
        >
          {data?.personal.text[locale]}
        </motion.p>
      </motion.div>
    </section>
  );
}

/* ─── Section 4: Principles ─── */

function PrinciplesSection({ locale, shouldReduceMotion, data }: { locale: Locale; shouldReduceMotion: boolean; data?: AboutPageData }) {
  const sectionRef = useRef<HTMLElement>(null);
  const y = useParallax(sectionRef, 30, -30);

  const principles = (data?.principles.items ?? []).map((p) => p[locale]);

  return (
    <section ref={sectionRef} className="relative" style={{ padding: "clamp(100px, 14vw, 180px) clamp(24px, 5vw, 80px)" }}>
      <motion.div style={{ y }} className="max-w-5xl mx-auto">
        <motion.span
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-xs font-mono font-semibold tracking-widest uppercase"
          style={{ color: "#6E7683" }}
        >
          {data?.principles.label[locale]}
        </motion.span>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-10">
          {principles.map((p, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-30px" }}
              transition={{ duration: 0.4, delay: i * 0.05 }}
              className="p-6 rounded-2xl transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5"
              style={{ background: "#0A0A0B", border: "1px solid rgba(255,255,255,0.04)" }}
            >
              <span className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold mb-3" style={{ background: "#F4F6F8", color: "#0A0A0B" }}>
                {i + 1}
              </span>
              <p className="font-heading font-medium text-sm" style={{ color: "#F4F6F8" }}>{p}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}

/* ─── Section 5: Current Focus / Projects ─── */

function ProductMapSection({ locale, shouldReduceMotion, data }: { locale: Locale; shouldReduceMotion: boolean; data?: AboutPageData }) {
  const sectionRef = useRef<HTMLElement>(null);
  const y = useParallax(sectionRef, 30, -30);

  const brand = data?.brand;
  const products = data?.products ?? [];

  return (
    <section ref={sectionRef} className="relative" style={{ padding: "clamp(100px, 14vw, 180px) clamp(24px, 5vw, 80px)" }}>
      <motion.div style={{ y }} className="max-w-5xl mx-auto">
        {/* Brand card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          {brand && (
            <Link href={`/${locale}/`} className="block no-underline group">
              <div className="p-8 sm:p-10 rounded-2xl transition-all duration-300 group-hover:shadow-xl" style={{ background: "#F4F6F8" }}>
                <span className="text-xs font-mono font-semibold tracking-widest uppercase" style={{ color: "rgba(0,0,0,0.45)" }}>
                  {brand.label[locale]}
                </span>
                <h2 className="font-heading font-medium mt-3" style={{ fontSize: "var(--text-h1-md)", letterSpacing: "-0.03em", color: "#0A0A0B" }}>
                  {brand.title}
                </h2>
                <p className="font-body text-sm mt-2 leading-relaxed" style={{ color: "rgba(0,0,0,0.6)" }}>
                  {brand.desc[locale]}
                </p>
                <span className="inline-flex items-center gap-2 text-xs font-medium mt-4 transition-all duration-300 group-hover:gap-3" style={{ color: "rgba(0,0,0,0.55)" }}>
                  {brand.explore[locale]} <span style={{ fontSize: 10 }}>→</span>
                </span>
              </div>
            </Link>
          )}
        </motion.div>

        {/* Divider */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="flex flex-col items-center py-8"
        >
          <div className="w-px h-8" style={{ background: "rgba(255,255,255,0.15)" }} />
        </motion.div>

        {/* Product cards */}
        <div className="space-y-4">
          {products.map((p, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-30px" }}
              transition={{ duration: 0.4, delay: 0.1 + i * 0.06 }}
            >
              <Link href={`/${locale}${p.href}`} className="block no-underline group">
                <div className="p-6 sm:p-8 rounded-2xl transition-all duration-300 group-hover:shadow-lg group-hover:-translate-y-0.5" style={{ background: "#0A0A0B", border: "1px solid rgba(255,255,255,0.04)" }}>
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className="font-heading font-medium" style={{ fontSize: "var(--text-h4)", letterSpacing: "-0.02em", color: "#F4F6F8" }}>
                        {p.title}
                      </h3>
                      <p className="font-body text-sm mt-1.5 leading-relaxed" style={{ color: "#9AA1AB" }}>
                        {p.desc[locale]}
                      </p>
                    </div>
                    <span className="flex-shrink-0 transition-all duration-300 group-hover:translate-x-1" style={{ color: "#9AA1AB", fontSize: 16 }}>→</span>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
