"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { Locale } from "@/lib/types";
import { t } from "@/lib/utils";
import type { MediaItem } from "@/services/media";
import { isAllowedMediaType, isMediaTooLarge, formatFileSize } from "@/lib/mediaShared";

interface MediaPickerProps {
  locale: Locale;
  open: boolean;
  onClose: () => void;
  onSelect: (path: string) => void;
}

/**
 * Knihovna médií pro výběr obrázku do obsahového pole.
 * Upload uvnitř pickeru jde přes stejný endpoint jako MediaManager —
 * žádná duplikace upload logiky.
 */
export default function MediaPicker({ locale, open, onClose, onSelect }: MediaPickerProps) {
  const [items, setItems] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [selected, setSelected] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setLoadError(null);
    try {
      const res = await fetch("/api/admin/media");
      const data = await res.json();
      if (!res.ok) {
        setLoadError(data?.error ?? "error");
        return;
      }
      setItems(data.items ?? []);
    } catch {
      setLoadError("error");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (open) {
      load();
      setSelected(null);
      setUploadError(null);
    }
  }, [open, load]);

  if (!open) return null;

  const handleSelectFile = (file: File | null) => {
    setUploadError(null);
    if (!file) {
      setSelected(null);
      return;
    }
    if (!isAllowedMediaType(file.type)) {
      setUploadError(t(locale, "admin.invalidType"));
      setSelected(null);
      return;
    }
    if (isMediaTooLarge(file.size)) {
      setUploadError(t(locale, "admin.tooLarge"));
      setSelected(null);
      return;
    }
    setSelected(file);
  };

  const handleUpload = async () => {
    if (!selected || uploading) return;
    setUploading(true);
    setUploadError(null);
    try {
      const formData = new FormData();
      formData.append("file", selected);
      const res = await fetch("/api/admin/media", { method: "POST", body: formData });
      const data = await res.json();
      if (!res.ok) {
        setUploadError(data?.error ?? t(locale, "admin.uploadError"));
        return;
      }
      setItems((prev) => [data.item, ...prev]);
      onSelect(data.item.path);
      setSelected(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
    } catch {
      setUploadError(t(locale, "admin.uploadError"));
    } finally {
      setUploading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-8"
      style={{ background: "rgba(255,255,255,0.4)" }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      role="dialog"
      aria-modal="true"
    >
      <div
        className="w-full max-w-3xl max-h-[85vh] flex flex-col rounded-2xl overflow-hidden"
        style={{ background: "#121316", border: "1px solid rgba(255,255,255,0.08)" }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4" style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
          <h2 className="font-heading" style={{ fontSize: 18, color: "#F4F6F8" }}>
            {t(locale, "admin.mediaLibrary")}
          </h2>
          <button
            onClick={onClose}
            className="font-mono text-label font-semibold uppercase tracking-[0.12em] px-3 py-1.5 rounded-full transition-colors duration-200 cursor-pointer"
            style={{ color: "rgba(255,255,255,0.5)", background: "rgba(255,255,255,0.05)", border: "none" }}
          >
            {t(locale, "ui.close")}
          </button>
        </div>

        {/* Upload */}
        <div className="px-6 py-4" style={{ borderBottom: "1px solid rgba(255,255,255,0.06)", background: "#0A0A0B" }}>
          <div className="flex items-center gap-3 flex-wrap">
            <input
              ref={fileInputRef}
              type="file"
              accept={ALLOWED_ACCEPT}
              onChange={(e) => handleSelectFile(e.target.files?.[0] ?? null)}
              className="flex-1 min-w-[200px] text-sm"
              style={{ color: "rgba(255,255,255,0.6)" }}
            />
            <button
              onClick={handleUpload}
              disabled={!selected || uploading}
              className="font-body text-sm font-medium px-5 py-2 rounded-full transition-all duration-300"
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
          {uploadError && (
            <p className="font-body text-xs mt-2" style={{ color: "#EF4444" }}>
              {uploadError}
            </p>
          )}
        </div>

        {/* Grid */}
        <div className="flex-1 overflow-y-auto p-6">
          {loading ? (
            <p className="font-body text-sm" style={{ color: "rgba(255,255,255,0.4)" }}>
              {t(locale, "ui.loading")}
            </p>
          ) : loadError ? (
            <p className="font-body text-sm" style={{ color: "#EF4444" }}>
              {t(locale, "ui.loadFailed")}
            </p>
          ) : items.length === 0 ? (
            <p className="font-body text-sm" style={{ color: "rgba(255,255,255,0.4)" }}>
              {t(locale, "admin.noMedia")}
            </p>
          ) : (
            <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-4">
              {items.map((item) => (
                <button
                  key={item.path}
                  onClick={() => {
                    onSelect(item.path);
                    onClose();
                  }}
                  className="text-left rounded-xl overflow-hidden transition-all duration-200 cursor-pointer group"
                  style={{ background: "#0A0A0B", border: "1px solid rgba(255,255,255,0.06)" }}
                >
                  <div className="aspect-[16/10] flex items-center justify-center overflow-hidden">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={item.path}
                      alt={item.alt || item.name}
                      className="w-full h-full object-contain transition-transform duration-300 group-hover:scale-105"
                    />
                  </div>
                  <div className="px-3 py-2">
                    <p className="font-mono text-label truncate" style={{ color: "#F4F6F8" }}>
                      {item.name}
                    </p>
                    <p className="font-mono text-label-sm mt-0.5" style={{ color: "rgba(255,255,255,0.4)" }}>
                      {formatFileSize(item.size)}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

const ALLOWED_ACCEPT = "image/jpeg,image/png,image/webp,image/gif,image/svg+xml";
