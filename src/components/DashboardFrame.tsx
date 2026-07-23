"use client";

import { useEffect, useRef } from "react";
import { colors, typography } from "@/design/tokens";

interface Props {
  accent: string;
  microProgress?: number;
}

function microElementProgress(
  micro: number,
  start: number,
  duration: number,
): number {
  const t = Math.max(0, Math.min(1, (micro - start) / duration));
  return t * t * (3 - 2 * t);
}

export default function DashboardFrame({ accent }: Props) {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    let prev = -1;

    const tick = () => {
      const raw = getComputedStyle(root).getPropertyValue("--micro").trim();
      const micro = parseFloat(raw) || 0;
      if (micro === prev) {
        requestAnimationFrame(tick);
        return;
      }
      prev = micro;

      // ── Phase 1: Lead discovery (0.0 → 0.15) ──
      const leadProgress = microElementProgress(micro, 0.0, 0.15);
      const leadEl = root.querySelector<HTMLElement>("[data-micro='lead']");
      if (leadEl) {
        leadEl.style.opacity = String(leadProgress);
        leadEl.style.transform = `translateY(${8 * (1 - leadProgress)}px)`;
      }

      // ── Phase 2: Evidence collection (0.15 → 0.45) ──
      const evidence1 = microElementProgress(micro, 0.15, 0.25);
      const evidence2 = microElementProgress(micro, 0.25, 0.35);
      const evidence3 = microElementProgress(micro, 0.35, 0.45);

      const ev1El = root.querySelector<HTMLElement>("[data-micro='evidence-1']");
      const ev2El = root.querySelector<HTMLElement>("[data-micro='evidence-2']");
      const ev3El = root.querySelector<HTMLElement>("[data-micro='evidence-3']");
      const reasoningEl = root.querySelector<HTMLElement>("[data-micro='reasoning']");

      // Evidence fades out during phase 3 (0.45 → 0.55)
      const evidenceFadeOut = microElementProgress(micro, 0.45, 0.55);

      if (ev1El) {
        ev1El.style.opacity = String(evidence1 * (1 - evidenceFadeOut));
        ev1El.style.transform = `translateY(${6 * (1 - evidence1)}px)`;
      }
      if (ev2El) {
        ev2El.style.opacity = String(evidence2 * (1 - evidenceFadeOut));
        ev2El.style.transform = `translateY(${6 * (1 - evidence2)}px)`;
      }
      if (ev3El) {
        ev3El.style.opacity = String(evidence3 * (1 - evidenceFadeOut));
        ev3El.style.transform = `translateY(${6 * (1 - evidence3)}px)`;
      }
      if (reasoningEl) {
        reasoningEl.style.opacity = String(evidence3 * (1 - evidenceFadeOut));
        reasoningEl.style.transform = `translateY(${6 * (1 - evidence3)}px)`;
      }

      // ── Phase 3: Recommendation (0.55 → 0.70) ──
      const analysisProgress = microElementProgress(micro, 0.55, 0.70);
      const analysisEl = root.querySelector<HTMLElement>("[data-micro='analysis']");
      if (analysisEl) {
        analysisEl.style.opacity = String(analysisProgress);
        analysisEl.style.transform = `translateY(${8 * (1 - analysisProgress)}px)`;
      }

      // ── Phase 4: Ready (0.65 → 0.85) ──
      const readyProgress = microElementProgress(micro, 0.65, 0.85);
      const badgeEl = root.querySelector<HTMLElement>("[data-micro='badge']");
      if (badgeEl) {
        badgeEl.style.opacity = String(0.2 + 0.8 * readyProgress);
        badgeEl.style.background = `rgba(39,201,63,${0.12 + 0.12 * readyProgress})`;
        badgeEl.style.color = `rgba(39,201,63,${0.7 + 0.3 * readyProgress})`;
      }

      // ── Status text progression ──
      const statusEl = root.querySelector<HTMLElement>("[data-micro='status']");
      if (statusEl) {
        if (micro < 0.15) {
          statusEl.textContent = "Scanning";
        } else if (micro < 0.45) {
          statusEl.textContent = "Collecting";
        } else if (micro < 0.65) {
          statusEl.textContent = "Analyzing";
        } else {
          statusEl.textContent = "Qualified";
        }
      }

      requestAnimationFrame(tick);
    };

    const raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <div
      ref={rootRef}
      style={{
        width: "100%",
        maxWidth: "1100px",
        borderRadius: "12px",
        overflow: "hidden",
        background: "#0d0d0d",
        border: "1px solid rgba(255,255,255,0.06)",
        boxShadow:
          "0 0 0 1px rgba(0,0,0,0.2), 0 32px 80px -12px rgba(0,0,0,0.5), 0 8px 24px -4px rgba(0,0,0,0.3)",
        display: "flex",
        flexDirection: "column",
        willChange: "opacity, transform",
      }}
    >
      {/* ── Title bar ─────────────────────────────────────────────── */}
      <div
        style={{
          height: "36px",
          display: "flex",
          alignItems: "center",
          padding: "0 14px",
          gap: "10px",
          background: "rgba(30,30,30,0.8)",
          borderBottom: "1px solid rgba(255,255,255,0.04)",
        }}
      >
        <div style={{ display: "flex", gap: "6px", flexShrink: 0 }}>
          <span style={{ width: "10px", height: "10px", borderRadius: "50%", background: "rgba(255,95,86,0.75)" }} />
          <span style={{ width: "10px", height: "10px", borderRadius: "50%", background: "rgba(255,189,46,0.75)" }} />
          <span style={{ width: "10px", height: "10px", borderRadius: "50%", background: "rgba(39,201,63,0.75)" }} />
        </div>
        <span
          style={{
            fontSize: "11px",
            fontFamily: typography.fontFamily.body,
            color: "rgba(255,255,255,0.3)",
            letterSpacing: "0.01em",
          }}
        >
          Cortex — Internal Dashboard
        </span>
      </div>

      {/* ── Content ───────────────────────────────────────────────── */}
      <div
        style={{
          display: "flex",
          height: "clamp(300px, 40vw, 520px)",
        }}
      >
        {/* Sidebar */}
        <div
          style={{
            width: "clamp(140px, 16vw, 200px)",
            background: "rgba(18,18,18,0.6)",
            borderRight: "1px solid rgba(255,255,255,0.04)",
            padding: "clamp(12px, 2vw, 20px) clamp(10px, 1.5vw, 16px)",
            display: "flex",
            flexDirection: "column",
            gap: "clamp(6px, 1vw, 10px)",
            flexShrink: 0,
          }}
        >
          {["Dashboard", "Pipeline", "Leads", "Analytics", "Settings"].map((item, i) => (
            <div
              key={item}
              style={{
                padding: "clamp(6px, 0.8vw, 10px) clamp(8px, 1vw, 12px)",
                borderRadius: "6px",
                background: i === 1 ? accent : "transparent",
                fontSize: "clamp(11px, 1vw, 13px)",
                fontFamily: typography.fontFamily.body,
                color: i === 1 ? colors.primary : "rgba(255,255,255,0.35)",
                letterSpacing: "0.01em",
              }}
            >
              {item}
            </div>
          ))}
        </div>

        {/* Main area */}
        <div
          style={{
            flex: 1,
            padding: "clamp(16px, 2.5vw, 28px)",
            display: "flex",
            flexDirection: "column",
            gap: "clamp(12px, 2vw, 20px)",
          }}
        >
          {/* Stats row */}
          <div style={{ display: "flex", gap: "clamp(10px, 1.5vw, 16px)" }}>
            {/* Stat 1: Leads today */}
            <div
              style={{
                flex: 1,
                padding: "clamp(10px, 1.5vw, 16px)",
                background: "rgba(255,255,255,0.03)",
                borderRadius: "8px",
                border: "1px solid rgba(255,255,255,0.04)",
              }}
            >
              <div
                style={{
                  fontSize: "clamp(18px, 2.5vw, 28px)",
                  fontFamily: typography.fontFamily.heading,
                  fontWeight: typography.weight.medium,
                  color: colors.primary,
                  letterSpacing: typography.letterSpacing.tight,
                }}
              >
                47
              </div>
              <div
                style={{
                  fontSize: "clamp(9px, 0.8vw, 11px)",
                  fontFamily: typography.fontFamily.body,
                  color: "rgba(255,255,255,0.3)",
                  marginTop: "2px",
                  letterSpacing: "0.02em",
                }}
              >
                Leads today
              </div>
            </div>

            {/* Stat 2: Qualified */}
            <div
              style={{
                flex: 1,
                padding: "clamp(10px, 1.5vw, 16px)",
                background: "rgba(255,255,255,0.03)",
                borderRadius: "8px",
                border: "1px solid rgba(255,255,255,0.04)",
              }}
            >
              <div
                style={{
                  fontSize: "clamp(18px, 2.5vw, 28px)",
                  fontFamily: typography.fontFamily.heading,
                  fontWeight: typography.weight.medium,
                  color: colors.primary,
                  letterSpacing: typography.letterSpacing.tight,
                }}
              >
                12
              </div>
              <div
                style={{
                  fontSize: "clamp(9px, 0.8vw, 11px)",
                  fontFamily: typography.fontFamily.body,
                  color: "rgba(255,255,255,0.3)",
                  marginTop: "2px",
                  letterSpacing: "0.02em",
                }}
              >
                Qualified
              </div>
            </div>

            {/* Stat 3: Outreach sent */}
            <div
              style={{
                flex: 1,
                padding: "clamp(10px, 1.5vw, 16px)",
                background: "rgba(255,255,255,0.03)",
                borderRadius: "8px",
                border: "1px solid rgba(255,255,255,0.04)",
              }}
            >
              <div
                style={{
                  fontSize: "clamp(18px, 2.5vw, 28px)",
                  fontFamily: typography.fontFamily.heading,
                  fontWeight: typography.weight.medium,
                  color: colors.primary,
                  letterSpacing: typography.letterSpacing.tight,
                }}
              >
                8
              </div>
              <div
                style={{
                  fontSize: "clamp(9px, 0.8vw, 11px)",
                  fontFamily: typography.fontFamily.body,
                  color: "rgba(255,255,255,0.3)",
                  marginTop: "2px",
                  letterSpacing: "0.02em",
                }}
              >
                Outreach sent
              </div>
            </div>
          </div>

          {/* Table */}
          <div
            style={{
              flex: 1,
              borderRadius: "8px",
              border: "1px solid rgba(255,255,255,0.04)",
              overflow: "hidden",
            }}
          >
            {/* Header */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "2fr 1fr 1fr 1fr",
                padding: "clamp(8px, 1vw, 12px) clamp(12px, 1.5vw, 16px)",
                background: "rgba(255,255,255,0.02)",
                borderBottom: "1px solid rgba(255,255,255,0.04)",
                fontSize: "clamp(9px, 0.8vw, 11px)",
                fontFamily: typography.fontFamily.body,
                color: "rgba(255,255,255,0.3)",
                letterSpacing: "0.04em",
                textTransform: "uppercase",
              }}
            >
              <span>Company</span>
              <span>Score</span>
              <span>Status</span>
              <span>Last contact</span>
            </div>
            {/* Static rows */}
            {[
              { name: "TechFlow s.r.o.", score: "94", status: "Qualified", time: "2 min ago" },
              { name: "DataSync a.s.", score: "87", status: "Reviewing", time: "18 min ago" },
              { name: "CloudBase Ltd.", score: "82", status: "Outreach sent", time: "1 hr ago" },
              { name: "PixelForge", score: "76", status: "New", time: "3 hr ago" },
            ].map((row, i) => (
              <div
                key={row.name}
                style={{
                  display: "grid",
                  gridTemplateColumns: "2fr 1fr 1fr 1fr",
                  padding: "clamp(8px, 1vw, 12px) clamp(12px, 1.5vw, 16px)",
                  borderBottom: i < 3 ? "1px solid rgba(255,255,255,0.03)" : "none",
                  fontSize: "clamp(10px, 0.9vw, 12px)",
                  fontFamily: typography.fontFamily.body,
                  color: "rgba(255,255,255,0.5)",
                }}
              >
                <span style={{ color: "rgba(255,255,255,0.7)" }}>{row.name}</span>
                <span>{row.score}</span>
                <span>{row.status}</span>
                <span style={{ color: "rgba(255,255,255,0.3)" }}>{row.time}</span>
              </div>
            ))}
            {/* ── New pipeline row: appears during HOLD ── */}
            <div
              data-micro="lead"
              style={{
                opacity: 0,
                borderTop: "1px solid rgba(255,255,255,0.03)",
              }}
            >
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "2fr 1fr 1fr 1fr",
                  padding: "clamp(8px, 1vw, 12px) clamp(12px, 1.5vw, 16px)",
                  fontSize: "clamp(10px, 0.9vw, 12px)",
                  fontFamily: typography.fontFamily.body,
                  color: "rgba(255,255,255,0.5)",
                }}
              >
                <span style={{ color: "rgba(255,255,255,0.7)" }}>NovaTech s.r.o.</span>
                <span>71</span>
                <span>
                  <span
                    data-micro="badge"
                    style={{
                      display: "inline-block",
                      padding: "1px 6px",
                      borderRadius: "4px",
                      background: "rgba(255,255,255,0.04)",
                      color: "rgba(255,255,255,0.4)",
                    }}
                  >
                    <span data-micro="status">Scanning</span>
                  </span>
                </span>
                <span style={{ color: "rgba(255,255,255,0.3)" }}>Just now</span>
              </div>

              {/* Workflow panel: evidence → recommendation */}
              <div
                style={{
                  padding: "0 clamp(12px, 1.5vw, 16px) clamp(8px, 1vw, 14px)",
                  position: "relative",
                  minHeight: "clamp(40px, 5vw, 60px)",
                }}
              >
                {/* Evidence collection */}
                <div style={{ position: "absolute", top: 0, left: 0, right: 0 }}>
                  <div
                    data-micro="evidence-1"
                    style={{
                      fontSize: "clamp(9px, 0.75vw, 11px)",
                      fontFamily: typography.fontFamily.body,
                      color: "rgba(39,201,63,0.7)",
                      opacity: 0,
                      transform: "translateY(6px)",
                      marginBottom: "3px",
                    }}
                  >
                    ✓ Website analyzed
                  </div>
                  <div
                    data-micro="evidence-2"
                    style={{
                      fontSize: "clamp(9px, 0.75vw, 11px)",
                      fontFamily: typography.fontFamily.body,
                      color: "rgba(39,201,63,0.7)",
                      opacity: 0,
                      transform: "translateY(6px)",
                      marginBottom: "3px",
                    }}
                  >
                    ✓ No online booking
                  </div>
                  <div
                    data-micro="evidence-3"
                    style={{
                      fontSize: "clamp(9px, 0.75vw, 11px)",
                      fontFamily: typography.fontFamily.body,
                      color: "rgba(39,201,63,0.7)",
                      opacity: 0,
                      transform: "translateY(6px)",
                    }}
                  >
                    ✓ Phone is primary contact
                  </div>
                  <div
                    data-micro="reasoning"
                    style={{
                      fontSize: "clamp(9px, 0.75vw, 11px)",
                      fontFamily: typography.fontFamily.body,
                      fontStyle: "italic",
                      color: "rgba(255,255,255,0.45)",
                      opacity: 0,
                      transform: "translateY(6px)",
                      marginTop: "clamp(6px, 0.8vw, 10px)",
                    }}
                  >
                    Customers must call for every booking.
                  </div>
                </div>

                {/* AI recommendation */}
                <div
                  data-micro="analysis"
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    opacity: 0,
                    transform: "translateY(8px)",
                  }}
                >
                  <div
                    style={{
                      fontSize: "clamp(9px, 0.75vw, 11px)",
                      fontFamily: typography.fontFamily.body,
                      color: "rgba(255,255,255,0.3)",
                      marginBottom: "4px",
                    }}
                  >
                    Recommendation
                  </div>
                  <div
                    style={{
                      fontSize: "clamp(10px, 0.9vw, 12px)",
                      fontFamily: typography.fontFamily.body,
                      color: "rgba(120,140,255,0.9)",
                      fontWeight: typography.weight.medium,
                    }}
                  >
                    Offer AI Receptionist
                  </div>
                  <div
                    style={{
                      fontSize: "clamp(9px, 0.75vw, 11px)",
                      fontFamily: typography.fontFamily.body,
                      color: "rgba(255,255,255,0.3)",
                      marginTop: "2px",
                    }}
                  >
                    Confidence: 94%
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
