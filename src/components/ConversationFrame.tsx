"use client";

import { colors, typography } from "@/design/tokens";

interface Props {
  accent: string;
}

export default function ConversationFrame({ accent }: Props) {
  return (
    <div
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
          AI Receptionist — Live Conversation
        </span>
        <div style={{ flex: 1 }} />
        <span
          style={{
            fontSize: "10px",
            fontFamily: typography.fontFamily.body,
            color: accent,
            letterSpacing: "0.02em",
            display: "flex",
            alignItems: "center",
            gap: "4px",
          }}
        >
          <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: accent }} />
          Online
        </span>
      </div>

      {/* ── Chat area ─────────────────────────────────────────────── */}
      <div
        style={{
          flex: 1,
          height: "clamp(300px, 40vw, 520px)",
          padding: "clamp(16px, 2.5vw, 28px) clamp(20px, 3vw, 36px)",
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-end",
          gap: "clamp(10px, 1.5vw, 16px)",
        }}
      >
        {/* Visitor message */}
        <div
          style={{
            alignSelf: "flex-end",
            maxWidth: "70%",
            padding: "clamp(8px, 1.2vw, 12px) clamp(12px, 1.6vw, 16px)",
            borderRadius: "12px 12px 2px 12px",
            background: accent,
            color: "#0a0a0a",
            fontSize: "clamp(12px, 1vw, 14px)",
            fontFamily: typography.fontFamily.body,
            lineHeight: "1.5",
          }}
        >
          Hey, I have a reservation under Martin Novák for tonight at 8.
        </div>

        {/* AI response */}
        <div
          style={{
            alignSelf: "flex-start",
            maxWidth: "70%",
            padding: "clamp(8px, 1.2vw, 12px) clamp(12px, 1.6vw, 16px)",
            borderRadius: "12px 12px 12px 2px",
            background: "rgba(255,255,255,0.06)",
            border: "1px solid rgba(255,255,255,0.04)",
            color: "rgba(255,255,255,0.7)",
            fontSize: "clamp(12px, 1vw, 14px)",
            fontFamily: typography.fontFamily.body,
            lineHeight: "1.5",
          }}
        >
          Of course, Martin. I can see your reservation for two at 8 PM — window table.
          We have your usual still water ready. Would you like to add anything to your order before you arrive?
        </div>

        {/* Visitor typing indicator */}
        <div
          style={{
            alignSelf: "flex-end",
            maxWidth: "70%",
            padding: "clamp(8px, 1.2vw, 12px) clamp(12px, 1.6vw, 16px)",
            borderRadius: "12px 12px 2px 12px",
            background: accent,
            display: "flex",
            gap: "4px",
            alignItems: "center",
          }}
        >
          <span style={{ width: "5px", height: "5px", borderRadius: "50%", background: "rgba(0,0,0,0.4)" }} />
          <span style={{ width: "5px", height: "5px", borderRadius: "50%", background: "rgba(0,0,0,0.3)" }} />
          <span style={{ width: "5px", height: "5px", borderRadius: "50%", background: "rgba(0,0,0,0.2)" }} />
        </div>
      </div>

      {/* ── Input bar ─────────────────────────────────────────────── */}
      <div
        style={{
          padding: "clamp(10px, 1.2vw, 14px) clamp(16px, 2vw, 24px)",
          borderTop: "1px solid rgba(255,255,255,0.04)",
          display: "flex",
          alignItems: "center",
          gap: "10px",
        }}
      >
        <div
          style={{
            flex: 1,
            height: "clamp(32px, 3vw, 40px)",
            borderRadius: "8px",
            background: "rgba(255,255,255,0.04)",
            border: "1px solid rgba(255,255,255,0.06)",
            display: "flex",
            alignItems: "center",
            padding: "0 clamp(10px, 1.2vw, 14px)",
          }}
        >
          <span
            style={{
              fontSize: "clamp(11px, 0.9vw, 13px)",
              fontFamily: typography.fontFamily.body,
              color: "rgba(255,255,255,0.2)",
            }}
          >
            Type a message…
          </span>
        </div>
        <div
          style={{
            width: "clamp(32px, 3vw, 40px)",
            height: "clamp(32px, 3vw, 40px)",
            borderRadius: "8px",
            background: accent,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#0a0a0a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="22" y1="2" x2="11" y2="13" />
            <polygon points="22 2 15 22 11 13 2 9 22 2" />
          </svg>
        </div>
      </div>
    </div>
  );
}
