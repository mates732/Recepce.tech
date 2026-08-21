"use client";

interface StateNoticeProps {
  variant?: "empty" | "error";
  title?: string;
  message: string;
  actionLabel?: string;
  onAction?: () => void;
}

/**
 * Sjednocený stav pro prázdný obsah, načítací chyby a nedostupná data.
 * Uživatel nikdy neskončí na prázdné obrazovce — vždy vidí vysvětlení
 * a případně akci (retry).
 */
export default function StateNotice({
  variant = "empty",
  title,
  message,
  actionLabel,
  onAction,
}: StateNoticeProps) {
  const isError = variant === "error";

  return (
    <div
      className="flex flex-col items-center justify-center text-center rounded-2xl"
      style={{
        padding: "clamp(32px, 6vw, 64px)",
        background: "#121316",
        border: `1px solid ${isError ? "rgba(248,113,113,0.15)" : "rgba(255,255,255,0.06)"}`,
      }}
    >
      <span
        className="font-mono text-label font-semibold tracking-[0.15em] uppercase mb-4 flex items-center justify-center w-8 h-8 rounded-full"
        style={{
          background: isError ? "rgba(248,113,113,0.08)" : "rgba(255,255,255,0.05)",
          color: isError ? "var(--color-danger)" : "rgba(255,255,255,0.4)",
        }}
        aria-hidden="true"
      >
        {isError ? "!" : "·"}
      </span>
      {title && (
        <h3 className="font-heading mb-2" style={{ fontSize: "var(--text-h4)", color: "#F4F6F8" }}>
          {title}
        </h3>
      )}
      <p className="font-body text-sm leading-relaxed max-w-md" style={{ color: "#9AA1AB" }}>
        {message}
      </p>
      {actionLabel && onAction && (
        <button
          onClick={onAction}
          className="font-body text-sm font-medium px-6 py-2.5 rounded-full mt-6 transition-all duration-300 cursor-pointer"
          style={{ color: "#0A0A0B", background: "#F4F6F8", border: "none" }}
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
}
