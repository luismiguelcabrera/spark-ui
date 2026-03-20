"use client";

import { forwardRef, type ReactNode } from "react";
import { cn } from "../../lib/utils";
import { handleTabListKeyDown } from "./tabs-context";

export type TabsListProps = {
  children: ReactNode;
  className?: string;
};

export const TabsList = forwardRef<HTMLDivElement, TabsListProps>(
  ({ children, className }, ref) => {
    return (
      <div
        ref={ref}
        role="tablist"
        className={cn(
          "flex items-center gap-1 border-b border-gray-200",
          className,
        )}
        onKeyDown={handleTabListKeyDown}
      >
        {children}
      </div>
    );
  },
);

TabsList.displayName = "TabsList";
