"use client";

import { useRef } from "react";
import { motion } from "framer-motion";
import { useParallax } from "@/lib/scroll";
import { stagger, fadeUp } from "@/lib/motion";
import SectionHeader from "@/components/lab/SectionHeader";
import type { Locale } from "@/lib/types";
import { getPage } from "@/content/repository";
import StatusPill from "@/components/lab/StatusPill";

interface ControlRoomSectionProps {
  locale: Locale;
}

export default function ControlRoomSection({ locale }: ControlRoomSectionProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const data = getPage("home")?.data.controlRoom;
  const title = data?.title[locale] ?? "";
  const subtitle = data?.subtitle[locale] ?? "";
  const systems = (data?.systems ?? []).map((s) => ({
    name: s.name[locale],
    status: s.status,
  }));
  const models = data?.models[locale] ?? [];
  const modules = (data?.modules ?? []).map((m) => ({
    label: m.label[locale],
    desc: m.desc[locale],
  }));

  const y = useParallax(sectionRef, 30, -30);
  const bgY = useParallax(sectionRef, 80, -80);

  return (
    <section
      id="control-room"
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
            "radial-gradient(ellipse 70% 50% at 50% 60%, rgba(255,74,46,0.05) 0%, transparent 65%)",
        }}
      />
      <motion.div style={{ y, maxWidth: "1200px" }} className="relative z-10 mx-auto">
        <SectionHeader eyebrow="/ 09" eyebrowColor="#FF4A2E" title={title} subtitle={subtitle} />

        <motion.div
          className="grid gap-5 sm:gap-6 lg:grid-cols-12"
          variants={stagger}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
        >
          {/* Active systems */}
          <motion.div
            variants={fadeUp}
            className="lg:col-span-7 rounded-2xl p-6 sm:p-8 relative overflow-hidden"
            style={{
              background: "#121316",
              border: "1px solid rgba(255,255,255,0.08)",
            }}
          >
            <span
              aria-hidden="true"
              className="scan-line"
              style={{
                background:
                  "linear-gradient(90deg, transparent, rgba(255,74,46,0.25), transparent)",
              }}
            />
            <PanelHeader
              label={locale === "cs" ? "Přehled systémů" : "Systems overview"}
              status="online"
            />
            <ul className="flex flex-col">
              {systems.map((system) => (
                <li
                  key={system.name}
                  className="flex items-center justify-between gap-4 py-3.5 border-t"
                  style={{ borderColor: "rgba(255,255,255,0.07)" }}
                >
                  <span className="flex items-center gap-3 font-mono" style={{ fontSize: "var(--text-small)", color: "#C7CDD6" }}>
                    <span
                      aria-hidden="true"
                      className="inline-block w-1.5 h-1.5 rounded-full flex-shrink-0"
                      style={{
                        background:
                          system.status === "Production"
                            ? "#34D399"
                            : system.status === "Beta"
                            ? "#FF6B3D"
                            : system.status === "Testing"
                            ? "#FBBF24"
                            : system.status === "Building"
                            ? "#F472B6"
                            : "#9AA1AB",
                        animation: "pulse-dot 2.4s ease-in-out infinite",
                      }}
                    />
                    {system.name}
                  </span>
                  <StatusPill status={system.status} locale={locale} />
                </li>
              ))}
            </ul>
            <div
              className="flex flex-wrap items-center gap-x-5 gap-y-2 mt-5 pt-4 border-t"
              style={{ borderColor: "rgba(255,255,255,0.07)" }}
            >
              {[
                { label: locale === "cs" ? "V provozu" : "Production", color: "#34D399" },
                { label: locale === "cs" ? "Beta" : "Beta", color: "#FF6B3D" },
                { label: locale === "cs" ? "Testování" : "Testing", color: "#FBBF24" },
                { label: locale === "cs" ? "Ve vývoji" : "Building", color: "#F472B6" },
              ].map((s) => (
                <span key={s.label} className="flex items-center gap-1.5 font-mono" style={{ fontSize: "var(--text-label-sm)", letterSpacing: "0.14em", textTransform: "uppercase", color: "#6E7683" }}>
                  <span aria-hidden="true" className="inline-block w-1.5 h-1.5 rounded-full" style={{ background: s.color }} />
                  {s.label}
                </span>
              ))}
            </div>
          </motion.div>

          {/* Models */}
          <motion.div
            variants={fadeUp}
            className="lg:col-span-5 rounded-2xl p-6 sm:p-8"
            style={{
              background: "#121316",
              border: "1px solid rgba(255,255,255,0.08)",
            }}
          >
            <PanelHeader
              label={locale === "cs" ? "Technologie" : "Technology"}
              status="active"
            />
            <ul className="flex flex-col gap-2.5 mt-2">
              {models.map((model) => (
                <li
                  key={model}
                  className="flex items-center gap-3 rounded-xl px-4 py-3"
                  style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}
                >
                  <span
                    aria-hidden="true"
                    className="inline-block w-1 h-1 rounded-full flex-shrink-0"
                    style={{ background: "var(--color-accent)" }}
                  />
                  <span className="font-mono" style={{ fontSize: "var(--text-small)", color: "#C7CDD6" }}>
                    {model}
                  </span>
                </li>
              ))}
            </ul>
          </motion.div>
        </motion.div>

        {/* Architecture modules */}
        <motion.div
          className="mt-5 sm:mt-6 rounded-2xl p-6 sm:p-8"
          style={{
            background: "rgba(255,255,255,0.02)",
            border: "1px solid rgba(255,255,255,0.08)",
          }}
          variants={fadeUp}
        >
          <PanelHeader label={locale === "cs" ? "Architektonické moduly" : "Architecture modules"} status="ready" />
          <div
            className="grid gap-4 mt-6"
            style={{ gridTemplateColumns: "repeat(auto-fit, minmax(min(200px, 100%), 1fr))" }}
          >
            {modules.map((module) => (
              <div
                key={module.label}
                className="rounded-xl p-4"
                style={{
                  background: "#17181D",
                  border: "1px solid rgba(255,255,255,0.07)",
                  transition: "border-color 0.3s ease",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.borderColor = "var(--color-accent-border)")}
                onMouseLeave={(e) => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.07)")}
              >
                <p className="font-heading text-sm mb-1" style={{ color: "#F4F6F8" }}>
                  {module.label}
                </p>
                <p className="font-body text-xs leading-relaxed" style={{ color: "#6E7683" }}>
                  {module.desc}
                </p>
              </div>
            ))}
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}

function PanelHeader({ label, status }: { label: string; status: string }) {
  const color = status === "online" ? "#34D399" : status === "active" ? "var(--color-accent)" : "#9AA1AB";
  return (
    <div className="flex items-center justify-between gap-4 mb-4">
      <span
        className="font-mono"
        style={{ fontSize: "var(--text-label)", letterSpacing: "0.2em", textTransform: "uppercase", color: "#9AA1AB" }}
      >
        {label}
      </span>
      <span className="flex items-center gap-1.5 font-mono" style={{ fontSize: "var(--text-label-sm)", letterSpacing: "0.16em", textTransform: "uppercase", color }}>
        <span
          aria-hidden="true"
          className="inline-block w-1.5 h-1.5 rounded-full"
          style={{ background: color, animation: "pulse-dot 2s ease-in-out infinite" }}
        />
        {status}
      </span>
    </div>
  );
}
