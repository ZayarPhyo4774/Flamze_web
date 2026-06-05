"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useSyncExternalStore,
  type ReactNode,
} from "react";
import {
  type Locale,
  type TranslationKey,
  translations,
  locales,
} from "@/i18n/translations";

const LOCALE_COOKIE = "flamze-locale";

type LocaleContextValue = {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: TranslationKey;
};

const LocaleContext = createContext<LocaleContextValue | null>(null);

function readStoredLocale(): Locale {
  if (typeof window === "undefined") return "en";
  const stored = localStorage.getItem(LOCALE_COOKIE);
  return stored === "my" ? "my" : "en";
}

const localeListeners = new Set<() => void>();

function subscribeLocale(listener: () => void) {
  localeListeners.add(listener);
  return () => {
    localeListeners.delete(listener);
  };
}

function notifyLocaleListeners() {
  localeListeners.forEach((listener) => listener());
}

export function LocaleProvider({ children }: { children: ReactNode }) {
  const locale = useSyncExternalStore(
    subscribeLocale,
    readStoredLocale,
    () => "en" as Locale
  );

  useEffect(() => {
    document.documentElement.lang = locale;
  }, [locale]);

  const setLocale = useCallback((next: Locale) => {
    localStorage.setItem(LOCALE_COOKIE, next);
    document.cookie = `${LOCALE_COOKIE}=${next};path=/;max-age=31536000;sameSite=lax`;
    notifyLocaleListeners();
  }, []);

  const value = useMemo(
    () => ({
      locale,
      setLocale,
      t: translations[locale],
    }),
    [locale, setLocale]
  );

  return <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>;
}

export function useLocale() {
  const ctx = useContext(LocaleContext);
  if (!ctx) {
    throw new Error("useLocale must be used within LocaleProvider");
  }
  return ctx;
}

export { locales, LOCALE_COOKIE };
