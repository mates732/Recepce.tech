import { headers } from "next/headers";
import Link from "next/link";
import type { Locale } from "@/lib/types";
import { t } from "@/lib/utils";
import { getSite, CONTENT_KINDS } from "@/content/repository";

function getLocale(h: Awaited<ReturnType<typeof headers>>): Locale {
  return (h.get("x-locale") ?? "cs") as Locale;
}

export default async function AdminShellLayout({ children }: { children: React.ReactNode }) {
  const h = await headers();
  const locale = getLocale(h);
  const site = getSite();

  if (h.get("x-admin-route") === "login") {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen" style={{ background: "#0A0A0B" }}>
      {/* ─── Top bar (mobile) ─── */}
      <header
        className="sticky top-0 z-30 md:hidden"
        style={{
          background: "#121316",
          borderBottom: "1px solid rgba(255,255,255,0.06)",
        }}
      >
        <div
          className="flex items-center justify-between"
          style={{ padding: "14px clamp(20px, 5vw, 32px)" }}
        >
          <Link href="/admin" className="flex items-center gap-1.5 text-[15px] tracking-[-0.02em] no-underline" style={{ color: "#F4F6F8" }}>
            <span className="font-semibold">{site?.brand.root}</span>
            <span style={{ color: "#9AA1AB", fontWeight: 400 }}>{site?.brand.suffix}</span>
            <span
              className="ml-2 font-mono text-label-sm font-semibold tracking-[0.15em] uppercase px-2 py-0.5 rounded-full"
              style={{ background: "#F4F6F8", color: "#0A0A0B" }}
            >
              Admin
            </span>
          </Link>
          <LogoutButton locale={locale} />
        </div>
        <nav
          className="flex items-center gap-1 overflow-x-auto"
          style={{ padding: "0 clamp(20px, 5vw, 32px) 12px" }}
          aria-label={t(locale, "admin.content")}
        >
          <NavLink href="/admin" active>
            {t(locale, "admin.dashboard")}
          </NavLink>
          {CONTENT_KINDS.map((kind) => (
            <NavLink key={kind.kind} href={`/admin/${kind.kind}`} className="whitespace-nowrap">
              {kind.label[locale]}
            </NavLink>
          ))}
          <NavLink href="/admin/sections" className="whitespace-nowrap">
            {t(locale, "admin.sections")}
          </NavLink>
          <NavLink href="/admin/media" className="whitespace-nowrap">
            {t(locale, "admin.media")}
          </NavLink>
          <NavLink href="/admin/leads" className="whitespace-nowrap">
            {t(locale, "admin.leads")}
          </NavLink>
        </nav>
      </header>

      <div className="md:flex">
        {/* ─── Sidebar (desktop) ─── */}
        <aside
          className="hidden md:flex md:flex-col md:fixed md:inset-y-0 md:left-0 md:w-60"
          style={{ background: "#121316", borderRight: "1px solid rgba(255,255,255,0.06)" }}
        >
          <Link
            href="/admin"
            className="flex items-center gap-1.5 text-[15px] tracking-[-0.02em] no-underline"
            style={{ color: "#F4F6F8", padding: "24px 24px 20px" }}
          >
            <span className="font-semibold">{site?.brand.root}</span>
            <span style={{ color: "#9AA1AB", fontWeight: 400 }}>{site?.brand.suffix}</span>
            <span
              className="ml-2 font-mono text-label-sm font-semibold tracking-[0.15em] uppercase px-2 py-0.5 rounded-full"
              style={{ background: "#F4F6F8", color: "#0A0A0B" }}
            >
              Admin
            </span>
          </Link>

          <nav className="flex-1 flex flex-col gap-0.5 px-3" aria-label={t(locale, "admin.content")}>
            <span
              className="font-mono text-label-sm font-semibold tracking-[0.18em] uppercase px-3 pb-2 pt-4"
              style={{ color: "rgba(255,255,255,0.3)" }}
            >
              {t(locale, "admin.content")}
            </span>
          <NavLink href="/admin" active>
            {t(locale, "admin.dashboard")}
          </NavLink>
          {CONTENT_KINDS.map((kind) => (
            <NavLink key={kind.kind} href={`/admin/${kind.kind}`}>
              {kind.label[locale]}
            </NavLink>
          ))}
          <NavLink href="/admin/sections">{t(locale, "admin.sections")}</NavLink>
          <NavLink href="/admin/media">{t(locale, "admin.media")}</NavLink>
          <NavLink href="/admin/leads">{t(locale, "admin.leads")}</NavLink>
        </nav>

          <div style={{ padding: "16px 24px", borderTop: "1px solid rgba(255,255,255,0.06)" }}>
            <LogoutButton locale={locale} />
          </div>
        </aside>

        {/* ─── Content ─── */}
        <main className="md:ml-60 flex-1" style={{ padding: "clamp(24px, 4vw, 48px)" }}>
          <div className="mx-auto" style={{ maxWidth: "960px" }}>
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}

function NavLink({
  href,
  active,
  className = "",
  children,
}: {
  href: string;
  active?: boolean;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className={`block no-underline px-3 py-2 rounded-lg font-body text-sm transition-colors duration-200 ${className}`}
      style={{
        color: active ? "#F4F6F8" : "rgba(255,255,255,0.55)",
        background: active ? "rgba(255,255,255,0.05)" : "transparent",
      }}
    >
      {children}
    </Link>
  );
}

function LogoutButton({ locale }: { locale: Locale }) {
  return (
    <form action="/api/admin/logout" method="post">
      <button
        type="submit"
        className="font-body text-sm transition-colors duration-200 cursor-pointer"
        style={{ color: "rgba(255,255,255,0.45)", background: "transparent", border: "none", padding: 0 }}
      >
        {t(locale, "admin.logout")}
      </button>
    </form>
  );
}
