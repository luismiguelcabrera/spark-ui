"use client";

import { forwardRef, type ReactNode } from "react";
import { cn } from "../../lib/utils";
import { s } from "../../lib/styles";
import { useTabsContext } from "./tabs-context";

export type TabProps = {
  value: string;
  children: ReactNode;
  className?: string;
};

export const Tab = forwardRef<HTMLButtonElement, TabProps>(
  ({ value, children, className }, ref) => {
    const ctx = useTabsContext();
    const isActive = ctx.value === value;

    return (
      <button
        ref={ref}
        type="button"
        role="tab"
        id={`${ctx.baseId}-tab-${value}`}
        aria-selected={isActive}
        aria-controls={`${ctx.baseId}-panel-${value}`}
        tabIndex={isActive ? 0 : -1}
        onClick={() => ctx.setValue(value)}
        className={cn(
          s.tabBase,
          isActive ? s.tabActive : s.tabInactive,
          "focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:outline-none",
          className,
        )}
      >
        {children}
      </button>
    );
  },
);

Tab.displayName = "Tab";
