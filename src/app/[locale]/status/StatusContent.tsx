"use client";

import { useState, useEffect } from "react";
import type { Locale } from "@/lib/types";
import { t, formatTimestamp, msToHuman } from "@/lib/utils";
import PageTransition from "@/components/PageTransition";

interface Props {
  locale: Locale;
}

function randLatency(): string {
  return msToHuman(12 + Math.random() * 240);
}

function randCalls(): number {
  return Math.floor(40 + Math.random() * 160);
}

function randDuration(): string {
  const s = Math.floor(60 + Math.random() * 240);
  const m = Math.floor(s / 60);
  const sec = s % 60;
  return `${m}:${sec.toString().padStart(2, "0")}`;
}

const statusItems = [
  { label: "AI Core", status: "operational", uptime: "99.97%" },
  { label: "Voice Engine", status: "operational", uptime: "99.99%" },
  { label: "Booking System", status: "operational", uptime: "99.95%" },
  { label: "SMS Gateway", status: "operational", uptime: "99.92%" },
  { label: "WhatsApp Bridge", status: "operational", uptime: "99.98%" },
  { label: "Calendar Sync", status: "operational", uptime: "99.94%" },
  { label: "Analytics Pipeline", status: "operational", uptime: "99.88%" },
  { label: "Web Chat", status: "operational", uptime: "99.99%" },
  { label: "API Gateway", status: "operational", uptime: "99.96%" },
  { label: "CDN Edge", status: "operational", uptime: "100%" },
];

export default function StatusContent({ locale }: Props) {
  const [time, setTime] = useState("");
  const [latency, setLatency] = useState("42ms");
  const [calls, setCalls] = useState(87);
  const [avgDur, setAvgDur] = useState("2:34");

  useEffect(() => {
    const update = () => setTime(formatTimestamp(new Date()));
    update();
    const t1 = setInterval(update, 1000);
    const t2 = setInterval(() => {
      setLatency(randLatency());
      setCalls(randCalls());
      setAvgDur(randDuration());
    }, 3000);
    return () => { clearInterval(t1); clearInterval(t2); };
  }, []);

  const metrics = [
    { label: "Active Calls", value: `${calls}` },
    { label: "Avg Duration", value: avgDur },
    { label: "Avg Latency", value: latency },
    { label: "Active Nodes", value: "12" },
    { label: "Queued", value: "3" },
    { label: "Peak Today", value: "1,247" },
  ];

  return (
    <PageTransition>
      <section className="relative w-full pt-[clamp(140px,20vh,200px)] pb-24 px-[clamp(24px,5vw,64px)] min-h-screen">
        <div className="mx-auto relative z-10" style={{ maxWidth: "1100px" }}>
          <div className="text-center mb-16">
            <div
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full mb-8 transition-all duration-300"
              style={{
                background: "rgba(0,194,255,0.06)",
                border: "1px solid rgba(0,194,255,0.1)",
                color: "rgba(0,194,255,0.5)",
              }}
              onMouseEnter={(e) => { e.currentTarget.style.borderColor = "rgba(0,194,255,0.25)"; e.currentTarget.style.background = "rgba(0,194,255,0.1)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = "rgba(0,194,255,0.1)"; e.currentTarget.style.background = "rgba(0,194,255,0.06)"; }}
            >
              <span
                className="w-1.5 h-1.5 rounded-full"
                style={{
                  background: "#00C2FF",
                  animation: "pulse-dot 2.8s ease-in-out infinite",
                  boxShadow: "0 0 0 3px rgba(0,194,255,0.12)",
                }}
              />
              <span className="font-body text-[10px] tracking-[0.08em]">{t(locale, "status.badge")}</span>
            </div>

            <h1
              className="font-heading mb-6"
              style={{
                fontSize: "clamp(36px, 6vw, 80px)",
                lineHeight: 1.05,
                fontWeight: 500,
              }}
              dangerouslySetInnerHTML={{ __html: t(locale, "status.title") }}
            />

            <p
              className="font-body text-[clamp(15px,1.2vw,17px)] leading-relaxed max-w-[48ch] mx-auto"
              style={{ color: "#B7BCC7" }}
            >
              {t(locale, "status.subtitle")}
            </p>

            <div className="mt-6 font-body text-[10px] tracking-[0.08em]" style={{ color: "rgba(0,194,255,0.25)" }}>
              sync: {time}
            </div>
          </div>

          <div
            className="grid gap-6 mb-16"
            style={{
              gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))",
            }}
          >
            {metrics.map((m, i) => (
              <div key={i} className="text-center">
                <div
                  className="font-heading text-[clamp(28px,3vw,40px)] font-medium leading-none mb-1 transition-all duration-300"
                  style={{ fontVariantNumeric: "tabular-nums" }}
                  onMouseEnter={(e) => { e.currentTarget.style.textShadow = "0 0 20px rgba(0,194,255,0.1)"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.textShadow = "none"; }}
                >
                  {m.value}
                </div>
                <div
                  className="font-body text-[10px] tracking-[0.06em] transition-all duration-300"
                  style={{ color: "rgba(0,194,255,0.35)" }}
                  onMouseEnter={(e) => { e.currentTarget.style.color = "rgba(0,194,255,0.55)"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.color = "rgba(0,194,255,0.35)"; }}
                >
                  {m.label}
                </div>
              </div>
            ))}
          </div>

          <div className="mb-4">
            <span
              className="font-body text-[10px] tracking-[0.2em] uppercase transition-all duration-300"
              style={{ color: "rgba(0,194,255,0.25)" }}
              onMouseEnter={(e) => { e.currentTarget.style.color = "rgba(0,194,255,0.45)"; e.currentTarget.style.textShadow = "0 0 12px rgba(0,194,255,0.1)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.color = "rgba(0,194,255,0.25)"; e.currentTarget.style.textShadow = "none"; }}
            >
              &mdash; system health
            </span>
          </div>

          <div
            className="flex flex-col gap-4"
          >
            {statusItems.map((item, i) => (
              <div
                key={i}
                className="flex items-center justify-between"
              >
                <div>
                  <div
                    className="font-body text-[13px] font-medium tracking-[-0.01em] transition-all duration-300"
                    onMouseEnter={(e) => { e.currentTarget.style.textShadow = "0 0 12px rgba(0,194,255,0.1)"; }}
                    onMouseLeave={(e) => { e.currentTarget.style.textShadow = "none"; }}
                  >
                    {item.label}
                  </div>
                  <div className="font-body text-[10px] mt-0.5" style={{ color: "rgba(126,132,146,0.65)" }}>
                    uptime {item.uptime}
                  </div>
                </div>
                <div className="flex items-center gap-1.5">
                  <span
                    className="w-1.5 h-1.5 rounded-full"
                    style={{
                      background: "#00C2FF",
                      animation: "pulse-dot 2.8s ease-in-out infinite",
                      boxShadow: "0 0 0 3px rgba(0,194,255,0.1)",
                    }}
                  />
                  <span
                    className="font-body text-[11px] tracking-[0.04em] transition-all duration-300"
                    style={{ color: "rgba(0,194,255,0.45)" }}
                    onMouseEnter={(e) => { e.currentTarget.style.color = "rgba(0,194,255,0.65)"; }}
                    onMouseLeave={(e) => { e.currentTarget.style.color = "rgba(0,194,255,0.45)"; }}
                  >
                    {item.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </PageTransition>
  );
}
