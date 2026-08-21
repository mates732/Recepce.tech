import { headers, cookies } from "next/headers";
import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import type { Locale } from "@/lib/types";
import { t } from "@/lib/utils";
import { CONTENT_KINDS } from "@/content/repository";
import type { ContentKind } from "@/content/types";
import { SESSION_COOKIE, verifySessionToken } from "@/lib/admin";
import { listContentItems } from "@/services/contentStore";

export const dynamic = "force-dynamic";

const VALID_KINDS = CONTENT_KINDS.map((k) => k.kind);

export default async function AdminKindListPage({
  params,
}: {
  params: Promise<{ kind: string }>;
}) {
  const { kind } = await params;
  if (!(VALID_KINDS as string[]).includes(kind)) {
    notFound();
  }

  const h = await headers();
  const locale = (h.get("x-locale") ?? "cs") as Locale;

  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;
  if (!(await verifySessionToken(token))) {
    redirect("/admin/login");
  }

  const kindKey = kind as ContentKind;
  const kindMeta = CONTENT_KINDS.find((k) => k.kind === kindKey);
  const items = await listContentItems(kindKey);

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
        {t(locale, "admin.content")}
      </p>
      <h1 className="font-heading mb-8" style={{ fontSize: "var(--text-h1-sm)", color: "#F4F6F8", letterSpacing: "-0.03em" }}>
        {kindMeta?.label[locale]}
      </h1>

      <div className="rounded-2xl overflow-hidden" style={{ background: "#121316", border: "1px solid rgba(255,255,255,0.06)" }}>
        {items.length === 0 ? (
          <p className="font-body text-sm p-6" style={{ color: "rgba(255,255,255,0.4)" }}>
            {t(locale, "admin.noChanges")}
          </p>
        ) : (
          items.map((item, i) => (
            <Link
              key={item.id}
              href={`/admin/${kindKey}/${item.id}`}
              className="flex items-center justify-between gap-4 px-5 py-4 no-underline transition-colors duration-200 hover:bg-[rgba(255,255,255,0.02)]"
              style={{ borderTop: i === 0 ? "none" : "1px solid rgba(255,255,255,0.06)", color: "#F4F6F8" }}
            >
              <span className="min-w-0">
                <span className="font-body text-sm block truncate" style={{ color: "#F4F6F8" }}>
                  {item.label}
                </span>
                <span className="font-mono text-label" style={{ color: "rgba(255,255,255,0.35)" }}>
                  {item.id}
                </span>
              </span>
              <span className="flex items-center gap-2 flex-shrink-0">
                {item.hasDraft && (
                  <span
                    className="font-mono text-label-sm font-semibold uppercase tracking-[0.12em] px-2 py-1 rounded-full"
                    style={{ background: "rgba(251,191,36,0.12)", color: "#FBBF24" }}
                  >
                    {t(locale, "admin.statusDraft")}
                  </span>
                )}
                {item.hasPublishedOverride && (
                  <span
                    className="font-mono text-label-sm font-semibold uppercase tracking-[0.12em] px-2 py-1 rounded-full"
                    style={{ background: "rgba(34,197,94,0.12)", color: "#22C55E" }}
                  >
                    {t(locale, "admin.statusPublished")}
                  </span>
                )}
                <span aria-hidden="true" style={{ color: "rgba(255,255,255,0.25)" }}>→</span>
              </span>
            </Link>
          ))
        )}
      </div>
    </div>
  );
}
