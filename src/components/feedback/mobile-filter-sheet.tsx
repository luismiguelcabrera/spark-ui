"use client";

import { useState, type ReactNode } from "react";
import { cn } from "../../lib/utils";
import { Icon } from "../data-display/icon";

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

type SectionProps = {
  label: string;
  children: ReactNode;
};

type PillProps = {
  active?: boolean;
  onClick: () => void;
  children: ReactNode;
};

// --- Sub-components ---

function Section({ label, children }: SectionProps) {
  return (
    <div className="flex flex-col gap-3">
      <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide">
        {label}
      </p>
      <div className="flex flex-wrap gap-2">{children}</div>
    </div>
  );
}

function Pill({ active, onClick, children }: PillProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "px-3 py-1.5 rounded-lg text-sm font-medium border transition-colors",
        active
          ? "bg-primary/10 text-primary border-primary/20"
          : "bg-white text-slate-700 border-slate-200 hover:border-slate-300"
      )}
    >
      {children}
    </button>
  );
}

// --- Main component ---

function MobileFilterSheet({
  children,
  activeCount = 0,
  label = "",
  collapseAt = "md",
}: MobileFilterSheetProps) {
  const [isOpen, setIsOpen] = useState(false);
  const hideClass = COLLAPSE_CLASS[collapseAt];

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className={cn(
          "relative flex items-center gap-1 bg-slate-50 text-slate-700 rounded-lg border border-slate-200 hover:border-slate-300 transition-colors shrink-0 p-2",
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
            if (e.target === e.currentTarget) setIsOpen(false);
          }}
        >
          <div className="w-full bg-white rounded-t-2xl shadow-float max-h-[80vh] flex flex-col">
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
                onClick={() => setIsOpen(false)}
                className="p-1 rounded-lg hover:bg-slate-100 text-slate-400 transition-colors"
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

MobileFilterSheet.Section = Section;
MobileFilterSheet.Pill = Pill;

export { MobileFilterSheet };
export type { MobileFilterSheetProps };
