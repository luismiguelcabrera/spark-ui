"use client";

import { useState, useCallback } from "react";

type UseClipboardReturn = {
  /** Whether the last copy operation succeeded */
  copied: boolean;
  /** Copy text to clipboard */
  copy: (text: string) => Promise<void>;
  /** Reset copied state */
  reset: () => void;
};

/**
 * Copy text to the clipboard with a temporary "copied" state.
 *
 * @param timeout - How long `copied` stays true (default: 2000ms)
 */
export function useClipboard(timeout = 2000): UseClipboardReturn {
  const [copied, setCopied] = useState(false);

  const copy = useCallback(
    async (text: string) => {
      try {
        await navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), timeout);
      } catch {
        console.warn("[spark-ui] useClipboard: Failed to copy to clipboard");
        setCopied(false);
      }
    },
    [timeout]
  );

  const reset = useCallback(() => setCopied(false), []);

  return { copied, copy, reset };
}
