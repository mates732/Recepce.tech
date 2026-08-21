"use client";

import { Component, useEffect, useState, type ReactNode, type ErrorInfo } from "react";
import type { Locale } from "@/lib/types";
import { t } from "@/lib/utils";

function useLocale(): Locale {
  const [locale, setLocale] = useState<Locale>("cs");
  useEffect(() => {
    setLocale(document.documentElement.lang === "en" ? "en" : "cs");
  }, []);
  return locale;
}

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export default class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error("[ErrorBoundary]", error, info.componentStack);
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) return this.props.fallback;
      return <ErrorFallback />;
    }
    return this.props.children;
  }
}

function ErrorFallback() {
  const locale = useLocale();

  return (
    <div
      className="flex items-center justify-center min-h-screen px-6"
      style={{ background: "#0A0A0B" }}
    >
      <div className="text-center max-w-md">
        <div
          className="font-mono text-label tracking-[0.15em] uppercase mb-4"
          style={{ color: "rgba(255,255,255,0.35)" }}
        >
          error
        </div>
        <h1
          className="font-heading text-[clamp(24px,3vw,36px)] font-medium tracking-[-0.03em] mb-3"
          style={{ color: "#F4F6F8" }}
        >
          {t(locale, "errorBoundary.title")}
        </h1>
        <p
          className="font-body text-[13px] leading-relaxed mb-8"
          style={{ color: "#9AA1AB" }}
        >
          {t(locale, "errorBoundary.text")}
        </p>
        <button
          onClick={() => {
            window.location.reload();
          }}
          className="font-body text-sm font-medium px-6 py-2.5 rounded-full transition-all duration-300 cursor-pointer"
          style={{ color: "#0A0A0B", background: "#F4F6F8", border: "none" }}
        >
          {t(locale, "errorBoundary.reload")}
        </button>
      </div>
    </div>
  );
}
