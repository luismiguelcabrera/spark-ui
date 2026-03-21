"use client";

import { type ReactNode } from "react";

export type MobileFilterSectionProps = {
  label: string;
  children: ReactNode;
};

export function MobileFilterSection({ label, children }: MobileFilterSectionProps) {
  return (
    <div className="flex flex-col gap-3">
      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
        {label}
      </p>
      <div className="flex flex-wrap gap-2">{children}</div>
    </div>
  );
}
MobileFilterSection.displayName = "MobileFilterSheet.Section";
