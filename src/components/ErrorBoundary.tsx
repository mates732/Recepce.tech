"use client";

import { Component, type ReactNode, type ErrorInfo } from "react";

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
      return (
        <div
          className="flex items-center justify-center min-h-screen px-6"
          style={{ background: "#020308" }}
        >
          <div className="text-center max-w-md">
            <div
              className="font-mono text-[10px] tracking-[0.15em] uppercase mb-4"
              style={{ color: "rgba(126,132,146,0.35)" }}
            >
              rendering error
            </div>
            <h1
              className="font-heading text-[clamp(24px,3vw,36px)] font-medium tracking-[-0.03em] mb-3"
              style={{ color: "#F3F4F6" }}
            >
              Something went wrong
            </h1>
            <p
              className="text-[13px] leading-relaxed mb-8"
              style={{ color: "#7E8492" }}
            >
              A rendering error occurred. The dev server is still running — try saving the file again to trigger a hot reload.
            </p>
            <button
              onClick={() => {
                this.setState({ hasError: false, error: null });
                window.location.reload();
              }}
              className="font-body text-[12px] font-medium tracking-[-0.01em] transition-all duration-300"
              style={{ color: "rgba(0,194,255,0.5)" }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = "rgba(0,194,255,0.85)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = "rgba(0,194,255,0.5)";
              }}
            >
              reload page
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
