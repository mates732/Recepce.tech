import { headers, cookies } from "next/headers";
import { redirect } from "next/navigation";
import Link from "next/link";
import type { Locale } from "@/lib/types";
import { t } from "@/lib/utils";
import { SESSION_COOKIE, verifySessionToken } from "@/lib/admin";
import { listMedia } from "@/services/media";
import MediaManager from "@/components/admin/MediaManager";

export const dynamic = "force-dynamic";

export default async function AdminMediaPage() {
  const h = await headers();
  const locale = (h.get("x-locale") ?? "cs") as Locale;

  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;
  if (!(await verifySessionToken(token))) {
    redirect("/admin/login");
  }

  const items = await listMedia();

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
        {t(locale, "admin.media")}
      </p>
      <h1 className="font-heading mb-8" style={{ fontSize: "var(--text-h1-sm)", color: "#F4F6F8", letterSpacing: "-0.03em" }}>
        {t(locale, "admin.media")}
      </h1>

      <MediaManager locale={locale} items={items} />
    </div>
  );
}
