"use client";

import { forwardRef } from "react";

interface SafariFrameProps {
  url: string;
  title?: string;
  children?: React.ReactNode;
}

const SafariFrame = forwardRef<HTMLDivElement, SafariFrameProps>(
  ({ url, title, children }, ref) => {
    return (
      <div
        ref={ref}
        style={{
          width: "100%",
          maxWidth: "1100px",
          borderRadius: "12px",
          overflow: "hidden",
          background: "rgba(22,22,22,0.92)",
          border: "1px solid rgba(255,255,255,0.06)",
          boxShadow:
            "0 0 0 1px rgba(0,0,0,0.2), 0 32px 80px -12px rgba(0,0,0,0.5), 0 8px 24px -4px rgba(0,0,0,0.3)",
          willChange: "opacity, transform",
        }}
      >
        {/* ── Chrome bar ──────────────────────────────────────────── */}
        <div
          style={{
            height: "36px",
            display: "flex",
            alignItems: "center",
            padding: "0 14px",
            gap: "10px",
            background:
              "linear-gradient(180deg, rgba(50,50,50,0.6) 0%, rgba(38,38,38,0.6) 100%)",
            borderBottom: "1px solid rgba(255,255,255,0.04)",
            backdropFilter: "blur(8px)",
            WebkitBackdropFilter: "blur(8px)",
          }}
        >
          {/* Traffic lights */}
          <div style={{ display: "flex", gap: "6px", flexShrink: 0 }}>
            <span
              style={{
                width: "10px",
                height: "10px",
                borderRadius: "50%",
                background: "rgba(255,95,86,0.75)",
                border: "0.5px solid rgba(0,0,0,0.12)",
              }}
            />
            <span
              style={{
                width: "10px",
                height: "10px",
                borderRadius: "50%",
                background: "rgba(255,189,46,0.75)",
                border: "0.5px solid rgba(0,0,0,0.12)",
              }}
            />
            <span
              style={{
                width: "10px",
                height: "10px",
                borderRadius: "50%",
                background: "rgba(39,201,63,0.75)",
                border: "0.5px solid rgba(0,0,0,0.12)",
              }}
            />
          </div>

          {/* URL bar */}
          <div
            style={{
              flex: 1,
              height: "22px",
              borderRadius: "5px",
              background: "rgba(0,0,0,0.25)",
              border: "1px solid rgba(255,255,255,0.04)",
              display: "flex",
              alignItems: "center",
              padding: "0 8px",
              overflow: "hidden",
            }}
          >
            <span
              style={{
                fontSize: "11px",
                fontFamily: '"Inter", system-ui, sans-serif',
                color: "rgba(255,255,255,0.35)",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
                letterSpacing: "0.01em",
              }}
            >
              {url}
            </span>
          </div>

          {/* Spacer to balance traffic lights width */}
          <div style={{ width: "54px", flexShrink: 0 }} />
        </div>

        {/* ── Viewport ────────────────────────────────────────────── */}
        <div
          style={{
            position: "relative",
            width: "100%",
            aspectRatio: "16 / 10",
            overflow: "hidden",
            background: "#0a0a0a",
          }}
        >
          {children}

          {/* Title overlay at bottom */}
          {title && (
            <div
              style={{
                position: "absolute",
                bottom: 0,
                left: 0,
                right: 0,
                padding: "40px 24px 16px",
                background:
                  "linear-gradient(to top, rgba(0,0,0,0.65) 0%, transparent 100%)",
                pointerEvents: "none",
              }}
            >
              <span
                style={{
                  fontSize: "10px",
                  fontFamily: '"Inter", system-ui, sans-serif',
                  fontWeight: 500,
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                  color: "rgba(255,255,255,0.45)",
                }}
              >
                {title}
              </span>
            </div>
          )}
        </div>
      </div>
    );
  },
);

SafariFrame.displayName = "SafariFrame";

export default SafariFrame;
