import { headers, cookies } from "next/headers";
import { redirect } from "next/navigation";
import Link from "next/link";
import type { Locale } from "@/lib/types";
import { t } from "@/lib/utils";
import { SECTION_TYPES } from "@/content/sections";
import { getPage } from "@/content/repository";
import type { PageSlug } from "@/content/types";
import { SESSION_COOKIE, verifySessionToken } from "@/lib/admin";

export const dynamic = "force-dynamic";

export default async function AdminSectionsPage() {
  const h = await headers();
  const locale = (h.get("x-locale") ?? "cs") as Locale;

  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;
  if (!(await verifySessionToken(token))) {
    redirect("/admin/login");
  }

  const pages = Array.from(new Set(SECTION_TYPES.flatMap((meta) => meta.pages)));
  const pagesWithSections = pages.filter((slug) => {
    const page = getPage(slug as PageSlug);
    const data = page?.data as { sections?: unknown } | undefined;
    return Array.isArray(data?.sections);
  });

  return (
    <div>
      <Link
        href="/admin"
        className="font-body text-sm inline-block mb-6 transition-colors duration-200"
        style={{ color: "rgba(255,255,255,0.5)", textDecoration: "none" }}
      >
        ← {t(locale, "admin.backToDashboard")}
      </Link>

      <p className="font-mono text-label font-semibold tracking-[0.15em] uppercase mb-3" style={{ color: "#6E7683" }}>
        {t(locale, "admin.sections")}
      </p>
      <h1 className="font-heading mb-8" style={{ fontSize: "var(--text-h1-sm)", color: "#F4F6F8", letterSpacing: "-0.03em" }}>
        {t(locale, "admin.sections")}
      </h1>

      <div className="rounded-2xl overflow-hidden" style={{ background: "#121316", border: "1px solid rgba(255,255,255,0.06)" }}>
        {pagesWithSections.length === 0 ? (
          <p className="font-body text-sm p-6" style={{ color: "rgba(255,255,255,0.4)" }}>
            {t(locale, "admin.noSections")}
          </p>
        ) : (
          pagesWithSections.map((slug, i) => (
            <Link
              key={slug}
              href={`/admin/sections/${slug}`}
              className="flex items-center justify-between gap-4 px-5 py-4 no-underline transition-colors duration-200 hover:bg-[rgba(255,255,255,0.02)]"
              style={{ borderTop: i === 0 ? "none" : "1px solid rgba(255,255,255,0.06)", color: "#F4F6F8" }}
            >
              <span className="font-body text-sm" style={{ color: "#F4F6F8" }}>
                {slug}
              </span>
              <span aria-hidden="true" style={{ color: "rgba(255,255,255,0.25)" }}>→</span>
            </Link>
          ))
        )}
      </div>
    </div>
  );
}
