"use client";

import { useMemo, useRef, useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useParallax } from "@/lib/scroll";
import type { Locale } from "@/lib/types";
import { getPage } from "@/content/repository";
import { trackLead } from "@/lib/leads";
import { trackEvent } from "@/lib/analytics";
import SectionHeader from "@/components/lab/SectionHeader";

interface SystemsAuditSectionProps {
  locale: Locale;
}

interface AuditQuestion {
  id: string;
  label: string;
  multiple: boolean;
  options: { id: string; label: string }[];
}

interface AuditArea {
  id: string;
  name: string;
  desc: string;
  potential: "High" | "Medium";
  why: string;
  solution: string;
}

type Answers = Record<string, string[]>;

const AREA_RULES: Record<string, Record<string, string>> = {
  tasks: {
    messages: "communication",
    reservations: "reception",
    search: "leads",
    reporting: "workflows",
    admin: "workflows",
  },
  channels: {
    phone: "communication",
    email: "communication",
    chat: "communication",
  },
  processes: {
    customer: "communication",
    orders: "reception",
    data: "workflows",
    outreach: "leads",
    support: "communication",
  },
};

const AREA_COLORS: Record<string, string> = {
  communication: "#FF4A2E",
  leads: "#FF4A2E",
  workflows: "#FF4A2E",
  reception: "#FF4A2E",
};

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function computeAreas(answers: Answers, areas: AuditArea[]): AuditArea[] {
  const scores = new Map<string, number>();
  for (const [qid, optionIds] of Object.entries(answers)) {
    const rules = AREA_RULES[qid];
    if (!rules) continue;
    for (const optId of optionIds) {
      const area = rules[optId];
      if (!area) continue;
      scores.set(area, (scores.get(area) ?? 0) + 1);
    }
  }
  return areas
    .filter((a) => scores.has(a.id))
    .sort((a, b) => (scores.get(b.id) ?? 0) - (scores.get(a.id) ?? 0))
    .slice(0, 3);
}

export default function SystemsAuditSection({ locale }: SystemsAuditSectionProps) {
  const data = getPage("home")?.data.systemsAudit;
  if (!data) return null;

  const t = (v: { cs: string; en: string }) => v[locale];

  const sectionRef = useRef<HTMLElement>(null);
  const bgY = useParallax(sectionRef, 70, -70);

  const title = t(data.title);
  const subtitle = t(data.subtitle);
  const intro = t(data.intro);
  const stepLabel = t(data.stepLabel);
  const nextLabel = t(data.nextLabel);
  const backLabel = t(data.backLabel);
  const finishLabel = t(data.finishLabel);
  const resultTitle = t(data.resultTitle);
  const reportHeader = t(data.reportHeader);
  const reportSupporting = t(data.reportSupporting);
  const reportSummary = t(data.reportSummary);
  const cardCta = t(data.cardCta);
  const previewTitle = t(data.previewTitle);
  const previewItems = data.previewItems[locale];
  const resultEmpty = t(data.resultEmpty);
  const restartLabel = t(data.restartLabel);
  const potentialHigh = t(data.potentialHigh);
  const potentialMedium = t(data.potentialMedium);
  const whyLabel = t(data.whyLabel);
  const solutionLabel = t(data.solutionLabel);
  const form = data.form;
  const formT = {
    title: t(form.title),
    subtitle: t(form.subtitle),
    name: t(form.name),
    company: t(form.company),
    email: t(form.email),
    website: t(form.website),
    size: t(form.size),
    challenge: t(form.challenge),
    submit: t(form.submit),
    sending: t(form.sending),
    successTitle: t(form.successTitle),
    successText: t(form.successText),
    error: t(form.error),
  };

  const questions: AuditQuestion[] = useMemo(
    () =>
      data.questions.map((q) => ({
        id: q.id,
        label: t(q.label),
        multiple: q.multiple,
        options: q.options.map((o) => ({ id: o.id, label: t(o.label) })),
      })),
    [data, locale]
  );

  const areas: AuditArea[] = useMemo(
    () =>
      data.areas.map((a) => ({
        id: a.id,
        name: t(a.name),
        desc: t(a.desc),
        potential: a.potential,
        why: t(a.why),
        solution: t(a.solution),
      })),
    [data, locale]
  );

  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Answers>({});
  const [done, setDone] = useState(false);
  const [formOpen, setFormOpen] = useState(false);
  const [selectedOpportunity, setSelectedOpportunity] = useState("");
  const auditStartedAt = useRef(Date.now());
  const startedRef = useRef(false);
  const reportTrackedRef = useRef(false);
  const formRef = useRef<HTMLDivElement>(null);

  const [formValues, setFormValues] = useState({
    name: "",
    company: "",
    email: "",
    website: "",
    challenge: "",
    sizeId: "",
  });
  const [formStatus, setFormStatus] = useState<"idle" | "sending" | "success" | "error">("idle");
  const [formError, setFormError] = useState("");

  const question = questions[step];
  const selected = answers[question.id] ?? [];
  const canContinue = selected.length > 0;
  const progress = (step + 1) / questions.length;

  const sizeOptions = questions.find((q) => q.id === "size")?.options ?? [];

  const toggleOption = (optionId: string) => {
    setAnswers((prev) => {
      const current = prev[question.id] ?? [];
      const next = question.multiple
        ? current.includes(optionId)
          ? current.filter((id) => id !== optionId)
          : [...current, optionId]
        : [optionId];
      return { ...prev, [question.id]: next };
    });
  };

  const goNext = () => {
    if (!canContinue) return;
    if (step < questions.length - 1) {
      setStep(step + 1);
    } else {
      setDone(true);
      setFormOpen(false);
      setSelectedOpportunity("");
      setFormValues((prev) => ({ ...prev, sizeId: answers.size?.[0] ?? "" }));
      trackEvent("ai_audit_completed", {
        durationMs: String(Date.now() - auditStartedAt.current),
      });
    }
  };

  const goBack = () => {
    if (step > 0) setStep(step - 1);
  };

  const restart = () => {
    setAnswers({});
    setStep(0);
    setDone(false);
    setFormOpen(false);
    setSelectedOpportunity("");
    setFormValues({ name: "", company: "", email: "", website: "", challenge: "", sizeId: "" });
    setFormStatus("idle");
    setFormError("");
  };

  const result = useMemo(
    () => (done ? computeAreas(answers, areas) : []),
    [done, answers, areas]
  );

  // Funnel: audit started
  useEffect(() => {
    if (startedRef.current) return;
    startedRef.current = true;
    trackEvent("ai_audit_started");
  }, []);

  // Funnel: report viewed (jakmile se report zobrazí)
  useEffect(() => {
    if (done && !reportTrackedRef.current) {
      reportTrackedRef.current = true;
      trackEvent("ai_audit_report_viewed", {
        durationMs: String(Date.now() - auditStartedAt.current),
      });
    }
  }, [done]);

  const openForm = (opportunityName: string) => {
    setSelectedOpportunity(opportunityName);
    setFormOpen(true);
    trackEvent("lead_form_opened", { opportunity: opportunityName });
    requestAnimationFrame(() => {
      formRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
    });
  };

  const canSubmit =
    formValues.name.trim().length > 0 &&
    formValues.company.trim().length > 0 &&
    EMAIL_PATTERN.test(formValues.email.trim());

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit || formStatus === "sending") return;

    setFormStatus("sending");
    setFormError("");

    const sizeOption = sizeOptions.find((o) => o.id === formValues.sizeId);
    const industryOption = questions.find((q) => q.id === "industry")?.options.find(
      (o) => o.id === answers.industry?.[0]
    );
    const topOpportunity = result[0]?.name ?? "";
    const lead = {
      source: "ai_audit" as const,
      name: formValues.name,
      company: formValues.company,
      email: formValues.email,
      website: formValues.website,
      companySize: sizeOption?.label ?? "",
      challenge: formValues.challenge,
      companyProfile: {
        industry: industryOption?.label ?? "",
        size: sizeOption?.label ?? "",
      },
      opportunities: result.map((a) => a.name),
      topOpportunity,
      selectedOpportunity: selectedOpportunity || topOpportunity,
      auditCompletionTime: Date.now() - auditStartedAt.current,
      answers,
      createdAt: new Date().toISOString(),
    };

    const res = await trackLead(lead);
    if (res.ok) {
      setFormStatus("success");
      trackEvent("lead_submitted", {
        selectedOpportunity: lead.selectedOpportunity,
        topOpportunity,
      });
    } else {
      setFormStatus("error");
      setFormError(formT.error);
    }
  };

  return (
    <section
      id="systems-audit"
      ref={sectionRef}
      className="relative overflow-hidden"
      style={{ padding: "clamp(48px, 8vw, 110px) clamp(24px, 5vw, 80px)" }}
    >
      <motion.div
        aria-hidden="true"
        className="absolute pointer-events-none"
        style={{
          inset: 0,
          y: bgY,
          background:
            "radial-gradient(ellipse 70% 50% at 50% 40%, rgba(251,191,36,0.05) 0%, transparent 65%)",
        }}
      />
      <div className="relative z-10 mx-auto" style={{ maxWidth: "1200px" }}>
        <SectionHeader eyebrow="/ 03" eyebrowColor="#FF4A2E" title={title} subtitle={subtitle} />

        <div className="grid gap-6 lg:grid-cols-12">
          {/* Intro column */}
          <div className="lg:col-span-5 order-2 lg:order-none flex flex-col gap-6">
            <motion.div
              className="rounded-2xl p-6 sm:p-7"
              style={{ background: "rgba(18,19,22,0.6)", border: "1px solid rgba(255,255,255,0.08)" }}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            >
              <p className="font-body text-sm leading-relaxed" style={{ color: "#C7CDD6" }}>
                {intro}
              </p>
              <ul className="flex flex-col gap-2.5 mt-5">
                {[
                  { cs: "5 otázek — asi 2 minuty", en: "5 questions — about 2 minutes" },
                  { cs: "Konkrétní oblasti, ne generický seznam", en: "Specific areas, not a generic list" },
                  { cs: "Bez závazků a bez obchodního tlaku", en: "No commitment, no sales pressure" },
                ].map((line) => (
                  <li key={line.en} className="flex items-center gap-2.5 font-mono" style={{ fontSize: "var(--text-label)", letterSpacing: "0.08em", color: "#6E7683" }}>
                    <span aria-hidden="true" className="inline-block w-1 h-1 rounded-full flex-shrink-0" style={{ background: "#FBBF24" }} />
                    {t(line)}
                  </li>
                ))}
              </ul>
            </motion.div>
          </div>

          {/* Wizard / report column */}
          <motion.div
            className="lg:col-span-7 order-1 lg:order-none rounded-2xl p-6 sm:p-8"
            style={{ background: "#121316", border: "1px solid rgba(255,255,255,0.1)" }}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          >
            {!done ? (
              <Wizard
                questions={questions}
                step={step}
                selected={selected}
                canContinue={canContinue}
                progress={progress}
                stepLabel={stepLabel}
                nextLabel={nextLabel}
                backLabel={backLabel}
                finishLabel={finishLabel}
                onToggle={toggleOption}
                onNext={goNext}
                onBack={goBack}
              />
            ) : formStatus === "success" ? (
              <motion.div
                key="success"
                role="status"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              >
                <p className="font-mono mb-2" style={{ fontSize: "var(--text-label)", letterSpacing: "0.2em", textTransform: "uppercase", color: "#34D399" }}>
                  ✓ lead_captured
                </p>
                <h3 className="font-heading mb-2" style={{ fontSize: "var(--text-h3)", color: "#F4F6F8" }}>
                  {formT.successTitle}
                </h3>
                <p className="font-body text-sm leading-relaxed mb-8" style={{ color: "#9AA1AB" }}>
                  {formT.successText}
                </p>
                <button
                  onClick={restart}
                  className="font-mono text-label tracking-[0.16em] uppercase transition-colors duration-200 cursor-pointer"
                  style={{ color: "#6E7683" }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = "#F4F6F8";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = "#6E7683";
                  }}
                >
                  ↺ {restartLabel}
                </button>
              </motion.div>
            ) : (
              <Report
                reportHeader={reportHeader}
                reportSupporting={reportSupporting}
                reportSummary={reportSummary}
                resultEmpty={resultEmpty}
                result={result}
                potentialHigh={potentialHigh}
                potentialMedium={potentialMedium}
                whyLabel={whyLabel}
                solutionLabel={solutionLabel}
                cardCta={cardCta}
                previewTitle={previewTitle}
                previewItems={previewItems}
                formOpen={formOpen}
                selectedOpportunity={selectedOpportunity}
                onOpenForm={openForm}
                formRef={formRef}
                formT={formT}
                sizeOptions={sizeOptions}
                formValues={formValues}
                setFormValues={setFormValues}
                formStatus={formStatus}
                formError={formError}
                canSubmit={canSubmit}
                onSubmit={handleSubmit}
                restartLabel={restartLabel}
                onRestart={restart}
              />
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
}

/* ─── Wizard ─── */

function Wizard({
  questions,
  step,
  selected,
  canContinue,
  progress,
  stepLabel,
  nextLabel,
  backLabel,
  finishLabel,
  onToggle,
  onNext,
  onBack,
}: {
  questions: AuditQuestion[];
  step: number;
  selected: string[];
  canContinue: boolean;
  progress: number;
  stepLabel: string;
  nextLabel: string;
  backLabel: string;
  finishLabel: string;
  onToggle: (id: string) => void;
  onNext: () => void;
  onBack: () => void;
}) {
  const question = questions[step];

  return (
    <>
      <div className="flex items-center justify-between gap-4 mb-2">
        <span className="font-mono" style={{ fontSize: "var(--text-label)", letterSpacing: "0.2em", textTransform: "uppercase", color: "#6E7683" }}>
          {stepLabel} {String(step + 1).padStart(2, "0")}/{String(questions.length).padStart(2, "0")}
        </span>
        <span className="font-mono" style={{ fontSize: "var(--text-label)", color: "#FBBF24" }}>
          {Math.round(progress * 100)}%
        </span>
      </div>
      <div className="h-px w-full mb-8" style={{ background: "rgba(255,255,255,0.07)" }}>
        <motion.div
          className="h-px origin-left"
          style={{ background: "linear-gradient(to right, #FBBF24, #F472B6)", scaleX: progress }}
        />
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={question.id}
          initial={{ opacity: 0, x: 24 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -24 }}
          transition={{ duration: 0.25, ease: [0.22, 0.8, 0.2, 1] }}
        >
          <h3 className="font-heading mb-6" style={{ fontSize: "var(--text-h3)", color: "#F4F6F8" }}>
            {question.label}
          </h3>
          <div className="flex flex-wrap gap-2.5">
            {question.options.map((option) => {
              const active = selected.includes(option.id);
              return (
                <button
                  key={option.id}
                  onClick={() => onToggle(option.id)}
                  className="rounded-full font-body text-sm transition-all duration-200 cursor-pointer"
                  style={{
                    padding: "10px 18px",
                    border: `1px solid ${active ? "rgba(251,191,36,0.6)" : "rgba(255,255,255,0.12)"}`,
                    background: active ? "rgba(251,191,36,0.1)" : "rgba(255,255,255,0.03)",
                    color: active ? "#F4F6F8" : "#9AA1AB",
                    scale: "1",
                  }}
                  onMouseEnter={(e) => {
                    if (active) return;
                    e.currentTarget.style.borderColor = "rgba(255,255,255,0.32)";
                    e.currentTarget.style.color = "#F4F6F8";
                  }}
                  onMouseLeave={(e) => {
                    if (active) return;
                    e.currentTarget.style.borderColor = "rgba(255,255,255,0.12)";
                    e.currentTarget.style.color = "#9AA1AB";
                  }}
                  onMouseDown={(e) => {
                    e.currentTarget.style.scale = "0.97";
                  }}
                  onMouseUp={(e) => {
                    e.currentTarget.style.scale = "1";
                  }}
                >
                  {option.label}
                </button>
              );
            })}
          </div>
        </motion.div>
      </AnimatePresence>

      <div className="flex items-center justify-between gap-4 mt-10">
        <button
          onClick={onBack}
          className="font-mono text-label tracking-[0.16em] uppercase transition-colors duration-200 cursor-pointer"
          style={{ color: step === 0 ? "rgba(244,246,248,0.2)" : "#6E7683", visibility: step === 0 ? "hidden" : "visible" }}
          onMouseEnter={(e) => {
            if (step > 0) e.currentTarget.style.color = "#F4F6F8";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.color = step === 0 ? "rgba(244,246,248,0.2)" : "#6E7683";
          }}
        >
          ← {backLabel}
        </button>
        <button
          onClick={onNext}
          disabled={!canContinue}
          className="inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-medium transition-all duration-300 cursor-pointer"
          style={{
            background: canContinue ? "#F4F6F8" : "rgba(255,255,255,0.06)",
            color: canContinue ? "#0A0A0B" : "rgba(244,246,248,0.3)",
            cursor: canContinue ? "pointer" : "default",
          }}
          onMouseEnter={(e) => {
            if (canContinue) e.currentTarget.style.boxShadow = "0 0 28px rgba(251,191,36,0.3)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.boxShadow = "none";
          }}
        >
          {step < questions.length - 1 ? nextLabel : finishLabel}
          <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
            <path d="M1 8h12m0 0L9 4m4 4l-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </div>
    </>
  );
}

/* ─── Report ─── */

function Report({
  reportHeader,
  reportSupporting,
  reportSummary,
  resultEmpty,
  result,
  potentialHigh,
  potentialMedium,
  whyLabel,
  solutionLabel,
  cardCta,
  previewTitle,
  previewItems,
  formOpen,
  selectedOpportunity,
  onOpenForm,
  formRef,
  formT,
  sizeOptions,
  formValues,
  setFormValues,
  formStatus,
  formError,
  canSubmit,
  onSubmit,
  restartLabel,
  onRestart,
}: {
  reportHeader: string;
  reportSupporting: string;
  reportSummary: string;
  resultEmpty: string;
  result: AuditArea[];
  potentialHigh: string;
  potentialMedium: string;
  whyLabel: string;
  solutionLabel: string;
  cardCta: string;
  previewTitle: string;
  previewItems: string[];
  formOpen: boolean;
  selectedOpportunity: string;
  onOpenForm: (name: string) => void;
  formRef: React.RefObject<HTMLDivElement | null>;
  formT: {
    title: string;
    subtitle: string;
    name: string;
    company: string;
    email: string;
    website: string;
    size: string;
    challenge: string;
    submit: string;
    sending: string;
    successTitle: string;
    successText: string;
    error: string;
  };
  sizeOptions: { id: string; label: string }[];
  formValues: { name: string; company: string; email: string; website: string; challenge: string; sizeId: string };
  setFormValues: React.Dispatch<
    React.SetStateAction<{ name: string; company: string; email: string; website: string; challenge: string; sizeId: string }>
  >;
  formStatus: "idle" | "sending" | "success" | "error";
  formError: string;
  canSubmit: boolean;
  onSubmit: (e: React.FormEvent) => void;
  restartLabel: string;
  onRestart: () => void;
}) {
  const disabled = formStatus === "sending";

  return (
    <div>
      <p className="font-mono mb-2" style={{ fontSize: "var(--text-label)", letterSpacing: "0.2em", textTransform: "uppercase", color: "#FBBF24" }}>
        ✓ audit_complete
      </p>
      <h3 className="font-heading mb-2" style={{ fontSize: "var(--text-h3)", color: "#F4F6F8" }}>
        {reportHeader}
      </h3>
      <p className="font-body text-sm leading-relaxed mb-1.5" style={{ color: "#C7CDD6" }}>
        {reportSupporting}
      </p>
      <p className="font-body text-xs leading-relaxed mb-7" style={{ color: "#6E7683" }}>
        {reportSummary}
      </p>

      {result.length === 0 ? (
        <p className="font-body text-sm mb-7" style={{ color: "#6E7683" }}>
          {resultEmpty}
        </p>
      ) : (
        <ul className="flex flex-col gap-3 mb-8">
          {result.map((area, i) => (
            <motion.li
              key={area.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.08 + i * 0.08, ease: [0.16, 1, 0.3, 1] }}
              className="rounded-xl p-4 sm:p-5"
              style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)" }}
            >
              <div className="flex items-center justify-between gap-3 mb-2">
                <p className="flex items-center gap-2.5 font-heading text-sm" style={{ color: "#F4F6F8" }}>
                  <span className="font-mono" style={{ fontSize: "var(--text-label)", color: AREA_COLORS[area.id] ?? "#FBBF24", letterSpacing: "0.2em" }}>
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  {area.name}
                </p>
                <span
                  className="rounded-full px-2.5 py-1 font-mono text-label-sm font-semibold uppercase tracking-[0.12em] whitespace-nowrap"
                  style={{
                    color: area.potential === "High" ? "#FBBF24" : "#9AA1AB",
                    background: area.potential === "High" ? "rgba(251,191,36,0.12)" : "rgba(154,161,171,0.12)",
                    border: `1px solid ${area.potential === "High" ? "rgba(251,191,36,0.35)" : "rgba(154,161,171,0.35)"}`,
                  }}
                >
                  {area.potential === "High" ? potentialHigh : potentialMedium}
                </span>
              </div>
              <p className="font-body text-sm leading-relaxed mb-2" style={{ color: "#C7CDD6" }}>
                {area.desc}
              </p>
              <p className="font-body text-xs leading-relaxed" style={{ color: "#9AA1AB" }}>
                <span className="font-mono" style={{ fontSize: "var(--text-label-sm)", letterSpacing: "0.14em", textTransform: "uppercase", color: "#6E7683" }}>
                  {whyLabel} ·{" "}
                </span>
                {area.why}
              </p>
              <p className="font-body text-xs leading-relaxed mt-1" style={{ color: "#F4F6F8" }}>
                <span className="font-mono" style={{ fontSize: "var(--text-label-sm)", letterSpacing: "0.14em", textTransform: "uppercase", color: "#6E7683" }}>
                  {solutionLabel} ·{" "}
                </span>
                {area.solution}
              </p>
              <div className="mt-4 pt-3 border-t" style={{ borderColor: "rgba(255,255,255,0.07)" }}>
                <button
                  onClick={() => onOpenForm(area.name)}
                  className="group inline-flex items-center gap-2 rounded-full px-4 py-2 font-mono text-label-fluid tracking-[0.14em] uppercase transition-all duration-300 cursor-pointer"
                  style={{ color: "#9AA1AB", border: "1px solid rgba(255,255,255,0.14)" }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = "var(--color-accent)";
                    e.currentTarget.style.borderColor = "var(--color-accent-border)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = "#9AA1AB";
                    e.currentTarget.style.borderColor = "rgba(255,255,255,0.14)";
                  }}
                >
                  {cardCta}
                  <svg
                    width="13"
                    height="13"
                    viewBox="0 0 16 16"
                    fill="none"
                    aria-hidden="true"
                    className="transition-transform duration-300 group-hover:translate-x-1"
                  >
                    <path d="M1 8h12m0 0L9 4m4 4l-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
              </div>
            </motion.li>
          ))}
        </ul>
      )}

      {/* Value preview + consultation form (objeví se po výběru příležitosti) */}
      <div ref={formRef}>
        <AnimatePresence mode="wait">
          {formOpen && (
            <motion.div
              key="form"
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
              className="rounded-xl p-5 sm:p-6"
              style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(251,191,36,0.25)" }}
            >
              {selectedOpportunity && (
                <p className="font-mono mb-4" style={{ fontSize: "var(--text-label)", letterSpacing: "0.16em", textTransform: "uppercase", color: "#FBBF24" }}>
                  {selectedOpportunity}
                </p>
              )}

              <p className="font-heading mb-1" style={{ fontSize: "var(--text-h4)", color: "#F4F6F8" }}>
                {previewTitle}
              </p>
              <ul className="flex flex-col gap-1.5 mb-6">
                {previewItems.map((item) => (
                  <li key={item} className="flex items-center gap-2.5 font-body text-sm" style={{ color: "#9AA1AB" }}>
                    <span aria-hidden="true" style={{ color: "#34D399" }}>✓</span>
                    {item}
                  </li>
                ))}
              </ul>

              <p className="font-heading mb-1" style={{ fontSize: "var(--text-h4)", color: "#F4F6F8" }}>
                {formT.title}
              </p>
              <p className="font-body text-xs leading-relaxed mb-5" style={{ color: "#9AA1AB" }}>
                {formT.subtitle}
              </p>

              <form onSubmit={onSubmit} className="flex flex-col gap-4" noValidate>
          <input
            type="text"
            name="_hp"
            tabIndex={-1}
            autoComplete="off"
            style={{ position: "absolute", left: "-9999px", opacity: 0, height: 0, width: 0 }}
            aria-hidden="true"
          />

          <FormField label={formT.name} required id="audit-name">
            <input
              id="audit-name"
              type="text"
              value={formValues.name}
              onChange={(e) => setFormValues((prev) => ({ ...prev, name: e.target.value }))}
              onFocus={focusUnderline}
              onBlur={blurUnderline}
              disabled={disabled}
              className="w-full text-sm outline-none transition-all duration-200"
              style={inputStyle}
            />
          </FormField>

          <FormField label={formT.company} required id="audit-company">
            <input
              id="audit-company"
              type="text"
              value={formValues.company}
              onChange={(e) => setFormValues((prev) => ({ ...prev, company: e.target.value }))}
              onFocus={focusUnderline}
              onBlur={blurUnderline}
              disabled={disabled}
              className="w-full text-sm outline-none transition-all duration-200"
              style={inputStyle}
            />
          </FormField>

          <FormField label={formT.email} required id="audit-email">
            <input
              id="audit-email"
              type="email"
              value={formValues.email}
              onChange={(e) => setFormValues((prev) => ({ ...prev, email: e.target.value }))}
              onFocus={focusUnderline}
              onBlur={blurUnderline}
              disabled={disabled}
              className="w-full text-sm outline-none transition-all duration-200"
              style={inputStyle}
            />
          </FormField>

          <div className="grid gap-4 sm:grid-cols-2">
            <FormField label={formT.website} id="audit-website">
              <input
                id="audit-website"
                type="text"
                value={formValues.website}
                onChange={(e) => setFormValues((prev) => ({ ...prev, website: e.target.value }))}
                onFocus={focusUnderline}
                onBlur={blurUnderline}
                disabled={disabled}
                className="w-full text-sm outline-none transition-all duration-200"
                style={inputStyle}
              />
            </FormField>

            <FormField label={formT.size} id="audit-size">
              <select
                id="audit-size"
                value={formValues.sizeId}
                onChange={(e) => setFormValues((prev) => ({ ...prev, sizeId: e.target.value }))}
                onFocus={focusUnderline}
                onBlur={blurUnderline}
                disabled={disabled}
                className="w-full text-sm outline-none transition-all duration-200 bg-transparent"
                style={{ ...inputStyle, color: formValues.sizeId ? "#F4F6F8" : "rgba(244,246,248,0.4)" }}
              >
                <option value="" style={{ background: "#17181D", color: "rgba(244,246,248,0.4)" }}>
                  —
                </option>
                {sizeOptions.map((o) => (
                  <option key={o.id} value={o.id} style={{ background: "#17181D", color: "#F4F6F8" }}>
                    {o.label}
                  </option>
                ))}
              </select>
            </FormField>
          </div>

          <FormField label={formT.challenge} id="audit-challenge">
            <textarea
              id="audit-challenge"
              value={formValues.challenge}
              onChange={(e) => setFormValues((prev) => ({ ...prev, challenge: e.target.value }))}
              onFocus={focusUnderline}
              onBlur={blurUnderline}
              disabled={disabled}
              rows={2}
              className="w-full text-sm outline-none transition-all duration-200 resize-vertical"
              style={{ ...inputStyle, lineHeight: "var(--leading-body)" }}
            />
          </FormField>

          {formError && (
            <p role="alert" className="font-body text-xs" style={{ color: "#F87171" }}>
              {formError}
            </p>
          )}

          <button
            type="submit"
            disabled={!canSubmit || disabled}
            className="inline-flex items-center justify-center gap-2 rounded-full px-6 py-3.5 text-sm font-medium transition-all duration-300 mt-1"
            style={{
              background: canSubmit && !disabled ? "var(--color-accent)" : "rgba(255,255,255,0.06)",
              color: canSubmit && !disabled ? "#0A0A0B" : "rgba(244,246,248,0.3)",
              cursor: canSubmit && !disabled ? "pointer" : "default",
              scale: "1",
            }}
            onMouseEnter={(e) => {
              if (canSubmit && !disabled) e.currentTarget.style.boxShadow = "0 0 32px var(--color-accent-glow)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.boxShadow = "none";
              e.currentTarget.style.scale = "1";
            }}
            onMouseDown={(e) => {
              if (canSubmit && !disabled) e.currentTarget.style.scale = "0.97";
            }}
            onMouseUp={(e) => {
              e.currentTarget.style.scale = "1";
            }}
          >
            {disabled ? formT.sending : formT.submit}
            {!disabled && (
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                <path d="M1 8h12m0 0L9 4m4 4l-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            )}
          </button>
        </form>

        <div className="mt-5">
          <button
            onClick={onRestart}
            className="font-mono text-label tracking-[0.16em] uppercase transition-colors duration-200 cursor-pointer"
            style={{ color: "#6E7683" }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = "#F4F6F8";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = "#6E7683";
            }}
          >
            ↺ {restartLabel}
          </button>
        </div>
              </motion.div>
            )}
        </AnimatePresence>
      </div>
    </div>
  );
}

const inputStyle: React.CSSProperties = {
  background: "transparent",
  border: "none",
  borderBottom: "1px solid rgba(255,255,255,0.12)",
  color: "#F4F6F8",
  padding: "8px 0",
};

/** Zvýraznění spodní linky pole při fokusu. */
function focusUnderline(e: React.FocusEvent<HTMLElement>): void {
  e.currentTarget.style.borderBottomColor = "rgba(251,191,36,0.7)";
}

function blurUnderline(e: React.FocusEvent<HTMLElement>): void {
  e.currentTarget.style.borderBottomColor = "rgba(255,255,255,0.12)";
}

function FormField({ label, required, id, children }: { label: string; required?: boolean; id: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1">
      <label htmlFor={id} className="font-mono" style={{ fontSize: "var(--text-label)", letterSpacing: "0.14em", textTransform: "uppercase", color: "#6E7683" }}>
        {label}
        {required && <span style={{ color: "#FBBF24" }}> *</span>}
      </label>
      {children}
    </div>
  );
}
