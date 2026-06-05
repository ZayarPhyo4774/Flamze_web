"use client";

import { MapPin } from "lucide-react";

interface MenuHeaderProps {
  branchName: string;
  branchAddress?: string | null;
}

export function MenuHeader({ branchName, branchAddress }: MenuHeaderProps) {
  return (
    <header className="sticky top-0 z-30 border-b border-zinc-800 bg-black/95 backdrop-blur-md">
      <div className="mx-auto flex max-w-2xl items-center gap-3 px-4 py-4">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-red-600 to-red-800 shadow-lg shadow-red-900/40">
          <span className="text-lg font-bold text-white">F</span>
        </div>
        <div>
          <h1 className="text-lg font-bold text-white leading-tight">{branchName}</h1>
          {branchAddress && (
            <p className="flex items-center gap-1 text-xs text-zinc-500">
              <MapPin className="h-3 w-3" />
              {branchAddress}
            </p>
          )}
        </div>
      </div>
    </header>
  );
}
