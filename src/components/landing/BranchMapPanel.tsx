"use client";

import { useEffect, useRef } from "react";
import type { BranchMapPoint } from "@/lib/branch-map-points";
import "leaflet/dist/leaflet.css";

interface BranchMapPanelProps {
  points: BranchMapPoint[];
}

export function BranchMapPanel({ points }: BranchMapPanelProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<import("leaflet").Map | null>(null);

  useEffect(() => {
    if (!containerRef.current || points.length === 0) return;

    let cancelled = false;

    void import("leaflet").then((leafletModule) => {
      if (cancelled || !containerRef.current) return;

      const L = leafletModule.default;

      mapRef.current?.remove();
      mapRef.current = null;

      const map = L.map(containerRef.current, {
        scrollWheelZoom: false,
        zoomControl: true,
      });
      mapRef.current = map;

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      }).addTo(map);

      const icon = L.divIcon({
        className: "",
        html: `<span style="display:flex;height:2rem;width:2rem;align-items:center;justify-content:center;border-radius:9999px;background:#E53935;color:#fff;box-shadow:0 8px 24px rgba(0,0,0,0.45);border:2px solid #FFC107;font-size:14px;font-weight:700;">&#9679;</span>`,
        iconSize: [32, 32],
        iconAnchor: [16, 32],
        popupAnchor: [0, -28],
      });

      const markers = points.map((point) =>
        L.marker([point.lat, point.lng], { icon })
          .bindPopup(`<strong>${point.name}</strong>`)
          .addTo(map)
      );

      if (points.length === 1) {
        map.setView([points[0].lat, points[0].lng], 14);
      } else {
        map.fitBounds(L.featureGroup(markers).getBounds().pad(0.25));
      }
    });

    return () => {
      cancelled = true;
      mapRef.current?.remove();
      mapRef.current = null;
    };
  }, [points]);

  return <div ref={containerRef} className="absolute inset-0 z-0 h-full w-full" />;
}
