import { headers, cookies } from "next/headers";
import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import type { Locale } from "@/lib/types";
import { t } from "@/lib/utils";
import { getPage } from "@/content/repository";
import type { ContentItem, PageSlug } from "@/content/types";
import { SECTION_TYPES } from "@/content/sections";
import { SESSION_COOKIE, verifySessionToken } from "@/lib/admin";
import { getItemState } from "@/services/contentStore";
import SectionManager from "@/components/admin/SectionManager";

export const dynamic = "force-dynamic";

export default async function AdminSectionsDetailPage({
  params,
}: {
  params: Promise<{ page: string }>;
}) {
  const { page } = await params;
  const slug = page as PageSlug;
  const hasSections = SECTION_TYPES.some((meta) => meta.pages.includes(slug));
  if (!hasSections) {
    notFound();
  }

  const h = await headers();
  const locale = (h.get("x-locale") ?? "cs") as Locale;

  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;
  if (!(await verifySessionToken(token))) {
    redirect("/admin/login");
  }

  const base = getPage(slug);
  if (!base) {
    notFound();
  }

  const state = await getItemState("page", slug);
  const item: ContentItem = state.draft ?? state.published ?? base;

  const data = (item as unknown as { data: { sections?: unknown } }).data;
  if (!Array.isArray(data.sections)) {
    notFound();
  }

  return (
    <div>
      <Link
        href="/admin/sections"
        className="font-body text-sm inline-block mb-6 transition-colors duration-200"
        style={{ color: "rgba(255,255,255,0.5)", textDecoration: "none" }}
      >
        ← {t(locale, "admin.sections")}
      </Link>

      <p className="font-mono text-label font-semibold tracking-[0.15em] uppercase mb-3" style={{ color: "#6E7683" }}>
        {slug}
      </p>
      <h1 className="font-heading mb-8" style={{ fontSize: "var(--text-h1-sm)", color: "#F4F6F8", letterSpacing: "-0.03em" }}>
        {t(locale, "admin.sections")}
      </h1>

      <SectionManager
        locale={locale}
        item={item}
        hasDraft={Boolean(state.draft)}
        hasPublishedOverride={Boolean(state.published)}
      />
    </div>
  );
}
