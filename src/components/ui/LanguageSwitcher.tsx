"use client";

import { localeLabels, type Locale } from "@/i18n/translations";
import { useLocale, locales } from "@/context/LocaleContext";
import { cn } from "@/lib/utils";

interface LanguageSwitcherProps {
  className?: string;
}

export function LanguageSwitcher({ className }: LanguageSwitcherProps) {
  const { locale, setLocale } = useLocale();

  return (
    <div className={cn("flex rounded-lg border border-zinc-800 bg-zinc-950 p-0.5", className)}>
      {locales.map((loc) => (
        <button
          key={loc}
          onClick={() => setLocale(loc as Locale)}
          className={cn(
            "rounded-md px-2.5 py-1 text-xs font-medium transition-colors",
            locale === loc
              ? "bg-red-600 text-white"
              : "text-zinc-400 hover:text-white"
          )}
        >
          {localeLabels[loc as Locale]}
        </button>
      ))}
    </div>
  );
}
