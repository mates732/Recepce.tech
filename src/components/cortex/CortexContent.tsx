"use client";

import { useRef, useState, useEffect, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";

interface Props {
  locale: Locale;
}

type Locale = "cs" | "en";

export default function CortexContent({ locale }: Props) {
  return (
    <div className="relative" style={{ background: "#F7F8FA" }}>
      <HeroScene locale={locale} />
      <WhyScene locale={locale} />
      <ChatScene locale={locale} />
      <ScreenshotWithAnnotationsScene locale={locale} />
      <ConfidenceScene locale={locale} />
      <QuoteSplitScene locale={locale} />
      <EditorialQuoteScene locale={locale} />
      <CinematicRevealScene locale={locale} />
      <FinalScene locale={locale} />
    </div>
  );
}

/* ─── Hero ─── */

function HeroScene({ locale }: { locale: Locale }) {
  return (
    <section className="relative flex flex-col items-center justify-center" style={{ minHeight: "70vh", padding: "clamp(48px, 6vw, 80px)" }}>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        className="text-center max-w-4xl mx-auto"
      >
        <span className="text-xs font-mono font-semibold tracking-widest uppercase" style={{ color: "rgba(17,17,17,0.20)" }}>
          {locale === "cs" ? "Intern\u00ed syst\u00e9m" : "Internal System"}
        </span>
        <h1 className="font-heading leading-tight mt-8 sm:mt-10" style={{ fontSize: "clamp(36px, 5.5vw, 72px)", letterSpacing: "-0.04em", color: "#111111" }}>
          Cortex
        </h1>
      </motion.div>
      <motion.p
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="font-heading mt-8 text-center max-w-lg"
        style={{ fontSize: "clamp(16px, 1.8vw, 22px)", letterSpacing: "-0.03em", color: "rgba(17,17,17,0.25)" }}
      >
        {locale === "cs" ? "Cortex nikdy neza\u010d\u00edn\u00e1 AI." : "Cortex never starts with AI."}
      </motion.p>
    </section>
  );
}

/* ─── Why ─── */

function WhyScene({ locale }: { locale: Locale }) {
  return (
    <section className="relative flex items-center justify-center" style={{ minHeight: "50vh", padding: "clamp(48px, 6vw, 80px)" }}>
      <div className="max-w-xl mx-auto">
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.4 }}
          className="text-xs font-mono font-semibold tracking-widest uppercase mb-6"
          style={{ color: "#9CA3AF" }}
        >
          {locale === "cs" ? "Pro\u010d" : "Why"}
        </motion.p>
        <motion.p
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.5, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
          className="font-body leading-relaxed"
          style={{ fontSize: "clamp(15px, 1.2vw, 18px)", color: "#5F6368" }}
        >
          {locale === "cs"
            ? "Tradi\u010dn\u00ed oslovov\u00e1n\u00ed vy\u017eaduje hodiny manu\u00e1ln\u00ed pr\u00e1ce. Cortex ji automatizuje p\u0159i zachov\u00e1n\u00ed d\u016fkazn\u011b podlo\u017een\u00fdch doporu\u010den\u00ed."
            : "Traditional outreach requires hours of manual work. Cortex automates it while keeping every recommendation evidence-based."}
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

function ChatScene({ locale }: { locale: Locale }) {
  const sectionRef = useRef<HTMLElement>(null);
  const [hasStarted, setHasStarted] = useState(false);
  const [revealed, setRevealed] = useState(0);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const msgA = "a";
  const msgB = "b";

  function m(sender: string, text: string, opts?: { delayMs?: number; typingMs?: number }): RawMsg {
    return { sender, text, ...opts };
  }

  const enRaw: RawMsg[] = [
    m(msgA, "So\u2026 what actually is Cortex?", { delayMs: 500 }),
    m(msgB, "It\u2019s my internal system.", { delayMs: 1000 }),
    m(msgB, "It helps me decide who I should contact.", { delayMs: 1200 }),
    m(msgA, "So\u2026 ChatGPT?", { delayMs: 800 }),
    m(msgB, "Haha no \uD83D\uDE04", { typingMs: 1200, delayMs: 600 }),
    m(msgB, "ChatGPT writes.", { delayMs: 800 }),
    m(msgB, "Cortex decides whether anything should be written at all.", { delayMs: 1400 }),
    m(msgA, "How?", { delayMs: 600 }),
    m(msgB, "It researches companies.", { delayMs: 900 }),
    m(msgB, "Checks websites.", { delayMs: 700 }),
    m(msgB, "Looks for booking systems.", { delayMs: 800 }),
    m(msgB, "Collects evidence.", { delayMs: 900 }),
    m(msgA, "So it just crawls websites?", { delayMs: 700 }),
    m(msgB, "No.", { typingMs: 800, delayMs: 400 }),
    m(msgB, "The crawler only gathers information.", { delayMs: 1000 }),
    m(msgB, "Cortex makes the decision.", { delayMs: 1200 }),
    m(msgA, "What if it isn\u2019t sure?", { delayMs: 700 }),
    m(msgB, "Then nothing happens.", { typingMs: 1500, delayMs: 600 }),
    m(msgA, "Seriously?", { delayMs: 500 }),
    m(msgB, "Yep.", { delayMs: 600 }),
    m(msgB, "I\u2019d rather lose a potential client\u2026", { delayMs: 1000 }),
    m(msgB, "\u2026than send a stupid email.", { delayMs: 1200 }),
    m(msgA, "So writing emails isn\u2019t the hard part?", { delayMs: 800 }),
    m(msgB, "Exactly.", { typingMs: 2000, delayMs: 500 }),
    m(msgB, "The hardest part is deciding whether one should even exist.", { delayMs: 1800 }),
  ];

  const csRaw: RawMsg[] = [
    m(msgA, "Tak\u017ee\u2026 co vlastn\u011b je Cortex?", { delayMs: 500 }),
    m(msgB, "M\u016fj intern\u00ed syst\u00e9m.", { delayMs: 1000 }),
    m(msgB, "Pom\u00e1h\u00e1 mi rozhodnout, koho m\u00e1m oslovit.", { delayMs: 1200 }),
    m(msgA, "Tak\u017ee\u2026 ChatGPT?", { delayMs: 800 }),
    m(msgB, "Haha ne \uD83D\uDE04", { typingMs: 1200, delayMs: 600 }),
    m(msgB, "ChatGPT p\u00ed\u0161e.", { delayMs: 800 }),
    m(msgB, "Cortex rozhoduje, jestli v\u016fbec n\u011bco m\u00e1 b\u00fdt naps\u00e1no.", { delayMs: 1400 }),
    m(msgA, "Jak?", { delayMs: 600 }),
    m(msgB, "Zkoum\u00e1 firmy.", { delayMs: 900 }),
    m(msgB, "Kontroluje weby.", { delayMs: 700 }),
    m(msgB, "Hled\u00e1 rezerva\u010dn\u00ed syst\u00e9my.", { delayMs: 800 }),
    m(msgB, "Sb\u00edr\u00e1 d\u016fkazy.", { delayMs: 900 }),
    m(msgA, "Tak\u017ee jen proch\u00e1z\u00ed weby?", { delayMs: 700 }),
    m(msgB, "Ne.", { typingMs: 800, delayMs: 400 }),
    m(msgB, "Crawler jen sb\u00edr\u00e1 informace.", { delayMs: 1000 }),
    m(msgB, "Rozhodnut\u00ed d\u011bl\u00e1 Cortex.", { delayMs: 1200 }),
    m(msgA, "Co kdy\u017e si nen\u00ed jistej?", { delayMs: 700 }),
    m(msgB, "Pak se nic nestane.", { typingMs: 1500, delayMs: 600 }),
    m(msgA, "Fakt?", { delayMs: 500 }),
    m(msgB, "Jo.", { delayMs: 600 }),
    m(msgB, "Rad\u011bji p\u0159ijdu o potenci\u00e1ln\u00edho klienta\u2026", { delayMs: 1000 }),
    m(msgB, "\u2026ne\u017e abych poslal blb\u00fd e-mail.", { delayMs: 1200 }),
    m(msgA, "Tak\u017ee psan\u00ed e-mail\u016f nen\u00ed to nejt\u011b\u017e\u0161\u00ed?", { delayMs: 800 }),
    m(msgB, "P\u0159esn\u011b.", { typingMs: 2000, delayMs: 500 }),
    m(msgB, "Nejt\u011b\u017e\u0161\u00ed je rozhodnout, jestli v\u016fbec m\u00e1 existovat.", { delayMs: 1800 }),
  ];

  const raw = locale === "cs" ? csRaw : enRaw;

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
    <section ref={sectionRef} className="relative" style={{ height: "100vh", background: "#FFFFFF" }}>
      <div className="sticky top-0 flex items-center justify-center" style={{ height: "100vh", padding: "clamp(32px, 5vw, 80px)" }}>
        <div className="w-full max-w-[680px] mx-auto flex flex-col" style={{ height: "min(65vh, 560px)" }}>
          <div
            ref={scrollRef}
            className="flex-1 overflow-y-auto space-y-3 sm:space-y-4 pr-2"
            style={{ scrollbarWidth: "thin", scrollbarColor: "rgba(17,17,17,0.08) transparent" }}
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
                  <span className="font-heading text-xs flex-shrink-0" style={{ color: "rgba(17,17,17,0.10)", minWidth: "clamp(28px, 3vw, 36px)", paddingTop: 4 }}>
                    {isA ? "A" : "B"}
                  </span>
                  <div
                    className="px-4 py-2.5 sm:px-5 sm:py-3"
                    style={{
                      background: isA ? "#FFFFFF" : "#F7F8FA",
                      border: "1px solid rgba(17,17,17,0.06)",
                      borderRadius: 14,
                      maxWidth: "clamp(260px, 70%, 480px)",
                    }}
                  >
                    <p className="font-body leading-relaxed" style={{ fontSize: "clamp(13px, 1.1vw, 15px)", color: "#111111" }}>
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
                <span className="font-heading text-xs flex-shrink-0" style={{ color: "rgba(17,17,17,0.15)", minWidth: "clamp(28px, 3vw, 36px)", paddingTop: 2 }}>B</span>
                <div className="flex items-center gap-1 px-4 py-3" style={{ background: "#F7F8FA", border: "1px solid rgba(17,17,17,0.06)", borderRadius: 14 }}>
                  {[0, 1, 2].map((d) => (
                    <motion.span
                      key={d}
                      className="w-1.5 h-1.5 rounded-full block"
                      style={{ background: "rgba(17,17,17,0.20)" }}
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

function ScreenshotWithAnnotationsScene({ locale }: { locale: Locale }) {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start start", "end end"] });
  const screenshotOpacity = useTransform(scrollYProgress, [0, 0.15], [0, 1]);
  const screenshotScale = useTransform(scrollYProgress, [0, 0.15], [0.95, 1]);

  const annotations = locale === "cs"
    ? [
        { label: "Ov\u011b\u0159en\u00e9 d\u016fkazy", note: "V\u00edce ne\u017e 10 sign\u00e1l\u016f potvrzeno", appearAt: 0.2, top: "15%", left: "8%" },
        { label: "Sk\u00f3re d\u016fv\u011bry", note: "94 %", appearAt: 0.35, top: "55%", right: "10%", left: "auto" },
        { label: "AI doporu\u010den\u00ed", note: "Generov\u00e1no z d\u016fkaz\u016f", appearAt: 0.5, top: "35%", left: "55%" },
        { label: "P\u0159ipraveno k review", note: "\u010cek\u00e1 na schv\u00e1len\u00ed", appearAt: 0.65, top: "72%", left: "15%" },
        { label: "P\u0159\u00edle\u017eitost", note: "Detekov\u00e1na a ohodnocena", appearAt: 0.8, top: "20%", right: "18%", left: "auto" },
      ]
    : [
        { label: "Verified evidence", note: "More than 10 signals confirmed", appearAt: 0.2, top: "15%", left: "8%" },
        { label: "Confidence score", note: "94 %", appearAt: 0.35, top: "55%", right: "10%", left: "auto" },
        { label: "AI recommendation", note: "Generated from evidence", appearAt: 0.5, top: "35%", left: "55%" },
        { label: "Ready for review", note: "Awaiting approval", appearAt: 0.65, top: "72%", left: "15%" },
        { label: "Opportunity", note: "Detected and scored", appearAt: 0.8, top: "20%", right: "18%", left: "auto" },
      ];

  const annotationOpacity = annotations.map((a) =>
    useTransform(scrollYProgress, [a.appearAt, a.appearAt + 0.08], [0, 1])
  );
  const annotationY = annotations.map((a) =>
    useTransform(scrollYProgress, [a.appearAt, a.appearAt + 0.08], [12, 0])
  );

  return (
    <section ref={sectionRef} className="relative" style={{ height: "350vh", background: "#F7F8FA" }}>
      <div className="sticky top-0 flex items-center justify-center" style={{ height: "100vh", padding: "clamp(24px, 4vw, 60px)" }}>
        <div className="relative w-full max-w-5xl mx-auto rounded-2xl overflow-hidden" style={{ background: "#FFFFFF", border: "1px solid rgba(17,17,17,0.06)", aspectRatio: "16/9" }}>
          <motion.div className="absolute inset-0" style={{ opacity: screenshotOpacity, scale: screenshotScale }}>
            <Image src="/images/cortex/cortex-dashboard.png" alt="Cortex dashboard" fill className="object-cover" sizes="(max-width: 1024px) 100vw, 1024px" priority />
          </motion.div>
          {annotations.map((a, i) => (
            <motion.div
              key={a.label}
              style={{
                opacity: annotationOpacity[i],
                y: annotationY[i],
                position: "absolute",
                top: a.top,
                left: a.left as string | undefined,
                right: (a as any).right as string | undefined,
              }}
              className="pointer-events-none"
            >
              <div className="px-3 py-2 rounded-lg" style={{ background: "rgba(255,255,255,0.95)", border: "1px solid rgba(17,17,17,0.06)" }}>
                <p className="font-heading text-xs" style={{ color: "#111111", whiteSpace: "nowrap" }}>{a.label}</p>
                <p className="font-body text-[10px]" style={{ color: "#5F6368", whiteSpace: "nowrap" }}>{a.note}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── Confidence ─── */

function ConfidenceScene({ locale }: { locale: Locale }) {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start start", "end end"] });

  const pct = useTransform(scrollYProgress, [0, 1], [55, 98]);
  const roundedPct = useTransform(pct, (v) => Math.round(v) + " %");

  const stageLabels = locale === "cs"
    ? [
        { label: "Po\u010d\u00e1te\u010dn\u00ed anal\u00fdza", desc: "Z\u00e1kladn\u00ed sign\u00e1ly detekov\u00e1ny", range: [0, 0.3] },
        { label: "D\u016fkazy ov\u011b\u0159eny", desc: "K\u0159\u00ed\u017eov\u00e1 reference potvrdila n\u00e1lezy", range: [0.3, 0.6] },
        { label: "P\u0159ipraveno k akci", desc: "V\u0161echny sign\u00e1ly konzistentn\u00ed", range: [0.6, 1] },
      ]
    : [
        { label: "Initial analysis", desc: "Basic signals detected", range: [0, 0.3] },
        { label: "Evidence verified", desc: "Cross-referencing confirmed findings", range: [0.3, 0.6] },
        { label: "Ready for action", desc: "All signals consistent", range: [0.6, 1] },
      ];

  const [stageIndex, setStageIndex] = useState(0);
  useEffect(() => {
    const unsub = scrollYProgress.on("change", (v) => {
      const idx = stageLabels.findIndex((s) => v >= s.range[0] && v < s.range[1]);
      if (idx >= 0) setStageIndex(idx);
      else if (v >= 1) setStageIndex(stageLabels.length - 1);
    });
    return () => unsub();
  }, [scrollYProgress, stageLabels]);

  const stage = stageLabels[stageIndex];

  return (
    <section ref={sectionRef} className="relative" style={{ height: "200vh", background: "#F7F8FA" }}>
      <div className="sticky top-0 flex items-center justify-center" style={{ height: "100vh", padding: "clamp(48px, 6vw, 80px) clamp(24px, 5vw, 80px)" }}>
        <div className="max-w-lg mx-auto text-center">
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-xs font-mono font-semibold tracking-widest uppercase mb-6 sm:mb-8"
            style={{ color: "#9CA3AF" }}
          >
            {locale === "cs" ? "D\u016fv\u011bra v rozhodnut\u00ed" : "Confidence"}
          </motion.p>

          <motion.p className="font-heading leading-tight" style={{ fontSize: "clamp(56px, 10vw, 120px)", letterSpacing: "-0.04em", color: "#111111" }}>
            {roundedPct}
          </motion.p>

          <motion.p
            key={stage.label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="font-heading mt-4"
            style={{ fontSize: "clamp(16px, 1.5vw, 20px)", letterSpacing: "-0.02em", color: "#111111" }}
          >
            {stage.label}
          </motion.p>
          <motion.p
            key={stage.desc}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.12, duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="font-body mt-2"
            style={{ fontSize: "clamp(12px, 1vw, 14px)", color: "#5F6368" }}
          >
            {stage.desc}
          </motion.p>
        </div>
      </div>
    </section>
  );
}

/* ─── Quote: AI writes ─── */

function QuoteSplitScene({ locale }: { locale: Locale }) {
  return (
    <section className="relative flex items-center justify-center" style={{ minHeight: "60vh", padding: "clamp(60px, 8vw, 100px) clamp(24px, 5vw, 80px)" }}>
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        className="text-center max-w-3xl mx-auto"
      >
        <p className="font-heading leading-tight" style={{ fontSize: "clamp(24px, 3.5vw, 44px)", letterSpacing: "-0.03em", color: "#111111" }}>
          {locale === "cs" ? "AI p\u00ed\u0161e." : "AI writes."}
        </p>
        <p className="font-heading leading-tight mt-3" style={{ fontSize: "clamp(24px, 3.5vw, 44px)", letterSpacing: "-0.03em", color: "rgba(17,17,17,0.20)" }}>
          {locale === "cs" ? "D\u016fkazy rozhoduj\u00ed." : "Evidence decides."}
        </p>
      </motion.div>
    </section>
  );
}

/* ─── Quote: doing nothing ─── */

function EditorialQuoteScene({ locale }: { locale: Locale }) {
  return (
    <section className="relative flex items-center justify-center" style={{ minHeight: "50vh", padding: "clamp(48px, 6vw, 80px) clamp(24px, 5vw, 80px)" }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="text-center max-w-2xl mx-auto"
      >
        <p className="font-heading leading-tight" style={{ fontSize: "clamp(18px, 2.5vw, 32px)", letterSpacing: "-0.03em", color: "#111111" }}>
          {locale === "cs" ? "Cortex um\u00ed doporu\u010dit ned\u011blat nic." : "Cortex can recommend doing nothing."}
        </p>
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="font-body mt-4 leading-relaxed max-w-md mx-auto"
          style={{ fontSize: "clamp(13px, 1vw, 15px)", color: "#5F6368" }}
        >
          {locale === "cs"
            ? "C\u00edlem je spr\u00e1vnost, ne prodej."
            : "The goal is correctness, not selling."}
        </motion.p>
      </motion.div>
    </section>
  );
}

/* ─── Cinematic reveal ─── */

function CinematicRevealScene({ locale }: { locale: Locale }) {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start start", "end end"] });
  const [step, setStep] = useState(0);

  const steps = locale === "cs"
    ? [
        { icon: "\u25B6", label: "D\u016fkazy", sub: "8 sign\u00e1l\u016f shrom\u00e1\u017ed\u011bno a ov\u011b\u0159eno" },
        { icon: "\u25B6", label: "Usuzov\u00e1n\u00ed", sub: "AI analyzuje validovan\u00fd kontext" },
        { icon: "\u25B6", label: "Rozhodnut\u00ed", sub: "Nejvhodn\u011bj\u0161\u00ed postup vybr\u00e1n" },
        { icon: "\u25B6", label: "Generov\u00e1n\u00ed", sub: "Personalizovan\u00e9 doporu\u010den\u00ed vytvo\u0159eno" },
        { icon: "\u2713", label: "P\u0159ipraveno ke kontrole", sub: "\u010cek\u00e1 na manu\u00e1ln\u00ed schv\u00e1len\u00ed" },
      ]
    : [
        { icon: "\u25B6", label: "Evidence", sub: "8 signals collected and verified" },
        { icon: "\u25B6", label: "Reasoning", sub: "AI analyses validated context" },
        { icon: "\u25B6", label: "Decision", sub: "Most suitable action selected" },
        { icon: "\u25B6", label: "Generation", sub: "Personalised recommendation created" },
        { icon: "\u2713", label: "Ready for review", sub: "Awaiting manual approval" },
      ];

  useEffect(() => {
    const unsub = scrollYProgress.on("change", (v) => {
      const idx = Math.min(Math.floor(v * steps.length), steps.length - 1);
      setStep(idx);
    });
    return () => unsub();
  }, [scrollYProgress, steps.length]);

  return (
    <section ref={sectionRef} className="relative" style={{ height: "250vh", background: "#F7F8FA" }}>
      <div className="sticky top-0 flex items-center justify-center" style={{ height: "100vh", padding: "clamp(48px, 6vw, 80px) clamp(24px, 5vw, 80px)" }}>
        <div className="max-w-md mx-auto">
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-xs font-mono font-semibold tracking-widest uppercase mb-8"
            style={{ color: "#9CA3AF" }}
          >
            {locale === "cs" ? "Pr\u00e1v\u011b prob\u00edh\u00e1" : "In Progress"}
          </motion.p>

          <div className="space-y-5">
            {steps.map((s, i) => {
              const done = i < step;
              const active = i === step;
              return (
                <motion.div
                  key={s.label}
                  initial={{ opacity: 0, x: -16 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1, duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                  className="flex items-center gap-3"
                  style={{ opacity: done ? 0.3 : active ? 1 : 0.12 }}
                >
                  <span className="font-mono text-sm flex-shrink-0" style={{ width: 20, color: done ? "#5F6368" : active ? "#111111" : "rgba(17,17,17,0.2)" }}>
                    {s.icon}
                  </span>
                  <div>
                    <span className="font-heading leading-tight" style={{ fontSize: "clamp(16px, 1.5vw, 20px)", letterSpacing: "-0.01em", color: done || active ? "#111111" : "rgba(17,17,17,0.2)" }}>
                      {s.label}
                    </span>
                    <span className="font-body text-xs block" style={{ color: done ? "#9CA3AF" : active ? "#5F6368" : "rgba(17,17,17,0.1)" }}>
                      {s.sub}
                    </span>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─── Final CTA ─── */

function FinalScene({ locale }: { locale: Locale }) {
  return (
    <section className="relative flex flex-col items-center justify-center" style={{ minHeight: "60vh", padding: "clamp(60px, 8vw, 100px) clamp(24px, 5vw, 80px)" }}>
      <div className="max-w-2xl mx-auto text-center">
        <motion.h2
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="font-heading font-bold leading-tight"
          style={{ fontSize: "clamp(24px, 3.5vw, 44px)", letterSpacing: "-0.03em", color: "#111111" }}
        >
          {locale === "cs" ? "M\u00e1te z\u00e1jem o\npodobn\u00fd intern\u00ed syst\u00e9m?" : "Interested in a similar\ninternal system?"}
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.12, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          className="font-body mt-4 max-w-md mx-auto leading-relaxed"
          style={{ fontSize: "clamp(13px, 1vw, 15px)", color: "#5F6368" }}
        >
          {locale === "cs" ? "Poj\u010fme ho postavit spole\u010dn\u011b." : "Let's build it together."}
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
            style={{ color: "#FFFFFF", background: "#111111" }}
            onMouseEnter={(e) => { e.currentTarget.style.opacity = "0.85"; }}
            onMouseLeave={(e) => { e.currentTarget.style.opacity = "1"; }}
          >
            {locale === "cs" ? "Poj\u010fme stav\u011bt" : "Let's build"} &rarr;
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
