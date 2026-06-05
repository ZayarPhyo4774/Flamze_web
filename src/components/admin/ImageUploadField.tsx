"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import { Upload, Loader2, X } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { cn } from "@/lib/utils";

interface ImageUploadFieldProps {
  value: string;
  onChange: (url: string) => void;
  label?: string;
}

export function ImageUploadField({
  value,
  onChange,
  label = "Image",
}: ImageUploadFieldProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  const handleUpload = async (file: File) => {
    setUploading(true);
    setError("");

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/upload", {
        method: "POST",
        headers: { "x-flamze-csrf": "1" },
        body: formData,
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error ?? "Upload failed");
        return;
      }

      onChange(data.url);
    } catch {
      setError("Upload failed");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-3">
      <label className="block text-sm font-medium text-zinc-300">{label}</label>

      {value && (
        <div className="relative h-32 w-full overflow-hidden rounded-xl border border-zinc-700">
          <Image src={value} alt="Preview" fill className="object-cover" sizes="400px" />
          <button
            type="button"
            onClick={() => onChange("")}
            className="absolute right-2 top-2 rounded-lg bg-black/70 p-1.5 text-zinc-300 hover:text-white"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      <div className="flex gap-2">
        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) handleUpload(file);
          }}
        />
        <Button
          type="button"
          variant="secondary"
          size="sm"
          disabled={uploading}
          onClick={() => inputRef.current?.click()}
        >
          {uploading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Upload className="h-4 w-4" />
          )}
          {uploading ? "Uploading..." : "Upload Image"}
        </Button>
      </div>

      <Input
        id="image-url"
        label="Or paste image URL"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="https://... or /uploads/menu/..."
      />

      {error && <p className={cn("text-xs text-red-400")}>{error}</p>}
    </div>
  );
}
