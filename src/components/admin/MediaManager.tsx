"use client";

import { useRef, useState } from "react";
import type { Locale } from "@/lib/types";
import { t } from "@/lib/utils";
import type { MediaItem } from "@/services/media";
import {
  isAllowedMediaType,
  isMediaTooLarge,
  formatFileSize,
} from "@/lib/mediaShared";

interface MediaManagerProps {
  locale: Locale;
  items: MediaItem[];
}

function formatDate(iso: string, locale: Locale): string {
  try {
    return new Date(iso).toLocaleDateString(locale === "cs" ? "cs-CZ" : "en-US", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  } catch {
    return iso;
  }
}

export default function MediaManager({ locale, items: initialItems }: MediaManagerProps) {
  const [items, setItems] = useState<MediaItem[]>(initialItems);
  const [selected, setSelected] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [clientError, setClientError] = useState<string | null>(null);
  const [serverError, setServerError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [altDrafts, setAltDrafts] = useState<Record<string, string>>({});
  const fileInputRef = useRef<HTMLInputElement>(null);

  const previewUrl = selected ? URL.createObjectURL(selected) : null;

  const handleSelect = (file: File | null) => {
    setClientError(null);
    setServerError(null);
    if (!file) {
      setSelected(null);
      return;
    }
    if (!isAllowedMediaType(file.type)) {
      setClientError(t(locale, "admin.invalidType"));
      setSelected(null);
      return;
    }
    if (isMediaTooLarge(file.size)) {
      setClientError(t(locale, "admin.tooLarge"));
      setSelected(null);
      return;
    }
    setSelected(file);
  };

  const handleUpload = async () => {
    if (!selected) return;
    setUploading(true);
    setServerError(null);
    setMessage(null);
    try {
      const formData = new FormData();
      formData.append("file", selected);
      const res = await fetch("/api/admin/media", { method: "POST", body: formData });
      const data = await res.json();
      if (!res.ok) {
        setServerError(data?.error ?? t(locale, "admin.uploadError"));
        return;
      }
      setItems((prev) => [data.item, ...prev]);
      setSelected(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
      setMessage(t(locale, "admin.saved"));
    } catch {
      setServerError(t(locale, "admin.uploadError"));
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (item: MediaItem) => {
    if (item.references.length > 0) return;
    if (!window.confirm(t(locale, "admin.confirmDelete"))) return;
    setServerError(null);
    setMessage(null);
    try {
      const res = await fetch(`/api/admin/media?path=${encodeURIComponent(item.path)}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        const data = await res.json().catch(() => null);
        setServerError(data?.error ?? "error");
        return;
      }
      setItems((prev) => prev.filter((media) => media.path !== item.path));
      setMessage(t(locale, "admin.deleted"));
    } catch {
      setServerError(t(locale, "admin.uploadError"));
    }
  };

  const handleSaveAlt = async (item: MediaItem) => {
    const alt = altDrafts[item.path] ?? item.alt;
    setServerError(null);
    setMessage(null);
    try {
      const res = await fetch("/api/admin/media", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ path: item.path, alt }),
      });
      if (!res.ok) {
        setServerError("error");
        return;
      }
      setItems((prev) => prev.map((media) => (media.path === item.path ? { ...media, alt } : media)));
      setAltDrafts((prev) => {
        const next = { ...prev };
        delete next[item.path];
        return next;
      });
      setMessage(t(locale, "admin.altSaved"));
    } catch {
      setServerError(t(locale, "admin.uploadError"));
    }
  };

  return (
    <div>
      {/* ─── Upload ─── */}
      <div
        className="p-5 sm:p-6 rounded-2xl mb-8"
        style={{ background: "#121316", border: "1px solid rgba(255,255,255,0.06)" }}
      >
        <div className="flex items-end gap-4 flex-wrap">
          <div className="flex-1 min-w-[220px]">
            <label
              className="font-mono text-label font-semibold tracking-[0.12em] uppercase mb-2 block"
              style={{ color: "rgba(255,255,255,0.45)" }}
            >
              {t(locale, "admin.upload")}
            </label>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp,image/gif,image/svg+xml"
              onChange={(e) => handleSelect(e.target.files?.[0] ?? null)}
              className="w-full text-sm"
              style={{ color: "rgba(255,255,255,0.6)" }}
            />
            <p className="font-body text-xs mt-2" style={{ color: "rgba(255,255,255,0.35)" }}>
              JPG · PNG · WebP · GIF · SVG — max 5 MB
            </p>
          </div>

          {previewUrl && selected && (
            <div className="w-24 h-24 rounded-xl overflow-hidden flex-shrink-0" style={{ border: "1px solid rgba(255,255,255,0.08)" }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={previewUrl} alt={selected.name} className="w-full h-full object-cover" />
            </div>
          )}

          <button
            onClick={handleUpload}
            disabled={!selected || uploading}
            className="font-body text-sm font-medium px-6 py-2.5 rounded-full transition-all duration-300"
            style={{
              color: !selected || uploading ? "rgba(244,246,248,0.3)" : "#0A0A0B",
              background: !selected || uploading ? "rgba(255,255,255,0.06)" : "#F4F6F8",
              cursor: !selected || uploading ? "default" : "pointer",
              border: "none",
            }}
          >
            {uploading ? t(locale, "admin.uploading") : t(locale, "admin.upload")}
          </button>
        </div>

        {(clientError || serverError) && (
          <p className="font-body text-sm mt-4" style={{ color: "#EF4444" }}>
            {clientError ?? serverError}
          </p>
        )}
        {message && (
          <p className="font-body text-sm mt-4" style={{ color: "#22C55E" }}>
            {message}
          </p>
        )}
      </div>

      {/* ─── Grid ─── */}
      {items.length === 0 ? (
        <p className="font-body text-sm" style={{ color: "rgba(255,255,255,0.4)" }}>
          {t(locale, "admin.noMedia")}
        </p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item) => (
            <div
              key={item.path}
              className="rounded-2xl overflow-hidden"
              style={{ background: "#121316", border: "1px solid rgba(255,255,255,0.06)" }}
            >
              <div
                className="aspect-[16/10] flex items-center justify-center overflow-hidden"
                style={{ background: "#0A0A0B", borderBottom: "1px solid rgba(255,255,255,0.06)" }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={item.path}
                  alt={item.alt || item.name}
                  className="w-full h-full object-contain"
                />
              </div>

              <div className="p-4">
                <p className="font-mono text-label-lg truncate" style={{ color: "#F4F6F8" }}>
                  {item.name}
                </p>
                <p className="font-mono text-label mt-1" style={{ color: "rgba(255,255,255,0.4)" }}>
                  {item.mime} · {formatFileSize(item.size)} · {formatDate(item.uploadedAt, locale)}
                </p>

                <div className="flex items-center gap-2 mt-3">
                  <input
                    type="text"
                    value={altDrafts[item.path] ?? item.alt}
                    onChange={(e) =>
                      setAltDrafts((prev) => ({ ...prev, [item.path]: e.target.value }))
                    }
                    placeholder={t(locale, "admin.alt")}
                    className="flex-1 min-w-0 text-sm outline-none rounded-lg px-3 py-1.5 transition-all duration-200"
                    style={{
                      background: "rgba(255,255,255,0.02)",
                      border: "1px solid rgba(255,255,255,0.08)",
                      color: "#F4F6F8",
                    }}
                  />
                  <button
                    onClick={() => handleSaveAlt(item)}
                    disabled={(altDrafts[item.path] ?? item.alt) === item.alt && !(altDrafts[item.path] !== undefined)}
                    className="font-mono text-label-sm font-semibold uppercase tracking-[0.12em] px-3 py-2 rounded-lg transition-all duration-200 flex-shrink-0"
                    style={{
                      color: "#FFFFFF",
                      background: "#F4F6F8",
                      border: "none",
                      cursor: "pointer",
                    }}
                  >
                    {t(locale, "admin.saveAlt")}
                  </button>
                </div>

                {item.references.length > 0 ? (
                  <div className="mt-3 px-3 py-2 rounded-lg" style={{ background: "rgba(251,191,36,0.06)", border: "1px solid rgba(251,191,36,0.15)" }}>
                    <p className="font-body text-label-lg" style={{ color: "#FBBF24" }}>
                      {t(locale, "admin.inUse")}
                    </p>
                    <p className="font-mono text-label mt-1" style={{ color: "rgba(255,255,255,0.5)" }}>
                      {item.references.map((ref) => `${ref.kind}/${ref.id} (${ref.field})`).join(", ")}
                    </p>
                  </div>
                ) : (
                  <button
                    onClick={() => handleDelete(item)}
                    className="font-body text-xs mt-3 px-4 py-1.5 rounded-full transition-colors duration-200 cursor-pointer"
                    style={{ color: "#EF4444", background: "transparent", border: "1px solid rgba(239,68,68,0.25)" }}
                  >
                    {t(locale, "admin.delete")}
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
