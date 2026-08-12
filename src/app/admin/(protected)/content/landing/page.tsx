"use client";

import { useEffect, useState } from "react";
import { ArrowDown, ArrowUp, Eye, EyeOff, Film, Save } from "lucide-react";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { ImageUploadField } from "@/components/admin/ImageUploadField";
import type { LandingPageContent, LandingSectionContent } from "@/lib/types";
import { adminHeaders } from "@/lib/admin-fetch";

export default function AdminLandingContentPage() {
  const [landing, setLanding] = useState<LandingPageContent | null>(null);
  const [sections, setSections] = useState<LandingSectionContent[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    void fetch("/api/site-content")
      .then(async (res) => {
        if (!res.ok) throw new Error("Failed to load content");
        return res.json();
      })
      .then((data: { landing: LandingPageContent; sections: LandingSectionContent[] }) => {
        if (cancelled) return;
        setLanding(data.landing);
        setSections(data.sections);
        setLoading(false);
      })
      .catch((e: Error) => {
        if (!cancelled) {
          setError(e.message);
          setLoading(false);
        }
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const updateLanding = <K extends keyof LandingPageContent>(
    key: K,
    value: LandingPageContent[K]
  ) => {
    setLanding((prev) => (prev ? { ...prev, [key]: value } : prev));
  };

  const updateSection = (
    id: string,
    patch: Partial<LandingSectionContent>
  ) => {
    setSections((prev) =>
      prev.map((section) => (section.id === id ? { ...section, ...patch } : section))
    );
  };

  const moveSection = (index: number, direction: -1 | 1) => {
    setSections((prev) => {
      const next = [...prev];
      const target = index + direction;
      if (target < 0 || target >= next.length) return prev;
      [next[index], next[target]] = [next[target], next[index]];
      return next.map((section, i) => ({ ...section, sortOrder: (i + 1) * 10 }));
    });
  };

  const handleVideoUpload = async (
    file: File,
    target: "heroVideoUrl" | "heroVideoUrlMobile"
  ) => {
    setUploading(true);
    setError(null);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("kind", "hero-video");
      const res = await fetch("/api/upload", {
        method: "POST",
        headers: adminHeaders(),
        body: formData,
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Upload failed");
      updateLanding(target, data.url);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async () => {
    if (!landing) return;
    setSaving(true);
    setError(null);
    setSuccess(null);
    try {
      const res = await fetch("/api/site-content", {
        method: "PUT",
        headers: adminHeaders({ "Content-Type": "application/json" }),
        body: JSON.stringify({ landing, sections }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Save failed");
      setLanding(data.landing);
      setSections(data.sections);
      setSuccess("Landing content saved.");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Save failed");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col lg:flex-row">
      <AdminSidebar />
      <main className="flex-1 p-6 lg:p-8">
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white">Landing Content</h1>
            <p className="text-sm text-zinc-500">
              Manage hero media, copy, and section visibility/order
            </p>
          </div>
          <Button variant="primary" onClick={handleSave} disabled={saving || !landing}>
            <Save className="h-4 w-4" />
            {saving ? "Saving..." : "Save Changes"}
          </Button>
        </div>

        {error && (
          <div className="mb-4 rounded-xl border border-red-800/50 bg-red-900/20 px-4 py-3 text-sm text-red-400">
            {error}
          </div>
        )}
        {success && (
          <div className="mb-4 rounded-xl border border-emerald-800/50 bg-emerald-900/20 px-4 py-3 text-sm text-emerald-400">
            {success}
          </div>
        )}

        {loading || !landing ? (
          <div className="py-12 text-center text-zinc-500">Loading...</div>
        ) : (
          <div className="space-y-8">
            <section className="rounded-2xl border border-zinc-800 bg-zinc-900/30 p-5">
              <h2 className="mb-4 text-lg font-semibold text-white">Hero</h2>
              <div className="grid gap-4 md:grid-cols-2">
                <Input
                  id="eyebrowEn"
                  label="Eyebrow (EN)"
                  value={landing.eyebrowEn}
                  onChange={(e) => updateLanding("eyebrowEn", e.target.value)}
                />
                <Input
                  id="eyebrowMy"
                  label="Eyebrow (MY)"
                  value={landing.eyebrowMy ?? ""}
                  onChange={(e) => updateLanding("eyebrowMy", e.target.value)}
                />
                <Input
                  id="titleEn"
                  label="Title (EN)"
                  value={landing.titleEn}
                  onChange={(e) => updateLanding("titleEn", e.target.value)}
                />
                <Input
                  id="titleMy"
                  label="Title (MY)"
                  value={landing.titleMy ?? ""}
                  onChange={(e) => updateLanding("titleMy", e.target.value)}
                />
                <Input
                  id="subtitleEn"
                  label="Subtitle (EN)"
                  value={landing.subtitleEn}
                  onChange={(e) => updateLanding("subtitleEn", e.target.value)}
                />
                <Input
                  id="subtitleMy"
                  label="Subtitle (MY)"
                  value={landing.subtitleMy ?? ""}
                  onChange={(e) => updateLanding("subtitleMy", e.target.value)}
                />
                <Input
                  id="ctaLabelEn"
                  label="CTA Label (EN)"
                  value={landing.ctaLabelEn}
                  onChange={(e) => updateLanding("ctaLabelEn", e.target.value)}
                />
                <Input
                  id="ctaLabelMy"
                  label="CTA Label (MY)"
                  value={landing.ctaLabelMy ?? ""}
                  onChange={(e) => updateLanding("ctaLabelMy", e.target.value)}
                />
                <Input
                  id="ctaHref"
                  label="CTA Href"
                  value={landing.ctaHref}
                  onChange={(e) => updateLanding("ctaHref", e.target.value)}
                />
                <Input
                  id="heroVideoUrl"
                  label="Desktop Hero Video URL (16:9)"
                  value={landing.heroVideoUrl}
                  onChange={(e) => updateLanding("heroVideoUrl", e.target.value)}
                />
                <Input
                  id="heroVideoUrlMobile"
                  label="Mobile Hero Video URL (9:16)"
                  value={landing.heroVideoUrlMobile ?? ""}
                  onChange={(e) => updateLanding("heroVideoUrlMobile", e.target.value || null)}
                />
                <Input
                  id="heroPosterUrl"
                  label="Desktop Poster URL"
                  value={landing.heroPosterUrl ?? ""}
                  onChange={(e) => updateLanding("heroPosterUrl", e.target.value || null)}
                />
                <Input
                  id="heroPosterUrlMobile"
                  label="Mobile Poster URL"
                  value={landing.heroPosterUrlMobile ?? ""}
                  onChange={(e) => updateLanding("heroPosterUrlMobile", e.target.value || null)}
                />
              </div>
              <div className="mt-4 space-y-3">
                <div className="flex flex-wrap items-center gap-3">
                  <label className="inline-flex cursor-pointer items-center gap-2 rounded-xl border border-zinc-700 px-4 py-2 text-sm text-zinc-300 hover:border-zinc-500">
                    <Film className="h-4 w-4" />
                    {uploading ? "Uploading..." : "Upload Desktop Video (16:9)"}
                    <input
                      type="file"
                      accept="video/mp4,video/webm"
                      className="hidden"
                      disabled={uploading}
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) void handleVideoUpload(file, "heroVideoUrl");
                        e.target.value = "";
                      }}
                    />
                  </label>
                  <p className="text-xs text-zinc-500">1920×1080 recommended · MP4/WebM up to 50MB</p>
                </div>
                <div className="flex flex-wrap items-center gap-3">
                  <label className="inline-flex cursor-pointer items-center gap-2 rounded-xl border border-zinc-700 px-4 py-2 text-sm text-zinc-300 hover:border-zinc-500">
                    <Film className="h-4 w-4" />
                    {uploading ? "Uploading..." : "Upload Mobile Video (9:16)"}
                    <input
                      type="file"
                      accept="video/mp4,video/webm"
                      className="hidden"
                      disabled={uploading}
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) void handleVideoUpload(file, "heroVideoUrlMobile");
                        e.target.value = "";
                      }}
                    />
                  </label>
                  <p className="text-xs text-zinc-500">
                    1080×1920 recommended · Falls back to desktop video if empty
                  </p>
                </div>
              </div>
            </section>

            <section className="rounded-2xl border border-zinc-800 bg-zinc-900/30 p-5">
              <h2 className="mb-4 text-lg font-semibold text-white">Sections</h2>
              <div className="space-y-4">
                {sections.map((section, index) => (
                  <div
                    key={section.id}
                    className="rounded-xl border border-zinc-800 bg-zinc-950/50 p-4"
                  >
                    <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                      <div>
                        <p className="font-medium uppercase tracking-wide text-white">
                          {section.key}
                        </p>
                        <p className="text-xs text-zinc-500">Order {section.sortOrder}</p>
                      </div>
                      <div className="flex items-center gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => moveSection(index, -1)}
                          disabled={index === 0}
                          title="Move up"
                        >
                          <ArrowUp className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => moveSection(index, 1)}
                          disabled={index === sections.length - 1}
                          title="Move down"
                        >
                          <ArrowDown className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() =>
                            updateSection(section.id, { isVisible: !section.isVisible })
                          }
                          title={section.isVisible ? "Hide" : "Show"}
                        >
                          {section.isVisible ? (
                            <Eye className="h-4 w-4 text-emerald-400" />
                          ) : (
                            <EyeOff className="h-4 w-4 text-zinc-500" />
                          )}
                        </Button>
                      </div>
                    </div>
                    <div className="grid gap-3 md:grid-cols-2">
                      <Input
                        id={`${section.id}-eyebrowEn`}
                        label="Eyebrow (EN)"
                        value={section.eyebrowEn ?? ""}
                        onChange={(e) =>
                          updateSection(section.id, { eyebrowEn: e.target.value })
                        }
                      />
                      <Input
                        id={`${section.id}-eyebrowMy`}
                        label="Eyebrow (MY)"
                        value={section.eyebrowMy ?? ""}
                        onChange={(e) =>
                          updateSection(section.id, { eyebrowMy: e.target.value })
                        }
                      />
                      <Input
                        id={`${section.id}-titleEn`}
                        label="Title (EN)"
                        value={section.titleEn ?? ""}
                        onChange={(e) =>
                          updateSection(section.id, { titleEn: e.target.value })
                        }
                      />
                      <Input
                        id={`${section.id}-titleMy`}
                        label="Title (MY)"
                        value={section.titleMy ?? ""}
                        onChange={(e) =>
                          updateSection(section.id, { titleMy: e.target.value })
                        }
                      />
                      <Input
                        id={`${section.id}-descriptionEn`}
                        label="Description (EN)"
                        value={section.descriptionEn ?? ""}
                        onChange={(e) =>
                          updateSection(section.id, { descriptionEn: e.target.value })
                        }
                      />
                      <Input
                        id={`${section.id}-descriptionMy`}
                        label="Description (MY)"
                        value={section.descriptionMy ?? ""}
                        onChange={(e) =>
                          updateSection(section.id, { descriptionMy: e.target.value })
                        }
                      />
                      <Input
                        id={`${section.id}-ctaLabelEn`}
                        label="CTA Label (EN)"
                        value={section.ctaLabelEn ?? ""}
                        onChange={(e) =>
                          updateSection(section.id, { ctaLabelEn: e.target.value })
                        }
                      />
                      <Input
                        id={`${section.id}-ctaHref`}
                        label="CTA Href"
                        value={section.ctaHref ?? ""}
                        onChange={(e) =>
                          updateSection(section.id, { ctaHref: e.target.value })
                        }
                      />
                      {(section.key === "about" || section.key === "cta") && (
                        <div className="md:col-span-2">
                          <ImageUploadField
                            label={
                              section.key === "about"
                                ? "Section Image (About)"
                                : "Background Image (CTA)"
                            }
                            value={section.imageUrl ?? ""}
                            onChange={(url) =>
                              updateSection(section.id, { imageUrl: url || null })
                            }
                          />
                          <p className="mt-1 text-xs text-zinc-500">
                            {section.key === "about"
                              ? "3:2 or 16:9 recommended · left-side photo"
                              : "16:9 recommended · full-width banner background"}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>
        )}
      </main>
    </div>
  );
}
