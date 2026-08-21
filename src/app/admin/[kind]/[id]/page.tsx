import { headers, cookies } from "next/headers";
import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import type { Locale } from "@/lib/types";
import { t } from "@/lib/utils";
import { CONTENT_KINDS, list } from "@/content/repository";
import type { ContentItem, ContentKind } from "@/content/types";
import { SESSION_COOKIE, verifySessionToken } from "@/lib/admin";
import { getItemState } from "@/services/contentStore";
import ContentForm from "@/components/admin/ContentForm";

export const dynamic = "force-dynamic";

const VALID_KINDS = CONTENT_KINDS.map((k) => k.kind);

export default async function AdminKindEditPage({
  params,
}: {
  params: Promise<{ kind: string; id: string }>;
}) {
  const { kind, id } = await params;
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
  const base = list(kindKey).find((item) => item.id === id) ?? null;
  const state = await getItemState(kindKey, id);
  const item: ContentItem | null = state.draft ?? state.published ?? base;

  if (!item) {
    notFound();
  }

  return (
    <div>
      <Link
        href={`/admin/${kindKey}`}
        className="font-body text-sm inline-block mb-6 transition-colors duration-200"
        style={{ color: "rgba(255,255,255,0.5)", textDecoration: "none" }}
      >
        ← {t(locale, "admin.backToList")}
      </Link>

      <ContentForm
        locale={locale}
        kind={kindKey}
        item={item}
        hasDraft={Boolean(state.draft)}
        hasPublishedOverride={Boolean(state.published)}
      />
    </div>
  );
}
