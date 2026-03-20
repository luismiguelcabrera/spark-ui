"use client";

import { forwardRef, type ReactNode } from "react";
import { useTabsContext } from "./tabs-context";

export type TabsPanelProps = {
  value: string;
  children: ReactNode;
  className?: string;
};

export const TabsPanel = forwardRef<HTMLDivElement, TabsPanelProps>(
  ({ value, children, className }, ref) => {
    const ctx = useTabsContext();
    const isActive = ctx.value === value;

    if (!isActive) return null;

    return (
      <div
        ref={ref}
        role="tabpanel"
        id={`${ctx.baseId}-panel-${value}`}
        aria-labelledby={`${ctx.baseId}-tab-${value}`}
        tabIndex={0}
        className={className}
      >
        {children}
      </div>
    );
  },
);

TabsPanel.displayName = "TabsPanel";
