import { headers } from "next/headers";
import Link from "next/link";
import type { Locale } from "@/lib/types";
import { t } from "@/lib/utils";
import { isAdminEnabled } from "@/lib/admin";
import { getSite } from "@/content/repository";
import LoginForm from "./LoginForm";

export default async function AdminLoginPage() {
  const h = await headers();
  const locale = (h.get("x-locale") ?? "cs") as Locale;
  const site = getSite();

  return (
    <section
      className="flex flex-col items-center justify-center"
      style={{
        minHeight: "100dvh",
        padding: "clamp(24px, 5vw, 80px)",
        background: "#0A0A0B",
      }}
    >
      <div className="w-full max-w-sm">
        <Link
          href={`/${locale}`}
          className="inline-flex items-center gap-1.5 text-[15px] tracking-[-0.02em] mb-10 transition-opacity duration-300 hover:opacity-60"
          style={{ color: "#F4F6F8", textDecoration: "none" }}
        >
          <span className="font-semibold">{site?.brand.root}</span>
          <span style={{ color: "#9AA1AB", fontWeight: 400 }}>{site?.brand.suffix}</span>
        </Link>

        <div
          className="p-6 sm:p-8 rounded-2xl"
          style={{ background: "#121316", border: "1px solid rgba(255,255,255,0.06)" }}
        >
          <p
            className="font-mono text-label font-semibold tracking-[0.15em] uppercase mb-3"
            style={{ color: "#6E7683" }}
          >
            Admin
          </p>
          <h1
            className="font-heading mb-2"
            style={{ fontSize: "var(--text-h2)", color: "#F4F6F8" }}
          >
            {t(locale, "admin.loginTitle")}
          </h1>
          <p
            className="font-body text-sm leading-relaxed mb-6"
            style={{ color: "#9AA1AB" }}
          >
            {t(locale, "admin.loginSubtitle")}
          </p>

          {isAdminEnabled() ? (
            <LoginForm locale={locale} />
          ) : (
            <p className="font-body text-sm" style={{ color: "#EF4444" }}>
              {t(locale, "admin.disabled")}
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
