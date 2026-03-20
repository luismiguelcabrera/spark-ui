"use client";

import { createContext, useContext, type KeyboardEvent } from "react";

// ── Context ──────────────────────────────────────────────

export type TabsContextValue = {
  value: string;
  setValue: (value: string) => void;
  baseId: string;
};

export const TabsContext = createContext<TabsContextValue | null>(null);

export function useTabsContext() {
  const ctx = useContext(TabsContext);
  if (!ctx)
    throw new Error("Tabs compound components must be used within <Tabs>");
  return ctx;
}

// ── Keyboard handler for tab list ────────────────────────

export function handleTabListKeyDown(e: KeyboardEvent<HTMLDivElement>) {
  const target = e.target as HTMLElement;
  if (target.getAttribute("role") !== "tab") return;

  const container = e.currentTarget;
  const tabs = Array.from(
    container.querySelectorAll<HTMLButtonElement>('[role="tab"]'),
  );

  const index = tabs.indexOf(target as HTMLButtonElement);
  if (index === -1) return;

  let nextIndex: number | null = null;

  switch (e.key) {
    case "ArrowLeft":
      e.preventDefault();
      nextIndex = (index - 1 + tabs.length) % tabs.length;
      break;
    case "ArrowRight":
      e.preventDefault();
      nextIndex = (index + 1) % tabs.length;
      break;
    case "Home":
      e.preventDefault();
      nextIndex = 0;
      break;
    case "End":
      e.preventDefault();
      nextIndex = tabs.length - 1;
      break;
  }

  if (nextIndex !== null) {
    tabs[nextIndex].focus();
    tabs[nextIndex].click();
  }
}
