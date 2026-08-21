import Link from "next/link";
import { headers } from "next/headers";
import type { Locale } from "@/lib/types";
import { t } from "@/lib/utils";

export default async function NotFound() {
  const h = await headers();
  const locale = (h.get("x-locale") ?? "cs") as Locale;

  return (
    <section
      className="relative flex flex-col items-center justify-center"
      style={{ minHeight: "70vh", padding: "clamp(80px, 10vw, 120px) clamp(24px, 5vw, 80px)" }}
    >
      <div className="text-center">
        <div
          className="font-mono text-label-lg tracking-[0.12em] uppercase mb-4"
          style={{ color: "rgba(255,255,255,0.35)" }}
        >
          404
        </div>
        <h1
          className="font-heading mb-8"
          style={{ fontSize: "var(--text-h1-md)", lineHeight: "var(--leading-display)", fontWeight: 500 }}
        >
          {t(locale, "notFound.title")}
        </h1>
        <Link
          href={`/${locale}`}
          className="group inline-flex items-center gap-2 text-[13px] font-medium tracking-[-0.01em] no-underline transition-colors duration-500 text-[rgba(255,255,255,0.4)] hover:text-[rgba(255,255,255,0.7)]"
        >
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
            <path d="M8 2L4 6l4 4" />
          </svg>
          <span>{t(locale, "notFound.back")}</span>
        </Link>
      </div>
    </section>
  );
}
