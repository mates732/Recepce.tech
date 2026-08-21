"use client";

import { useRef, useState, useEffect, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, useTransform, type MotionValue } from "framer-motion";
import { useElementScrollProgress, OFFSET_FULL } from "@/lib/scroll";
import type { Locale } from "@/lib/types";
import { t } from "@/lib/utils";
import { getPage } from "@/content/repository";
import type { CortexPageData } from "@/content/types";
import ProjectFacts from "@/components/ProjectFacts";

interface Props {
  locale: Locale;
}

export default function CortexContent({ locale }: Props) {
  const data = getPage("cortex")?.data;

  return (
    <div className="relative" style={{ background: "#0A0A0B" }}>
      <HeroScene locale={locale} data={data} />
      <FactsScene locale={locale} data={data} />
      <WhyScene locale={locale} data={data} />
      <ChatScene locale={locale} data={data} />
      <ScreenshotWithAnnotationsScene locale={locale} data={data} />
      <ConfidenceScene locale={locale} data={data} />
      <QuoteSplitScene locale={locale} data={data} />
      <EditorialQuoteScene locale={locale} data={data} />
      <CinematicRevealScene locale={locale} data={data} />
      <FinalScene locale={locale} data={data} />
    </div>
  );
}

/* ─── Project Facts ─── */

function FactsScene({ locale, data }: { locale: Locale; data?: CortexPageData }) {
  const facts = (data?.facts ?? []).map((f) => ({
    label: f.label[locale],
    value: f.value[locale],
    href: f.href,
    external: f.external,
  }));

  return (
    <section className="relative" style={{ padding: "0 clamp(24px, 5vw, 80px) clamp(48px, 6vw, 80px)" }}>
      <div className="max-w-4xl mx-auto">
        <Link
          href={`/${locale}/projekty`}
          className="inline-flex items-center gap-1.5 font-mono text-label font-semibold uppercase tracking-[0.15em] mb-6 transition-opacity duration-200 hover:opacity-60"
          style={{ color: "#6E7683" }}
        >
          <span aria-hidden="true">&larr;</span>
          {t(locale, "ui.allProjects")}
        </Link>
        <ProjectFacts locale={locale} facts={facts} />
      </div>
    </section>
  );
}

/* ─── Hero ─── */

function HeroScene({ locale, data }: { locale: Locale; data?: CortexPageData }) {
  return (
    <section className="relative flex flex-col items-center justify-center" style={{ minHeight: "70vh", padding: "clamp(48px, 6vw, 80px)" }}>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        className="text-center max-w-4xl mx-auto"
      >
        <span className="text-xs font-mono font-semibold tracking-widest uppercase" style={{ color: "rgba(255,255,255,0.20)" }}>
          {data?.hero.label[locale]}
        </span>
        <h1 className="font-heading leading-tight mt-8 sm:mt-10" style={{ fontSize: "var(--text-hero-md)", letterSpacing: "-0.04em", color: "#F4F6F8" }}>
          {data?.hero.title}
        </h1>
      </motion.div>
      <motion.p
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="font-heading mt-8 text-center max-w-lg"
        style={{ fontSize: "var(--text-h4)", letterSpacing: "-0.03em", color: "rgba(255,255,255,0.25)" }}
      >
        {data?.hero.tagline[locale]}
      </motion.p>
    </section>
  );
}

/* ─── Why ─── */

function WhyScene({ locale, data }: { locale: Locale; data?: CortexPageData }) {
  return (
    <section className="relative flex items-center justify-center" style={{ minHeight: "50vh", padding: "clamp(48px, 6vw, 80px)" }}>
      <div className="max-w-xl mx-auto">
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.4 }}
          className="text-xs font-mono font-semibold tracking-widest uppercase mb-6"
          style={{ color: "#6E7683" }}
        >
          {data?.why.label[locale]}
        </motion.p>
        <motion.p
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.5, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
          className="font-body leading-relaxed"
          style={{ fontSize: "var(--text-lead)", color: "#9AA1AB" }}
        >
          {data?.why.text[locale]}
        </motion.p>
      </div>
    </section>
  );
}

/* ─── Chat conversation ─── */

interface RawMsg {
  sender: string;
  text: string;
  delayMs?: number;
  typingMs?: number;
}

function ChatScene({ locale, data }: { locale: Locale; data?: CortexPageData }) {
  const sectionRef = useRef<HTMLElement>(null);
  const [hasStarted, setHasStarted] = useState(false);
  const [revealed, setRevealed] = useState(0);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const msgA = "a";
  const msgB = "b";

  const raw: RawMsg[] =
    locale === "cs"
      ? (data?.chat.cs ?? [])
      : (data?.chat.en ?? []);

  const displaySteps = useMemo(
    () =>
      raw.flatMap((msg) => {
        const result: { type: "msg" | "typing"; msg: RawMsg }[] = [];
        if (msg.typingMs) result.push({ type: "typing", msg });
        result.push({ type: "msg", msg });
        return result;
      }),
    [locale]
  );

  const stepsRef = useRef(displaySteps);
  stepsRef.current = displaySteps;

  // Detect when section enters the viewport → start chat
  useEffect(() => {
    if (!sectionRef.current || hasStarted) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setHasStarted(true);
          observer.disconnect();
        }
      },
      { threshold: 0.3 }
    );
    observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, [hasStarted]);

  // Independent timer — reveals all messages sequentially once started
  useEffect(() => {
    if (!hasStarted) return;

    const steps = stepsRef.current;
    if (revealed >= steps.length) return;

    const step = steps[revealed];

    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }

    if (step.type === "typing") {
      timerRef.current = setTimeout(() => {
        setRevealed((r) => r + 1);
      }, step.msg.typingMs || 1000);
    } else {
      timerRef.current = setTimeout(() => {
        setRevealed((r) => r + 1);
      }, step.msg.delayMs != null ? step.msg.delayMs : 800);
    }

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [hasStarted, revealed]);

  const revealedMsgs = displaySteps.slice(0, revealed).filter((s) => s.type === "msg");
  const showTyping = revealed < displaySteps.length && displaySteps[revealed].type === "typing";
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!scrollRef.current) return;
    scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [revealed]);

  return (
    <section ref={sectionRef} className="relative" style={{ height: "100vh", background: "#121316" }}>
      <div className="sticky top-0 flex items-center justify-center" style={{ height: "100vh", padding: "clamp(32px, 5vw, 80px)" }}>
        <div className="w-full max-w-[680px] mx-auto flex flex-col" style={{ height: "min(65vh, 560px)" }}>
          <div
            ref={scrollRef}
            className="flex-1 overflow-y-auto space-y-3 sm:space-y-4 pr-2"
            style={{ scrollbarWidth: "thin", scrollbarColor: "rgba(255,255,255,0.08) transparent" }}
          >
            {revealedMsgs.map((s, i) => {
              const isA = s.msg.sender === msgA;
              return (
                <motion.div
                  key={s.msg.text + "-" + i}
                  initial={{ opacity: 0, y: 16, scale: 0.97 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
                  className={`flex items-start gap-3 ${isA ? "" : "flex-row-reverse"}`}
                >
                  <span className="font-heading text-xs flex-shrink-0" style={{ color: "rgba(255,255,255,0.35)", minWidth: "clamp(28px, 3vw, 36px)", paddingTop: 4 }}>
                    {isA ? "A" : "B"}
                  </span>
                  <div
                    className="px-4 py-2.5 sm:px-5 sm:py-3"
                    style={{
                      background: isA ? "#1C1E23" : "#26282E",
                      border: "1px solid rgba(255,255,255,0.06)",
                      borderRadius: 14,
                      maxWidth: "clamp(260px, 70%, 480px)",
                    }}
                  >
                    <p className="font-body leading-relaxed" style={{ fontSize: "var(--text-small)", color: "#F4F6F8" }}>
                      {s.msg.text}
                    </p>
                  </div>
                </motion.div>
              );
            })}

            {showTyping && (
              <motion.div
                key={"typing-" + revealed}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                className="flex items-start gap-3"
              >
                <span className="font-heading text-xs flex-shrink-0" style={{ color: "rgba(255,255,255,0.35)", minWidth: "clamp(28px, 3vw, 36px)", paddingTop: 2 }}>B</span>
                <div className="flex items-center gap-1 px-4 py-3" style={{ background: "#26282E", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 14 }}>
                  {[0, 1, 2].map((d) => (
                    <motion.span
                      key={d}
                      className="w-1.5 h-1.5 rounded-full block"
                      style={{ background: "rgba(255,255,255,0.45)" }}
                      animate={{ opacity: [0.3, 1, 0.3] }}
                      transition={{ repeat: Infinity, duration: 1.2, delay: d * 0.2 }}
                    />
                  ))}
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─── Sticky screenshot + annotations ─── */

function ScreenshotWithAnnotationsScene({ locale, data }: { locale: Locale; data?: CortexPageData }) {
  const sectionRef = useRef<HTMLElement>(null);
  const progress = useElementScrollProgress(sectionRef, OFFSET_FULL, 1);
  const screenshotOpacity = useTransform(progress, [0, 0.15], [0, 1]);
  const screenshotScale = useTransform(progress, [0, 0.15], [0.95, 1]);

  const annotations = (data?.annotations ?? []).map((a) => ({
    label: a.label[locale],
    note: a.note[locale],
    appearAt: a.appearAt,
    top: a.top,
    left: a.left,
    right: a.right,
  }));

  const annotationOpacity = annotations.map((a) =>
    useTransform(progress, [a.appearAt, a.appearAt + 0.08], [0, 1])
  );
  const annotationY = annotations.map((a) =>
    useTransform(progress, [a.appearAt, a.appearAt + 0.08], [12, 0])
  );

  return (
    <section ref={sectionRef} className="relative" style={{ height: "350vh", background: "#0A0A0B" }}>
      <div className="sticky top-0 flex items-center justify-center" style={{ height: "100vh", padding: "clamp(24px, 4vw, 60px)" }}>
        <div className="relative w-full max-w-5xl mx-auto rounded-2xl overflow-hidden aspect-[16/9] max-md:aspect-[4/3]" style={{ background: "#121316", border: "1px solid rgba(255,255,255,0.06)" }}>
          <motion.div className="absolute inset-0" style={{ opacity: screenshotOpacity, scale: screenshotScale }}>
            <Image
              src={data?.screenshot.src ?? "/images/cortex/cortex-dashboard.png"}
              alt={data?.screenshot.alt[locale] ?? "Cortex dashboard"}
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 1024px"
              priority
            />
          </motion.div>
          {annotations.map((a, i) => (
            <motion.div
              key={a.label}
              style={{
                opacity: annotationOpacity[i],
                y: annotationY[i],
                position: "absolute",
                top: a.top,
                left: a.left,
                right: a.right,
              }}
              className="pointer-events-none"
            >
              <div className="px-3 py-2 rounded-lg max-md:px-2 max-md:py-1" style={{ background: "rgba(255,255,255,0.95)", border: "1px solid rgba(0,0,0,0.08)" }}>
                <p className="font-heading text-xs whitespace-nowrap max-md:text-label-sm" style={{ color: "#0A0A0B" }}>{a.label}</p>
                <p className="font-body text-label whitespace-nowrap max-md:hidden" style={{ color: "rgba(0,0,0,0.55)" }}>{a.note}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── Confidence ─── */

function ConfidenceScene({ locale, data }: { locale: Locale; data?: CortexPageData }) {
  const sectionRef = useRef<HTMLElement>(null);
  const progress = useElementScrollProgress(sectionRef, OFFSET_FULL, 0);

  const pct = useTransform(progress, [0, 1], [55, 98]);
  const roundedPct = useTransform(pct, (v) => Math.round(v) + " %");

  const stageLabels = (data?.confidence.stages ?? []).map((s) => ({
    label: s.label[locale],
    desc: s.desc[locale],
    range: s.range,
  }));

  return (
    <section ref={sectionRef} className="relative" style={{ height: "200vh", background: "#0A0A0B" }}>
      <div className="sticky top-0 flex items-center justify-center" style={{ height: "100vh", padding: "clamp(48px, 6vw, 80px) clamp(24px, 5vw, 80px)" }}>
        <div className="max-w-lg mx-auto text-center">
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-xs font-mono font-semibold tracking-widest uppercase mb-6 sm:mb-8"
            style={{ color: "#6E7683" }}
          >
            {data?.confidence.label[locale]}
          </motion.p>

          <motion.p className="font-heading leading-tight" style={{ fontSize: "var(--text-display)", letterSpacing: "-0.04em", color: "#F4F6F8" }}>
            {roundedPct}
          </motion.p>

          <div className="relative" style={{ height: "clamp(104px, 13vh, 132px)" }}>
            {stageLabels.map((s, i) => {
              const [from, to] = s.range;
              const isFirst = i === 0;
              const opacityInput = isFirst
                ? [0, from + 0.08, to - 0.08, to]
                : [from, from + 0.08, to - 0.08, to];
              const opacityOutput = isFirst ? [1, 1, 1, 0] : [0, 1, 1, 0];
              const yInput = opacityInput;
              const yOutput = isFirst ? [0, 0, 0, -10] : [10, 0, 0, -10];
              const opacity = useTransform(progress, opacityInput, opacityOutput);
              const y = useTransform(progress, yInput, yOutput);
              return (
                <motion.div
                  key={s.label}
                  style={{ opacity, y, position: "absolute", inset: 0 }}
                  className="flex flex-col items-center justify-center"
                >
                  <p
                    className="font-heading"
                    style={{ fontSize: "var(--text-h4)", letterSpacing: "-0.02em", color: "#F4F6F8" }}
                  >
                    {s.label}
                  </p>
                  <p
                    className="font-body mt-2"
                    style={{ fontSize: "var(--text-small)", color: "#9AA1AB" }}
                  >
                    {s.desc}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─── Quote: AI writes ─── */

function QuoteSplitScene({ locale, data }: { locale: Locale; data?: CortexPageData }) {
  return (
    <section className="relative flex items-center justify-center" style={{ minHeight: "60vh", padding: "clamp(60px, 8vw, 100px) clamp(24px, 5vw, 80px)" }}>
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        className="text-center max-w-3xl mx-auto"
      >
        <p className="font-heading leading-tight" style={{ fontSize: "var(--text-h2-lg)", letterSpacing: "-0.03em", color: "#F4F6F8" }}>
          {data?.quoteSplit.primary[locale]}
        </p>
        <p className="font-heading leading-tight mt-3" style={{ fontSize: "var(--text-h2-lg)", letterSpacing: "-0.03em", color: "rgba(255,255,255,0.20)" }}>
          {data?.quoteSplit.secondary[locale]}
        </p>
      </motion.div>
    </section>
  );
}

/* ─── Quote: doing nothing ─── */

function EditorialQuoteScene({ locale, data }: { locale: Locale; data?: CortexPageData }) {
  return (
    <section className="relative flex items-center justify-center" style={{ minHeight: "50vh", padding: "clamp(48px, 6vw, 80px) clamp(24px, 5vw, 80px)" }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="text-center max-w-2xl mx-auto"
      >
        <p className="font-heading leading-tight" style={{ fontSize: "var(--text-h3)", letterSpacing: "-0.03em", color: "#F4F6F8" }}>
          {data?.editorial.title[locale]}
        </p>
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="font-body mt-4 leading-relaxed max-w-md mx-auto"
          style={{ fontSize: "var(--text-small)", color: "#9AA1AB" }}
        >
          {data?.editorial.text[locale]}
        </motion.p>
      </motion.div>
    </section>
  );
}

/* ─── Cinematic reveal ─── */

function CinematicRevealScene({ locale, data }: { locale: Locale; data?: CortexPageData }) {
  const sectionRef = useRef<HTMLElement>(null);
  const progress = useElementScrollProgress(sectionRef, OFFSET_FULL, 1);

  const steps = (data?.cinematic.steps ?? []).map((s) => ({
    icon: s.icon,
    label: s.label[locale],
    sub: s.sub[locale],
  }));

  const total = steps.length;

  return (
    <section ref={sectionRef} className="relative" style={{ height: "250vh", background: "#0A0A0B" }}>
      <div className="sticky top-0 flex items-center justify-center" style={{ height: "100vh", padding: "clamp(48px, 6vw, 80px) clamp(24px, 5vw, 80px)" }}>
        <div className="max-w-md mx-auto">
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-xs font-mono font-semibold tracking-widest uppercase mb-8"
            style={{ color: "#6E7683" }}
          >
            {data?.cinematic.label[locale]}
          </motion.p>

          <div className="space-y-5">
            {steps.map((s, i) => (
              <CinematicRow key={s.label} step={s} index={i} total={total} progress={progress} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function CinematicRow({
  step,
  index,
  total,
  progress,
}: {
  step: { icon: string; label: string; sub: string };
  index: number;
  total: number;
  progress: MotionValue<number>;
}) {
  const t0 = index / total;
  const t1 = (index + 1) / total;
  const isLast = index === total - 1;
  const rise = t0 === 0 ? 0.001 : Math.max(0.001, t0 - 0.03);

  const bright = isLast
    ? useTransform(progress, [0, rise, t0, 1], [0, 0, 1, 1])
    : useTransform(
        progress,
        [0, rise, t0, t1, Math.min(t1 + 0.02, 0.999)],
        [0, 0, 1, 1, 0.3]
      );
  const dim = isLast
    ? useTransform(progress, [0, rise, t0, 1], [1, 1, 0, 0])
    : useTransform(
        progress,
        [0, rise, t0, t1, Math.min(t1 + 0.02, 0.999)],
        [1, 1, 0, 0, 0.7]
      );

  return (
    <div className="relative flex items-center gap-3">
      <motion.div
        style={{ opacity: dim }}
        className="absolute inset-0 flex items-center gap-3 pointer-events-none"
        aria-hidden="true"
      >
        <span className="font-mono text-sm flex-shrink-0" style={{ width: 20, color: "rgba(255,255,255,0.2)" }}>
          {step.icon}
        </span>
        <div>
          <span className="font-heading leading-tight" style={{ fontSize: "var(--text-h4)", letterSpacing: "-0.01em", color: "rgba(255,255,255,0.2)" }}>
            {step.label}
          </span>
          <span className="font-body text-xs block" style={{ color: "rgba(255,255,255,0.1)" }}>
            {step.sub}
          </span>
        </div>
      </motion.div>
      <motion.div
        style={{ opacity: bright }}
        initial={{ x: -16 }}
        whileInView={{ x: 0 }}
        viewport={{ once: true }}
        transition={{ delay: index * 0.1, duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
        className="flex items-center gap-3"
      >
        <span className="font-mono text-sm flex-shrink-0" style={{ width: 20, color: "#F4F6F8" }}>
          {step.icon}
        </span>
        <div>
          <span className="font-heading leading-tight" style={{ fontSize: "var(--text-h4)", letterSpacing: "-0.01em", color: "#F4F6F8" }}>
            {step.label}
          </span>
          <span className="font-body text-xs block" style={{ color: "#9AA1AB" }}>
            {step.sub}
          </span>
        </div>
      </motion.div>
    </div>
  );
}

/* ─── Final CTA ─── */

function FinalScene({ locale, data }: { locale: Locale; data?: CortexPageData }) {
  const title = (data?.final.title ?? []).map((line) => line[locale]);

  return (
    <section className="relative flex flex-col items-center justify-center" style={{ minHeight: "60vh", padding: "clamp(60px, 8vw, 100px) clamp(24px, 5vw, 80px)" }}>
      <div className="max-w-2xl mx-auto text-center">
        <motion.h2
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="font-heading font-medium leading-tight"
          style={{ fontSize: "var(--text-h2-lg)", letterSpacing: "-0.03em", color: "#F4F6F8" }}
        >
          {title.map((line, i) => (
            <span key={i}>
              {line}
              {i < title.length - 1 && <br />}
            </span>
          ))}
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.12, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          className="font-body mt-4 max-w-md mx-auto leading-relaxed"
          style={{ fontSize: "var(--text-small)", color: "#9AA1AB" }}
        >
          {data?.final.text[locale]}
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.25, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          className="mt-6"
        >
          <Link
            href={`/${locale}/contact`}
            className="inline-flex items-center gap-2 px-7 py-2.5 rounded-full text-sm font-medium transition-all duration-300"
            style={{ color: "#0A0A0B", background: "var(--color-accent)" }}
            onMouseEnter={(e) => { e.currentTarget.style.opacity = "0.85"; }}
            onMouseLeave={(e) => { e.currentTarget.style.opacity = "1"; }}
          >
            {data?.final.cta[locale]} &rarr;
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
