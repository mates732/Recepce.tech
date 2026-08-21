"use client";

import { useMemo, useState } from "react";
import type { Locale } from "@/lib/types";
import { t } from "@/lib/utils";
import type { ContentItem, ContentKind } from "@/content/types";
import ProjectCard from "@/components/ProjectCard";
import { useContentActions } from "@/hooks/useContentActions";
import MediaPicker from "@/components/admin/MediaPicker";

interface ContentFormProps {
  locale: Locale;
  kind: ContentKind;
  item: ContentItem;
  hasDraft: boolean;
  hasPublishedOverride: boolean;
}

interface FormField {
  path: string;
  label: string;
  type: "text" | "textarea" | "url" | "media";
  localized: boolean;
  list: boolean;
}

type LocaleKey = "cs" | "en";

function isLocalizedPair(value: unknown): value is Record<LocaleKey, unknown> {
  if (!value || typeof value !== "object") return false;
  const obj = value as Record<string, unknown>;
  return "cs" in obj && "en" in obj;
}

function isStringArray(value: unknown): value is string[] {
  return Array.isArray(value) && value.every((v) => typeof v === "string");
}

function isLocalizedStringArray(value: unknown): value is Record<LocaleKey, string[]> {
  return isLocalizedPair(value) && isStringArray(value.cs) && isStringArray(value.en);
}

const MEDIA_PATH_PATTERN = /(^|\.)(poster|src|thumbnail)$/;

function isMediaPathValue(value: string): boolean {
  return value.startsWith("/images/");
}

function collectFields(value: unknown, path: string, fields: FormField[], skip: string[]): void {
  if (value === null || value === undefined) return;

  if (skip.includes(path)) return;

  if (typeof value === "string") {
    const type =
      isMediaPathValue(value) || MEDIA_PATH_PATTERN.test(path)
        ? "media"
        : value.startsWith("http")
          ? "url"
          : value.length > 80
            ? "textarea"
            : "text";
    fields.push({ path, label: path, type, localized: false, list: false });
    return;
  }

  if (isLocalizedStringArray(value)) {
    fields.push({ path, label: path, type: "textarea", localized: true, list: true });
    return;
  }

  if (isLocalizedPair(value)) {
    const cs = value.cs;
    const en = value.en;
    if (typeof cs === "string" && typeof en === "string") {
      fields.push({
        path,
        label: path,
        type: cs.startsWith("http") ? "url" : cs.length > 80 ? "textarea" : "text",
        localized: true,
        list: false,
      });
      return;
    }
    if (isStringArray(cs) && isStringArray(en)) {
      fields.push({ path, label: path, type: "textarea", localized: true, list: true });
      return;
    }
  }

  if (isStringArray(value)) {
    fields.push({ path, label: path, type: "textarea", localized: false, list: true });
    return;
  }

  if (Array.isArray(value)) {
    value.forEach((entry, index) => collectFields(entry, `${path}.${index}`, fields, skip));
    return;
  }

  if (typeof value === "object") {
    for (const [key, entry] of Object.entries(value as Record<string, unknown>)) {
      collectFields(entry, path ? `${path}.${key}` : key, fields, skip);
    }
  }
}

function getByPath(obj: unknown, path: string): unknown {
  return path.split(".").reduce<unknown>((acc, part) => {
    if (acc === null || acc === undefined) return undefined;
    return (acc as Record<string, unknown>)[part];
  }, obj);
}

function setByPath(obj: Record<string, unknown>, path: string, value: unknown): void {
  const parts = path.split(".");
  let cur: Record<string, unknown> = obj;
  for (let i = 0; i < parts.length - 1; i++) {
    const next = cur[parts[i]];
    if (!next || typeof next !== "object") return;
    cur = next as Record<string, unknown>;
  }
  cur[parts[parts.length - 1]] = value;
}

function parseLines(text: string): string[] {
  return text
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
}

function validateField(field: FormField, item: ContentItem, locale: Locale): string | null {
  const required = t(locale, "admin.required");
  const invalidUrl = t(locale, "admin.invalidUrl");
  const value = getByPath(item, field.path);

  if (field.localized && !field.list) {
    const pair = value as Record<LocaleKey, string> | undefined;
    if (!pair?.cs?.trim() || !pair?.en?.trim()) return required;
    return null;
  }

  if (field.list) {
    const arrays = field.localized
      ? Object.values((value as Record<LocaleKey, string[]>) ?? {})
      : [value as string[] | undefined];
    if (arrays.every((arr) => !arr || arr.length === 0)) return required;
    return null;
  }

  const text = (value as string | undefined)?.trim();
  if (!text) return required;
  if (field.type === "url" && text.startsWith("http")) {
    try {
      new URL(text);
    } catch {
      return invalidUrl;
    }
  }
  return null;
}

export default function ContentForm({
  locale,
  kind,
  item: initialItem,
  hasDraft,
  hasPublishedOverride,
}: ContentFormProps) {
  const [item, setItem] = useState<ContentItem>(() => structuredClone(initialItem));
  const [dirty, setDirty] = useState(false);
  const [pickerPath, setPickerPath] = useState<string | null>(null);
  const { status, message, serverErrors, saveDraft, publish, discard, clearMessages } =
    useContentActions(kind, initialItem.id, locale);

  const fields = useMemo(() => {
    const result: FormField[] = [];
    // Sekce se spravují přes dedikovaný SectionManager — zde se needití.
    const skip = kind === "page" ? ["data.sections"] : [];
    collectFields(item, "", result, skip);
    return result;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const groups = useMemo(() => {
    const map = new Map<string, FormField[]>();
    for (const field of fields) {
      const top = field.path.split(".")[0] ?? "data";
      const group = map.get(top) ?? [];
      group.push(field);
      map.set(top, group);
    }
    return Array.from(map.entries());
  }, [fields]);

  const clientErrors = useMemo(() => {
    return fields
      .map((field) => ({ field, error: validateField(field, item, locale) }))
      .filter((entry): entry is { field: FormField; error: string } => entry.error !== null);
  }, [fields, item, locale]);

  const handleFieldChange = (path: string, value: unknown) => {
    setItem((prev) => {
      const next = structuredClone(prev) as unknown as Record<string, unknown>;
      setByPath(next, path, value);
      return next as unknown as ContentItem;
    });
    setDirty(true);
    clearMessages();
  };

  const handleSingleChange = (path: string, key: LocaleKey, text: string) => {
    const current = getByPath(item, path) as Record<LocaleKey, string>;
    handleFieldChange(path, { cs: key === "cs" ? text : current.cs, en: key === "en" ? text : current.en });
  };

  const handleListChange = (path: string, key: LocaleKey | null, text: string) => {
    const lines = parseLines(text);
    if (key) {
      const current = getByPath(item, path) as Record<LocaleKey, string[]>;
      handleFieldChange(path, { cs: key === "cs" ? lines : current.cs, en: key === "en" ? lines : current.en });
    } else {
      handleFieldChange(path, lines);
    }
  };

  const renderValue = (field: FormField) => {
    const value = getByPath(item, field.path);
    const common = {
      className:
        "w-full text-sm outline-none transition-all duration-200 rounded-xl px-3.5 py-2.5 resize-vertical",
      style: {
        background: "rgba(255,255,255,0.02)",
        border: "1px solid rgba(255,255,255,0.08)",
        color: "#F4F6F8",
        lineHeight: "var(--leading-body)",
      },
    };

    if (field.localized) {
      const pair = (value ?? { cs: "", en: "" }) as Record<LocaleKey, string | string[]>;
      return (
        <div className="grid gap-3 sm:grid-cols-2">
          {(["cs", "en"] as LocaleKey[]).map((key) => (
            <div key={key}>
              <span
                className="font-mono text-label-sm font-semibold uppercase tracking-[0.12em] mb-1.5 block"
                style={{ color: "rgba(255,255,255,0.35)" }}
              >
                {key}
              </span>
              {field.list ? (
                <textarea
                  rows={3}
                  value={(pair[key] as string[]).join("\n")}
                  onChange={(e) => handleListChange(field.path, key, e.target.value)}
                  placeholder={key === "cs" ? t(locale, "admin.required") : undefined}
                  {...common}
                />
              ) : (
                <input
                  type={field.type === "url" ? "url" : "text"}
                  value={pair[key] as string}
                  onChange={(e) => handleSingleChange(field.path, key, e.target.value)}
                  {...common}
                />
              )}
            </div>
          ))}
        </div>
      );
    }

    if (field.list) {
      return (
        <textarea
          rows={3}
          value={(value as string[]).join("\n")}
          onChange={(e) => handleListChange(field.path, null, e.target.value)}
          {...common}
        />
      );
    }

    if (field.type === "media") {
      return (
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={(value as string) ?? ""}
            onChange={(e) => handleFieldChange(field.path, e.target.value)}
            {...common}
          />
          <button
            onClick={() => setPickerPath(field.path)}
            className="font-mono text-label-sm font-semibold uppercase tracking-[0.12em] px-3 py-2.5 rounded-xl flex-shrink-0 cursor-pointer transition-colors duration-200"
            style={{ color: "#F4F6F8", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)" }}
          >
            {t(locale, "admin.pickFromLibrary")}
          </button>
        </div>
      );
    }

    return (
      <input
        type={field.type === "url" ? "url" : "text"}
        value={(value as string) ?? ""}
        onChange={(e) => handleFieldChange(field.path, e.target.value)}
        {...common}
      />
    );
  };

  const handleSaveDraft = async () => {
    const ok = await saveDraft(item);
    if (ok) setDirty(false);
  };

  const handlePublish = async () => {
    const ok = await publish();
    if (ok) {
      setDirty(false);
      window.location.reload();
    }
  };

  const handleDiscard = async () => {
    const ok = await discard();
    if (ok) window.location.reload();
  };

  const hasClientErrors = clientErrors.length > 0;
  const busy = status === "saving" || status === "publishing";

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_360px]">
      {/* ─── Form ─── */}
      <div>
        <div className="flex items-center gap-2 mb-6 flex-wrap">
          <span className="font-mono text-label font-semibold tracking-[0.12em] uppercase px-2.5 py-1 rounded-full" style={{ background: "rgba(255,255,255,0.05)", color: "rgba(255,255,255,0.5)" }}>
            {item.id}
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

        {hasClientErrors && (
          <div className="mb-6 px-4 py-3 rounded-xl" style={{ background: "rgba(239,68,68,0.06)", border: "1px solid rgba(239,68,68,0.15)" }}>
            <p className="font-body text-sm" style={{ color: "#EF4444" }}>
              {t(locale, "admin.validationFailed")}
            </p>
          </div>
        )}

        <div className="space-y-8">
          {groups.map(([group, groupFields]) => (
            <div key={group}>
              <h2
                className="font-mono text-label font-semibold tracking-[0.15em] uppercase mb-4 pb-2"
                style={{ color: "rgba(255,255,255,0.4)", borderBottom: "1px solid rgba(255,255,255,0.06)" }}
              >
                {group}
              </h2>
              <div className="space-y-5">
                {groupFields.map((field) => {
                  const error = clientErrors.find((entry) => entry.field.path === field.path)?.error;
                  return (
                    <div key={field.path}>
                      <label
                        className="font-mono text-label font-medium tracking-[0.08em] mb-2 block"
                        style={{ color: "rgba(255,255,255,0.45)" }}
                      >
                        {field.path.replaceAll(".", " · ")}
                      </label>
                      {renderValue(field)}
                      {error && (
                        <span className="font-body text-xs mt-1.5 block" style={{ color: "#EF4444" }}>
                          {error}
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {serverErrors.length > 0 && (
          <div className="mt-8 px-4 py-3 rounded-xl" style={{ background: "rgba(239,68,68,0.06)", border: "1px solid rgba(239,68,68,0.15)" }}>
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
            onClick={handleSaveDraft}
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
        <p className="font-body text-xs mt-3" style={{ color: "rgba(255,255,255,0.35)" }}>
          {t(locale, "admin.publishNote")}
        </p>
      </div>

      {/* ─── Preview ─── */}
      <div className="lg:sticky lg:top-6 self-start">
        <h2 className="font-mono text-label font-semibold tracking-[0.15em] uppercase mb-4" style={{ color: "rgba(255,255,255,0.4)" }}>
          {t(locale, "admin.preview")}
        </h2>
        <ContentPreview locale={locale} kind={kind} item={item} />
      </div>

      <MediaPicker
        locale={locale}
        open={pickerPath !== null}
        onClose={() => setPickerPath(null)}
        onSelect={(path) => {
          if (pickerPath) handleFieldChange(pickerPath, path);
        }}
      />
    </div>
  );
}

function ContentPreview({ locale, kind, item }: { locale: Locale; kind: ContentKind; item: ContentItem }) {
  if (kind === "project") {
    const project = item as unknown as {
      name: Record<Locale, string>;
      tagline: Record<Locale, string>;
      badge?: Record<Locale, string>;
      poster: string;
      href: string;
      external?: boolean;
    };
    return (
      <ProjectCard
        locale={locale}
        name={project.name[locale]}
        desc={project.tagline[locale]}
        badge={project.badge?.[locale]}
        poster={project.poster}
        href={project.href}
        external={project.external}
      />
    );
  }

  if (kind === "profession") {
    const profession = item as unknown as {
      colors?: { accent?: string };
      cs: { name: string; desc: string; tags: string[] };
      en: { name: string; desc: string; tags: string[] };
    };
    const data = locale === "cs" ? profession.cs : profession.en;
    return (
      <div className="p-6 rounded-2xl" style={{ background: "#121316", border: "1px solid rgba(255,255,255,0.06)" }}>
        <h3 className="font-heading mb-2" style={{ fontSize: 20, color: "#F4F6F8" }}>
          {data.name}
        </h3>
        <p className="font-body text-sm leading-relaxed mb-4" style={{ color: "#9AA1AB" }}>
          {data.desc}
        </p>
        <div className="flex flex-wrap gap-2">
          {data.tags.map((tag) => (
            <span
              key={tag}
              className="font-mono text-label tracking-[0.04em] px-2.5 py-1 rounded-full border"
              style={{ color: profession.colors?.accent ?? "#6E7683", borderColor: "rgba(255,255,255,0.08)" }}
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    );
  }

  // Obecný náhled — klíčové pole hodnoty
  const values = (item as unknown as { seo?: Record<string, Record<string, string>>; data?: Record<string, unknown> }).seo;
  return (
    <div className="p-6 rounded-2xl" style={{ background: "#121316", border: "1px solid rgba(255,255,255,0.06)" }}>
      {values ? (
        <>
          <p className="font-heading text-lg mb-3" style={{ color: "#F4F6F8" }}>
            {values.title?.[locale]}
          </p>
          <p className="font-body text-sm leading-relaxed" style={{ color: "#9AA1AB" }}>
            {values.description?.[locale]}
          </p>
        </>
      ) : (
        <p className="font-body text-sm" style={{ color: "rgba(255,255,255,0.4)" }}>
          {item.id}
        </p>
      )}
    </div>
  );
}
