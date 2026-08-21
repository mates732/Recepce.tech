import { headers, cookies } from "next/headers";
import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import type { Locale } from "@/lib/types";
import { t } from "@/lib/utils";
import { SESSION_COOKIE, verifySessionToken } from "@/lib/admin";
import { readLeads } from "@/services/leadsStore";
import { getPage } from "@/content/repository";
import LeadDetail from "@/components/admin/LeadDetail";

export const dynamic = "force-dynamic";

export default async function AdminLeadDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const h = await headers();
  const locale = (h.get("x-locale") ?? "cs") as Locale;

  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;
  if (!(await verifySessionToken(token))) {
    redirect("/admin/login");
  }

  const { id } = await params;
  const leads = await readLeads();
  const lead = leads.find((l) => l.id === id);
  if (!lead) notFound();

  const audit = getPage("home")?.data.systemsAudit;
  const labels: Record<string, { label: string; options: Record<string, string> }> = {};
  for (const q of audit?.questions ?? []) {
    labels[q.id] = {
      label: q.label.cs,
      options: Object.fromEntries(q.options.map((o) => [o.id, o.label.cs])),
    };
  }

  return (
    <div>
      <Link
        href="/admin/leads"
        className="font-body text-sm inline-block mb-6 transition-colors duration-200 no-underline"
        style={{ color: "rgba(255,255,255,0.5)" }}
      >
        ← {t(locale, "admin.backToDashboard")}
      </Link>

      <p className="font-mono text-label font-semibold tracking-[0.15em] uppercase mb-3" style={{ color: "#6E7683" }}>
        {locale === "cs" ? "Detail leadu" : "Lead detail"}
      </p>
      <h1 className="font-heading mb-8" style={{ fontSize: "var(--text-h1-sm)", color: "#F4F6F8", letterSpacing: "-0.03em" }}>
        {lead.company}
      </h1>

      <LeadDetail locale={locale} lead={lead} labels={labels} />
    </div>
  );
}
