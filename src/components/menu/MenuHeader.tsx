"use client";

import Image from "next/image";
import Link from "next/link";
import { MapPin } from "lucide-react";

interface MenuHeaderProps {
  branchName: string;
  branchAddress?: string | null;
}

export function MenuHeader({ branchName, branchAddress }: MenuHeaderProps) {
  return (
    <header className="sticky top-0 z-30 border-b border-zinc-800 bg-black/95 backdrop-blur-md">
      <div className="mx-auto flex max-w-2xl items-center gap-3 px-4 py-4">
        <Link
          href="/"
          className="group inline-flex shrink-0 items-center transition-transform duration-300 hover:scale-105"
          aria-label="Flamze home"
        >
          <Image
            src="/flamze-logo.png"
            alt="Flamze"
            width={40}
            height={40}
            className="h-10 w-10 rounded shadow-lg shadow-red-950/40"
            priority
          />
        </Link>
        <div>
          <h1 className="text-lg font-bold leading-tight text-white">{branchName}</h1>
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
