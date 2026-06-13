"use client";

import Link from "next/link";
import Image from "next/image";
import { Menu, Settings, X } from "lucide-react";
import { useEffect, useState } from "react";
import { LanguageSwitcher } from "@/components/ui/LanguageSwitcher";
import { useLocale } from "@/context/LocaleContext";
import { cn } from "@/lib/utils";

const navItems = [
  { labelKey: "home", href: "#home" },
  { labelKey: "menu", href: "#signature" },
  { labelKey: "branches", href: "#branches" },
  { labelKey: "locations", href: "#locations" },
  { labelKey: "about", href: "#about" },
] as const;

export function Navbar() {
  const { t } = useLocale();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 24);
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 border-b transition-all duration-300",
        isScrolled || isOpen
          ? "border-white/10 bg-[#0F0F0F]/95 shadow-2xl shadow-black/40 backdrop-blur-xl"
          : "border-transparent bg-transparent"
      )}
    >
      <nav className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link
          href="#home"
          className="group inline-flex items-center gap-3 text-white transition-colors hover:text-[#FFC107]"
          aria-label="Flamze home"
        >
          <Image
            src="/flamze-logo.png"
            alt=""
            width={40}
            height={40}
            className="h-10 w-10 shrink-0 rounded shadow-lg shadow-red-950/40 transition-transform duration-300 group-hover:scale-105"
            priority
          />
          <span className="flex flex-col leading-none">
            <span className="text-lg font-black uppercase tracking-[0.18em]">
              Flamez
            </span>
            <span className="mt-1 text-[10px] font-bold uppercase tracking-[0.22em] text-zinc-400 transition-colors group-hover:text-[#FFC107]/80">
              Hotpot & BBQ
            </span>
          </span>
        </Link>

        <div className="hidden items-center gap-5 lg:gap-8 md:flex">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-xs font-semibold uppercase tracking-[0.22em] text-zinc-300 transition-colors hover:text-[#FFC107]"
            >
              {t.nav[item.labelKey]}
            </Link>
          ))}
        </div>

        <div className="hidden items-center gap-3 md:flex">
          <LanguageSwitcher />
          <Link
            href="#branches"
            className="rounded border border-[#FFC107]/80 px-5 py-2 text-xs font-bold uppercase tracking-[0.18em] text-[#FFC107] transition-all duration-300 hover:bg-[#FFC107] hover:text-black"
          >
            {t.nav.viewMenu}
          </Link>
          <Link
            href="/admin"
            aria-label="Admin"
            className="rounded border border-white/10 p-2 text-zinc-500 transition-colors hover:border-white/20 hover:text-white"
          >
            <Settings className="h-4 w-4" />
          </Link>
        </div>

        <button
          type="button"
          onClick={() => setIsOpen((open) => !open)}
          className="rounded border border-white/10 p-2 text-white transition-colors hover:border-[#FFC107]/60 hover:text-[#FFC107] md:hidden"
          aria-label="Toggle navigation"
          aria-expanded={isOpen}
        >
          {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </nav>

      {isOpen && (
        <div className="border-t border-white/10 bg-[#0F0F0F] px-4 pb-5 md:hidden">
          <div className="flex flex-col gap-1 py-4">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsOpen(false)}
                className="rounded px-3 py-3 text-sm font-semibold uppercase tracking-[0.2em] text-zinc-200 transition-colors hover:bg-white/5 hover:text-[#FFC107]"
              >
                {t.nav[item.labelKey]}
              </Link>
            ))}
          </div>
          <div className="flex items-center justify-between gap-3">
            <LanguageSwitcher />
            <Link
              href="#branches"
              onClick={() => setIsOpen(false)}
              className="flex-1 rounded border border-[#FFC107]/80 px-4 py-3 text-center text-xs font-bold uppercase tracking-[0.18em] text-[#FFC107]"
            >
              {t.nav.viewMenu}
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
