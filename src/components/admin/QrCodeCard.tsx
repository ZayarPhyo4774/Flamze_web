"use client";

import { useRef } from "react";
import { QRCodeCanvas } from "qrcode.react";
import { Download, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { getMenuUrl } from "@/lib/utils";

interface QrCodeCardProps {
  branchName: string;
  branchSlug: string;
  siteUrl?: string;
  size?: number;
}

export function QrCodeCard({
  branchName,
  branchSlug,
  siteUrl,
  size = 200,
}: QrCodeCardProps) {
  const canvasRef = useRef<HTMLDivElement>(null);
  const menuUrl =
    siteUrl ??
    (typeof window !== "undefined"
      ? getMenuUrl(branchSlug, window.location.origin)
      : getMenuUrl(branchSlug));

  const handleDownload = () => {
    const canvas = canvasRef.current?.querySelector("canvas");
    if (!canvas) return;

    const url = canvas.toDataURL("image/png");
    const link = document.createElement("a");
    link.href = url;
    link.download = `flamze-${branchSlug}-qr.png`;
    link.click();
  };

  return (
    <div className="flex flex-col items-center rounded-2xl border border-zinc-800 bg-zinc-900/40 p-6">
      <div ref={canvasRef} className="rounded-xl bg-white p-3">
        <QRCodeCanvas
          value={menuUrl}
          size={size}
          level="H"
          includeMargin={false}
          imageSettings={{
            src : "/flamze-logo.png",
            height : 40,
            width : 40,
            excavate: true
          }}
        />
      </div>

      <h3 className="mt-4 font-semibold text-white">{branchName}</h3>
      <p className="mt-1 max-w-xs break-all text-center text-xs text-zinc-500">{menuUrl}</p>

      <div className="mt-4 flex gap-2">
        <Button variant="secondary" size="sm" onClick={handleDownload}>
          <Download className="h-4 w-4" />
          Download PNG
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => window.open(menuUrl, "_blank")}
        >
          <ExternalLink className="h-4 w-4" />
          Open Menu
        </Button>
      </div>
    </div>
  );
}
