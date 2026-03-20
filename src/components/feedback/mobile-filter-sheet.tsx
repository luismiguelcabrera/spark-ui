"use client";

import { useState, useEffect, useCallback, type ReactNode } from "react";
import { cn } from "../../lib/utils";
import { Icon } from "../data-display/icon";
import { MobileFilterSection } from "./mobile-filter-section";
import { MobileFilterPill } from "./mobile-filter-pill";

// --- Types ---

const COLLAPSE_CLASS: Record<string, string> = {
  md: "md:hidden",
  lg: "lg:hidden",
  xl: "xl:hidden",
  "@640px": "@[640px]:hidden",
  "@768px": "@[768px]:hidden",
  "@900px": "@[900px]:hidden",
  "@1024px": "@[1024px]:hidden",
  "@1050px": "@[1050px]:hidden",
};

type MobileFilterSheetProps = {
  children: ReactNode;
  activeCount?: number;
  label?: string;
  collapseAt?: "md" | "lg" | "xl" | "@640px" | "@768px" | "@900px" | "@1024px" | "@1050px";
};

// --- Main component ---

function MobileFilterSheet({
  children,
  activeCount = 0,
  label = "",
  collapseAt = "md",
}: MobileFilterSheetProps) {
  const [isOpen, setIsOpen] = useState(false);
  const hideClass = COLLAPSE_CLASS[collapseAt];

  const close = useCallback(() => setIsOpen(false), []);

  // Escape key to close
  useEffect(() => {
    if (!isOpen) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [isOpen, close]);

  // Lock body scroll when open
  useEffect(() => {
    if (!isOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [isOpen]);

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        aria-label={label || "Filters"}
        className={cn(
          "relative flex items-center gap-1 bg-slate-50 text-slate-700 rounded-lg border border-slate-200 hover:border-slate-300 transition-colors shrink-0 p-2",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2",
          hideClass
        )}
      >
        <Icon name="tune" size="sm" />
        {label && <span className="text-sm font-medium">{label}</span>}
        {activeCount > 0 && (
          <span className="flex items-center justify-center min-w-4 h-4 px-1 text-[10px] font-bold bg-primary text-white rounded-full">
            {activeCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div
          className={cn("fixed inset-0 z-50 flex items-end bg-black/40 backdrop-blur-sm", hideClass)}
          onClick={(e) => {
            if (e.target === e.currentTarget) close();
          }}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-label={label || "Filters"}
            className="w-full bg-white rounded-t-2xl shadow-float max-h-[80vh] flex flex-col"
          >
            <div className="flex justify-center pt-3 pb-1 shrink-0">
              <div className="w-10 h-1 bg-slate-200 rounded-full" />
            </div>
            <div className="flex items-center justify-between px-5 py-3 border-b border-slate-100 shrink-0">
              <h3 className="font-bold text-slate-900 text-base">
                {label}
                {activeCount > 0 && (
                  <span className="ml-2 text-xs font-semibold text-primary">
                    {activeCount} active
                  </span>
                )}
              </h3>
              <button
                type="button"
                aria-label="Close filters"
                onClick={close}
                className="p-1 rounded-lg hover:bg-slate-100 text-slate-600 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              >
                <Icon name="close" size="md" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto px-5 pt-4 pb-10 flex flex-col gap-6">
              {children}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
MobileFilterSheet.displayName = "MobileFilterSheet";

// --- Attach compound sub-components for dot-notation API ---

MobileFilterSheet.Section = MobileFilterSection;
MobileFilterSheet.Pill = MobileFilterPill;

export { MobileFilterSheet, MobileFilterSection, MobileFilterPill };
export type { MobileFilterSheetProps };
