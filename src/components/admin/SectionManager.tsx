"use client";

import { useState } from "react";
import type { Locale } from "@/lib/types";
import { t } from "@/lib/utils";
import type { ContentItem, SectionInstance } from "@/content/types";
import { SECTION_TYPES, getSectionMeta } from "@/content/sections";
import { useContentActions } from "@/hooks/useContentActions";

interface SectionManagerProps {
  locale: Locale;
  item: ContentItem;
  hasDraft: boolean;
  hasPublishedOverride: boolean;
}

export default function SectionManager({
  locale,
  item: initialItem,
  hasDraft,
  hasPublishedOverride,
}: SectionManagerProps) {
  const [item, setItem] = useState<ContentItem>(() => structuredClone(initialItem));
  const [dirty, setDirty] = useState(false);
  const { status, message, serverErrors, saveDraft, publish, discard, clearMessages } =
    useContentActions(item.kind, initialItem.id, locale);

  const pageData = (item as unknown as { data: Record<string, unknown> }).data;
  const sections = (pageData.sections as SectionInstance[] | undefined) ?? [];
  const busy = status === "saving" || status === "publishing";

  const updateSections = (next: SectionInstance[]) => {
    setItem((prev) => {
      const clone = structuredClone(prev) as unknown as { data: Record<string, unknown> };
      clone.data.sections = next;
      return clone as unknown as ContentItem;
    });
    setDirty(true);
    clearMessages();
  };

  const move = (index: number, direction: -1 | 1) => {
    const target = index + direction;
    if (target < 0 || target >= sections.length) return;
    const next = [...sections];
    [next[index], next[target]] = [next[target], next[index]];
    updateSections(next);
  };

  const toggleVisible = (index: number) => {
    const next = sections.map((section, i) =>
      i === index ? { ...section, visible: !section.visible } : section
    );
    updateSections(next);
  };

  const setLabel = (index: number, key: "cs" | "en", value: string) => {
    const next = sections.map((section, i) => {
      if (i !== index) return section;
      return {
        ...section,
        label: {
          cs: key === "cs" ? value : (section.label?.cs ?? ""),
          en: key === "en" ? value : (section.label?.en ?? ""),
        },
      };
    });
    updateSections(next);
  };

  const handleSave = async () => {
    const ok = await saveDraft(item);
    if (ok) setDirty(false);
  };

  const handlePublish = async () => {
    const ok = await publish();
    if (ok) window.location.reload();
  };

  const handleDiscard = async () => {
    const ok = await discard();
    if (ok) window.location.reload();
  };

  if (sections.length === 0) {
    return (
      <p className="font-body text-sm" style={{ color: "rgba(255,255,255,0.4)" }}>
        {t(locale, "admin.noSections")}
      </p>
    );
  }

  return (
    <div>
      <div className="flex items-center gap-2 mb-6 flex-wrap">
        <span className="font-mono text-label font-semibold tracking-[0.12em] uppercase px-2.5 py-1 rounded-full" style={{ background: "rgba(255,255,255,0.05)", color: "rgba(255,255,255,0.5)" }}>
          {initialItem.id}
        </span>
        {hasDraft && (
          <span className="font-mono text-label font-semibold tracking-[0.12em] uppercase px-2.5 py-1 rounded-full" style={{ background: "rgba(251,191,36,0.12)", color: "#FBBF24" }}>
            {t(locale, "admin.statusDraft")}
          </span>
        )}
        {hasPublishedOverride && (
          <span className="font-mono text-label font-semibold tracking-[0.12em] uppercase px-2.5 py-1 rounded-full" style={{ background: "rgba(34,197,94,0.12)", color: "#22C55E" }}>
            {t(locale, "admin.statusPublished")}
          </span>
        )}
        {dirty && (
          <span className="font-mono text-label tracking-[0.12em] uppercase" style={{ color: "rgba(255,255,255,0.35)" }}>
            ●
          </span>
        )}
      </div>

      <p className="font-body text-xs mb-8 leading-relaxed" style={{ color: "rgba(255,255,255,0.45)" }}>
        {t(locale, "admin.rebuildNote")}
      </p>

      <div className="rounded-2xl overflow-hidden" style={{ background: "#121316", border: "1px solid rgba(255,255,255,0.06)" }}>
        {sections.map((section, index) => {
          const meta = getSectionMeta(section.section);
          return (
            <div
              key={section.section}
              className="px-5 py-4"
              style={{ borderTop: index === 0 ? "none" : "1px solid rgba(255,255,255,0.06)", opacity: section.visible ? 1 : 0.5 }}
            >
              <div className="flex items-start gap-4">
                {/* Pořadí */}
                <div className="flex flex-col items-center gap-1 pt-0.5 flex-shrink-0">
                  <span className="font-mono text-label" style={{ color: "rgba(255,255,255,0.3)" }}>
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <div className="flex flex-col">
                    <button
                      onClick={() => move(index, -1)}
                      disabled={index === 0 || busy}
                      aria-label={t(locale, "admin.moveUp")}
                      className="w-6 h-6 rounded-md cursor-pointer transition-colors duration-200 disabled:cursor-default"
                      style={{ border: "none", background: "transparent", color: index === 0 ? "rgba(255,255,255,0.15)" : "rgba(255,255,255,0.4)" }}
                    >
                      ↑
                    </button>
                    <button
                      onClick={() => move(index, 1)}
                      disabled={index === sections.length - 1 || busy}
                      aria-label={t(locale, "admin.moveDown")}
                      className="w-6 h-6 rounded-md cursor-pointer transition-colors duration-200 disabled:cursor-default"
                      style={{ border: "none", background: "transparent", color: index === sections.length - 1 ? "rgba(255,255,255,0.15)" : "rgba(255,255,255,0.4)" }}
                    >
                      ↓
                    </button>
                  </div>
                </div>

                {/* Info + metadata */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <span className="font-heading" style={{ fontSize: 16, color: "#F4F6F8" }}>
                      {section.label?.[locale] ?? meta?.label[locale] ?? section.section}
                    </span>
                    <span className="font-mono text-label-sm font-semibold uppercase tracking-[0.12em] px-2 py-0.5 rounded-full" style={{ background: "rgba(255,255,255,0.05)", color: "rgba(255,255,255,0.45)" }}>
                      {section.section}
                    </span>
                  </div>
                  <p className="font-body text-xs mb-4" style={{ color: "rgba(255,255,255,0.4)" }}>
                    {meta?.description[locale]}
                  </p>

                  {/* Metadata: label override */}
                  <div className="grid gap-3 sm:grid-cols-2">
                    {(["cs", "en"] as const).map((key) => (
                      <div key={key}>
                        <span className="font-mono text-label-sm font-semibold uppercase tracking-[0.12em] mb-1.5 block" style={{ color: "rgba(255,255,255,0.35)" }}>
                          {t(locale, "admin.sectionLabel")} · {key}
                        </span>
                        <input
                          type="text"
                          value={section.label?.[key] ?? ""}
                          onChange={(e) => setLabel(index, key, e.target.value)}
                          disabled={busy}
                          placeholder={meta?.label[key]}
                          className="w-full text-sm outline-none rounded-lg px-3 py-2 transition-all duration-200"
                          style={{
                            background: "rgba(255,255,255,0.02)",
                            border: "1px solid rgba(255,255,255,0.08)",
                            color: "#F4F6F8",
                          }}
                        />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Visibility */}
                <button
                  onClick={() => toggleVisible(index)}
                  disabled={busy}
                  className="font-mono text-label-sm font-semibold uppercase tracking-[0.12em] px-3 py-1.5 rounded-full flex-shrink-0 cursor-pointer transition-colors duration-200 disabled:cursor-default"
                  style={{
                    border: "1px solid",
                    borderColor: section.visible ? "rgba(34,197,94,0.3)" : "rgba(255,255,255,0.1)",
                    background: section.visible ? "rgba(34,197,94,0.08)" : "transparent",
                    color: section.visible ? "#22C55E" : "rgba(255,255,255,0.4)",
                  }}
                >
                  {section.visible ? t(locale, "admin.visible") : t(locale, "admin.hidden")}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {serverErrors.length > 0 && (
        <div className="mt-6 px-4 py-3 rounded-xl" style={{ background: "rgba(239,68,68,0.06)", border: "1px solid rgba(239,68,68,0.15)" }}>
          {serverErrors.map((error) => (
            <p key={error} className="font-body text-sm" style={{ color: "#EF4444" }}>
              {error}
            </p>
          ))}
        </div>
      )}

      {message && (
        <p className="font-body text-sm mt-6" style={{ color: "#22C55E" }}>
          {message}
        </p>
      )}

      <div className="flex items-center gap-3 mt-8 flex-wrap">
        <button
          onClick={handleSave}
          disabled={busy || !dirty}
          className="font-body text-sm font-medium px-6 py-2.5 rounded-full transition-all duration-300"
          style={{
            color: busy || !dirty ? "rgba(244,246,248,0.3)" : "#0A0A0B",
            background: busy || !dirty ? "rgba(255,255,255,0.06)" : "#F4F6F8",
            cursor: busy || !dirty ? "default" : "pointer",
            border: "none",
          }}
        >
          {t(locale, "admin.saveDraft")}
        </button>
        <button
          onClick={handlePublish}
          disabled={busy || !hasDraft}
          className="font-body text-sm font-medium px-6 py-2.5 rounded-full transition-all duration-300"
          style={{
            color: busy || !hasDraft ? "rgba(34,197,94,0.4)" : "#FFFFFF",
            background: busy || !hasDraft ? "rgba(34,197,94,0.08)" : "#22C55E",
            cursor: busy || !hasDraft ? "default" : "pointer",
            border: "none",
          }}
        >
          {t(locale, "admin.publish")}
        </button>
        {hasDraft && (
          <button
            onClick={handleDiscard}
            disabled={busy}
            className="font-body text-sm px-4 py-2.5 rounded-full transition-colors duration-200"
            style={{ color: "rgba(255,255,255,0.45)", background: "transparent", cursor: busy ? "default" : "pointer", border: "1px solid rgba(255,255,255,0.1)" }}
          >
            {t(locale, "admin.discard")}
          </button>
        )}
      </div>
    </div>
  );
}
