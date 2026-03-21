"use client";

import { useState, type ReactNode } from "react";
import { cn } from "../../lib/utils";
import { Icon } from "../data-display/icon";
import { Sheet } from "./sheet";
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

  const title = (
    <span>
      {label}
      {activeCount > 0 && (
        <span className="ml-2 text-xs font-semibold text-primary">
          {activeCount} active
        </span>
      )}
    </span>
  );

  return (
    <>
      {/* Trigger button — hidden above collapseAt breakpoint */}
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        aria-label={label || "Filters"}
        className={cn(
          "relative flex items-center gap-1 bg-muted/50 text-navy-text rounded-lg border border-muted hover:border-muted transition-colors shrink-0 p-2",
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

      {/* Bottom sheet — powered by the shared Sheet component */}
      <Sheet
        open={isOpen}
        onOpenChange={setIsOpen}
        side="bottom"
        size="md"
        title={label ? undefined : undefined}
        header={
          <div className="flex items-center justify-between w-full">
            <h3 className="font-bold text-navy-text text-base">{title}</h3>
          </div>
        }
        showClose
        showDragHandle
        swipeable
        className={hideClass}
      >
        <div className="flex flex-col gap-6">
          {children}
        </div>
      </Sheet>
    </>
  );
}
MobileFilterSheet.displayName = "MobileFilterSheet";

// --- Attach compound sub-components for dot-notation API ---

MobileFilterSheet.Section = MobileFilterSection;
MobileFilterSheet.Pill = MobileFilterPill;

export { MobileFilterSheet, MobileFilterSection, MobileFilterPill };
export type { MobileFilterSheetProps };
