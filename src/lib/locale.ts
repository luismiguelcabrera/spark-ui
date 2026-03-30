"use client";

import { createContext, useContext } from "react";
import { defaultMessages } from "./default-messages";

export type LocaleContextValue = {
  /** Current locale string (e.g. "en", "ar", "fr") */
  locale: string;
  /** Message lookup map */
  messages: Record<string, string>;
  /** Whether current locale is RTL */
  isRtl: boolean;
  /** "rtl" or "ltr" */
  dir: "rtl" | "ltr";
};

export const LocaleContext = createContext<LocaleContextValue>({
  locale: "en",
  messages: defaultMessages,
  isRtl: false,
  dir: "ltr",
});

export type UseLocaleReturn = {
  /** Current locale string */
  locale: string;
  /** Look up a translated string by key, with optional fallback */
  t: (key: string, fallback?: string) => string;
  /** Whether the current locale is RTL */
  isRtl: boolean;
  /** "rtl" or "ltr" */
  dir: "rtl" | "ltr";
};

/**
 * Access the current locale context.
 *
 * @returns Locale info and a `t()` translation function.
 *
 * @example
 * ```tsx
 * const { t, isRtl } = useLocale();
 * return <button>{t("common.close")}</button>;
 * ```
 */
export function useLocale(): UseLocaleReturn {
  const ctx = useContext(LocaleContext);

  function t(key: string, fallback?: string): string {
    return ctx.messages[key] ?? fallback ?? key;
  }

  return {
    locale: ctx.locale,
    t,
    isRtl: ctx.isRtl,
    dir: ctx.dir,
  };
}
