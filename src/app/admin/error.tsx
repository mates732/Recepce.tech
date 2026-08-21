"use client";

import { useEffect, useState } from "react";
import type { Locale } from "@/lib/types";
import { t } from "@/lib/utils";

function useLocale(): Locale {
  const [locale, setLocale] = useState<Locale>("cs");
  useEffect(() => {
    setLocale(document.documentElement.lang === "en" ? "en" : "cs");
  }, []);
  return locale;
}

export default function AdminError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  const locale = useLocale();

  useEffect(() => {
    console.error("[Admin]", error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center text-center" style={{ minHeight: "50vh" }}>
      <p className="font-mono text-label font-semibold tracking-[0.15em] uppercase mb-3" style={{ color: "#6E7683" }}>
        Error
      </p>
      <h1 className="font-heading mb-6" style={{ fontSize: "var(--text-h2)", color: "#F4F6F8" }}>
        {t(locale, "admin.errorTitle")}
      </h1>
      <button
        onClick={reset}
        className="font-body text-sm font-medium px-6 py-2.5 rounded-full transition-all duration-300 cursor-pointer"
        style={{ color: "#0A0A0B", background: "#F4F6F8", border: "none" }}
      >
        {t(locale, "admin.retry")}
      </button>
    </div>
  );
}
