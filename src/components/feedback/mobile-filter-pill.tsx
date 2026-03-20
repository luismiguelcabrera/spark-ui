"use client";

import { type ReactNode } from "react";
import { cn } from "../../lib/utils";

export type MobileFilterPillProps = {
  active?: boolean;
  onClick: () => void;
  children: ReactNode;
};

export function MobileFilterPill({ active, onClick, children }: MobileFilterPillProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        "px-3 py-1.5 rounded-lg text-sm font-medium border transition-colors",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-1",
        active
          ? "bg-primary/10 text-primary border-primary/20"
          : "bg-white text-slate-700 border-slate-200 hover:border-slate-300",
      )}
    >
      {children}
    </button>
  );
}
MobileFilterPill.displayName = "MobileFilterSheet.Pill";
