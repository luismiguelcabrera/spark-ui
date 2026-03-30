"use client";

import { useMemo, type ReactNode, createElement } from "react";
import { defaultMessages } from "../../lib/default-messages";
import { LocaleContext, type LocaleContextValue } from "../../lib/locale";

export type LocaleProviderProps = {
  /** Locale identifier (e.g. "en", "ar", "fr"). Defaults to "en" */
  locale?: string;
  /** Message lookup map. Merged with default English messages */
  messages?: Record<string, string>;
  /** Whether the locale is right-to-left */
  rtl?: boolean;
  children: ReactNode;
};

/**
 * Provides locale context (translations, direction) to all children.
 *
 * Sets `dir` attribute on a wrapper div when `rtl` is true.
 *
 * @example
 * ```tsx
 * <LocaleProvider locale="ar" rtl messages={arabicMessages}>
 *   <App />
 * </LocaleProvider>
 * ```
 */
function LocaleProvider({
  locale = "en",
  messages,
  rtl = false,
  children,
}: LocaleProviderProps) {
  const mergedMessages = useMemo(
    () => ({ ...defaultMessages, ...messages }),
    [messages],
  );

  const value = useMemo<LocaleContextValue>(
    () => ({
      locale,
      messages: mergedMessages,
      isRtl: rtl,
      dir: rtl ? "rtl" : "ltr",
    }),
    [locale, mergedMessages, rtl],
  );

  const content = createElement(
    LocaleContext.Provider,
    { value },
    children,
  );

  if (rtl) {
    return createElement("div", { dir: "rtl" }, content);
  }

  return content;
}
LocaleProvider.displayName = "LocaleProvider";

export { LocaleProvider };
