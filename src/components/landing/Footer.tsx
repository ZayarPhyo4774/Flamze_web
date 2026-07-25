"use client";

import Link from "next/link";
import { Camera, Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import { useLocale } from "@/context/LocaleContext";

const links = [
  { labelKey: "home", href: "/#home" },
  { labelKey: "menu", href: "/#signature" },
  { labelKey: "branches", href: "/#branches" },
  { labelKey: "about", href: "/#about" },
  { labelKey: "admin", href: "/admin" },
] as const;

const COPYRIGHT_YEAR = 2026;

export function Footer() {
  const { t } = useLocale();

  return (
    <footer className="border-t border-white/10 bg-[#0F0F0F] px-4 py-14 sm:px-6">
      <div className="mx-auto grid max-w-7xl gap-10 md:grid-cols-[1.2fr_0.8fr_1fr]">
        <div>
          <Link
            href="/#home"
            className="text-lg font-black uppercase tracking-[0.28em] text-white"
          >
            HOTPOT & BBQ
          </Link>
          <p className="mt-5 max-w-sm text-sm leading-7 text-zinc-500">
            {t.landing.footerDescription}
          </p>
          <div className="mt-6 flex gap-3">
            <Link
              href="/#home"
              aria-label="Instagram"
              className="rounded border border-white/10 p-2 text-zinc-400 transition-colors hover:border-[#FFC107]/60 hover:text-[#FFC107]"
            >
              <Camera className="h-4 w-4" />
            </Link>
            <Link
              href="/#home"
              aria-label="Facebook"
              className="rounded border border-white/10 p-2 text-zinc-400 transition-colors hover:border-[#FFC107]/60 hover:text-[#FFC107]"
            >
              <MessageCircle className="h-4 w-4" />
            </Link>
          </div>
        </div>

        <div>
          <h3 className="mb-5 text-xs font-bold uppercase tracking-[0.28em] text-[#FFC107]">
            Links
            {t.landing.footerLinks}
          </h3>
          <div className="grid gap-3">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm text-zinc-400 transition-colors hover:text-white"
              >
                {t.nav[link.labelKey]}
              </Link>
            ))}
          </div>
        </div>

        <div>
          <h3 className="mb-5 text-xs font-bold uppercase tracking-[0.28em] text-[#FFC107]">
            Contact
            {t.landing.footerContact}
          </h3>
          <div className="space-y-4 text-sm text-zinc-400">
            <p className="flex gap-3">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-[#E53935]" />
              {t.landing.footerLocation}
            </p>
            <p className="flex gap-3">
              <Phone className="mt-0.5 h-4 w-4 shrink-0 text-[#E53935]" />
              +95 9 970 980 990
            </p>
            <p className="flex gap-3">
              <Mail className="mt-0.5 h-4 w-4 shrink-0 text-[#E53935]" />
              reservations@hotpotbbq.com
            </p>
          </div>
        </div>
      </div>

      <div className="mx-auto mt-12 flex max-w-7xl flex-col gap-3 border-t border-white/10 pt-6 text-xs text-zinc-600 sm:flex-row sm:items-center sm:justify-between">
        <p>© {COPYRIGHT_YEAR} HOTPOT & BBQ. {t.landing.footerRights}</p>
        <p className="uppercase tracking-[0.2em]">{t.landing.footerTagline}</p>
      </div>
    </footer>
  );
}
