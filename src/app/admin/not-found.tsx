import { headers } from "next/headers";
import Link from "next/link";
import type { Locale } from "@/lib/types";
import { t } from "@/lib/utils";

export default async function AdminNotFound() {
  const h = await headers();
  const locale = (h.get("x-locale") ?? "cs") as Locale;

  return (
    <div className="flex flex-col items-center justify-center text-center" style={{ minHeight: "50vh" }}>
      <p className="font-mono text-label font-semibold tracking-[0.15em] uppercase mb-3" style={{ color: "#6E7683" }}>
        404
      </p>
      <h1 className="font-heading mb-8" style={{ fontSize: "var(--text-h2)", color: "#F4F6F8" }}>
        {t(locale, "admin.notFound")}
      </h1>
      <Link
        href="/admin"
        className="font-body text-sm transition-colors duration-200"
        style={{ color: "rgba(255,255,255,0.5)", textDecoration: "none" }}
      >
        ← {t(locale, "admin.backToDashboard")}
      </Link>
    </div>
  );
}
