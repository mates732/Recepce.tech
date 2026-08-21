import { headers, cookies } from "next/headers";
import { redirect } from "next/navigation";
import Link from "next/link";
import type { Locale } from "@/lib/types";
import { t } from "@/lib/utils";
import { CONTENT_KINDS, list } from "@/content/repository";
import { SESSION_COOKIE, verifySessionToken } from "@/lib/admin";
import { listAuditEvents, type AuditAction } from "@/services/audit";

export const dynamic = "force-dynamic";

const ACTION_LABEL_KEY: Record<AuditAction, `admin.action${Capitalize<AuditAction>}`> = {
  create: "admin.actionCreate",
  update: "admin.actionUpdate",
  publish: "admin.actionPublish",
  unpublish: "admin.actionUnpublish",
  archive: "admin.actionArchive",
  restore: "admin.actionRestore",
  delete: "admin.actionDelete",
};

export default async function AdminDashboardPage() {
  const h = await headers();
  const locale = (h.get("x-locale") ?? "cs") as Locale;

  // Defense in depth — middleware gate je primární, tato kontrola je druhá vrstva.
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;
  if (!(await verifySessionToken(token))) {
    redirect("/admin/login");
  }

  const auditEvents = await listAuditEvents({ limit: 10 });

  return (
    <div>
      <p
        className="font-mono text-label font-semibold tracking-[0.15em] uppercase mb-3"
        style={{ color: "#6E7683" }}
      >
        Admin
      </p>
      <h1
        className="font-heading mb-2"
        style={{ fontSize: "var(--text-h1-sm)", color: "#F4F6F8", letterSpacing: "-0.03em" }}
      >
        {t(locale, "admin.welcome")}
      </h1>
      <p className="font-body text-sm leading-relaxed mb-10" style={{ color: "#9AA1AB" }}>
        {t(locale, "admin.welcomeSub")}
      </p>

      <div className="grid gap-4 sm:grid-cols-2">
        {CONTENT_KINDS.map((kind) => {
          const count = list(kind.kind).length;
          return (
            <Link
              key={kind.kind}
              href={`/admin/${kind.kind}`}
              className="block p-5 sm:p-6 rounded-2xl no-underline transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5"
              style={{
                background: "#121316",
                border: "1px solid rgba(255,255,255,0.06)",
                color: "#F4F6F8",
              }}
            >
              <div className="flex items-center justify-between gap-3">
                <span className="font-heading" style={{ fontSize: "var(--text-h4)", color: "#F4F6F8" }}>
                  {kind.label[locale]}
                </span>
                <span
                  className="font-mono text-label font-semibold tracking-[0.12em] uppercase px-2.5 py-1 rounded-full"
                  style={{ background: "rgba(255,255,255,0.05)", color: "rgba(255,255,255,0.5)" }}
                >
                  {count} {t(locale, "admin.items")}
                </span>
              </div>
              <p className="font-body text-xs mt-2" style={{ color: "rgba(255,255,255,0.4)" }}>
                {kind.kind}
              </p>
            </Link>
          );
        })}
      </div>

      {/* ─── Audit ─── */}
      <div className="mt-10">
        <h2
          className="font-heading mb-4"
          style={{ fontSize: "var(--text-h3)", color: "#F4F6F8" }}
        >
          {t(locale, "admin.recentChanges")}
        </h2>

        {auditEvents.length === 0 ? (
          <p className="font-body text-sm" style={{ color: "rgba(255,255,255,0.4)" }}>
            {t(locale, "admin.noChanges")}
          </p>
        ) : (
          <div className="rounded-2xl overflow-hidden" style={{ background: "#121316", border: "1px solid rgba(255,255,255,0.06)" }}>
            {auditEvents.map((event, i) => (
              <div
                key={event.id}
                className="flex items-start gap-3 px-5 py-4"
                style={{ borderTop: i === 0 ? "none" : "1px solid rgba(255,255,255,0.06)" }}
              >
                <span
                  className="font-mono text-label font-semibold uppercase tracking-[0.12em] px-2 py-1 rounded-full flex-shrink-0"
                  style={{ background: "rgba(255,255,255,0.05)", color: "rgba(255,255,255,0.5)" }}
                >
                  {t(locale, ACTION_LABEL_KEY[event.action])}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="font-body text-sm leading-snug" style={{ color: "#F4F6F8" }}>
                    {event.summary}
                  </p>
                  <p className="font-mono text-label mt-1" style={{ color: "rgba(255,255,255,0.35)" }}>
                    {event.actor} · {event.entityKind}/{event.entityId}
                  </p>
                </div>
                <span
                  className="font-mono text-label flex-shrink-0"
                  style={{ color: "rgba(255,255,255,0.3)" }}
                >
                  {formatDate(event.timestamp, locale)}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function formatDate(iso: string, locale: Locale): string {
  try {
    return new Date(iso).toLocaleString(locale === "cs" ? "cs-CZ" : "en-US", {
      day: "2-digit",
      month: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return iso;
  }
}
