import { headers, cookies } from "next/headers";
import { redirect } from "next/navigation";
import Link from "next/link";
import type { Locale } from "@/lib/types";
import { t } from "@/lib/utils";
import { SESSION_COOKIE, verifySessionToken } from "@/lib/admin";
import { readLeads } from "@/services/leadsStore";
import LeadsManager from "@/components/admin/LeadsManager";

export const dynamic = "force-dynamic";

export default async function AdminLeadsPage() {
  const h = await headers();
  const locale = (h.get("x-locale") ?? "cs") as Locale;

  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;
  if (!(await verifySessionToken(token))) {
    redirect("/admin/login");
  }

  const leads = await readLeads();
  leads.sort((a, b) => b.createdAt.localeCompare(a.createdAt));

  return (
    <div>
      <Link
        href="/admin"
        className="font-body text-sm inline-block mb-6 transition-colors duration-200 no-underline"
        style={{ color: "rgba(255,255,255,0.5)" }}
      >
        ← {t(locale, "admin.backToDashboard")}
      </Link>

      <p className="font-mono text-label font-semibold tracking-[0.15em] uppercase mb-3" style={{ color: "#6E7683" }}>
        {locale === "cs" ? "Leady · Audit" : "Leads · Audit"}
      </p>
      <h1 className="font-heading mb-2" style={{ fontSize: "var(--text-h1-sm)", color: "#F4F6F8", letterSpacing: "-0.03em" }}>
        {locale === "cs" ? "Leady" : "Leads"}
      </h1>
      <p className="font-body text-sm mb-8" style={{ color: "#9AA1AB" }}>
        {locale === "cs"
          ? "Kvalifikované poptávky z auditu. Změňte status kliknutím."
          : "Qualified leads from the audit. Change status with a click."}
      </p>

      <LeadsManager locale={locale} leads={leads} />
    </div>
  );
}
