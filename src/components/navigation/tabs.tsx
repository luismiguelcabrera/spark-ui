"use client";

import { useId, forwardRef, type ReactNode } from "react";
import { cn } from "../../lib/utils";
import { s } from "../../lib/styles";
import { useControllable } from "../../hooks/use-controllable";
import { TabsContext, handleTabListKeyDown } from "./tabs-context";
import { TabsList } from "./tabs-list";
import { Tab } from "./tab";
import { TabsPanel } from "./tabs-panel";

// ── Legacy types (backward compat) ──────────────────────

type TabItem = {
  label: string;
  value?: string;
  href?: string;
  active?: boolean;
};

// ── Main component ──────────────────────────────────────

type TabsProps = {
  tabs?: TabItem[];
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  className?: string;
  children?: ReactNode;
};

const Tabs = forwardRef<HTMLDivElement, TabsProps>(
  ({ tabs, value, defaultValue, onValueChange, className, children }, ref) => {
    // Legacy `tabs[]` API detection
    const isLegacy = !!tabs;
    const baseId = useId();

    // Derive initial active from legacy `active` field
    const legacyActive =
      isLegacy && value === undefined && defaultValue === undefined
        ? tabs!.find((t) => t.active)?.value ??
          tabs!.find((t) => t.active)?.label
        : undefined;

    const [current, setCurrent] = useControllable({
      value,
      defaultValue: defaultValue ?? legacyActive ?? "",
      onChange: onValueChange,
    });

    // Legacy mode: render tab bar from items array
    if (isLegacy) {
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
          {tabs!.map((tab, i) => {
            const tabValue = tab.value ?? tab.label;
            const isActive = current ? tabValue === current : tab.active;
            const Tag = tab.href ? "a" : "button";
            return (
              <Tag
                key={tabValue + i}
                role="tab"
                id={`${baseId}-tab-${i}`}
                aria-selected={!!isActive}
                tabIndex={isActive ? 0 : -1}
                href={tab.href}
                {...(!tab.href && { type: "button" as const })}
                onClick={!tab.href ? () => setCurrent(tabValue) : undefined}
                className={cn(
                  s.tabBase,
                  isActive ? s.tabActive : s.tabInactive,
                  "focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:outline-none",
                )}
              >
                {tab.label}
              </Tag>
            );
          })}
        </div>
      );
    }

    // Compound mode
    return (
      <TabsContext.Provider value={{ value: current, setValue: setCurrent, baseId }}>
        <div ref={ref} className={className}>
          {children}
        </div>
      </TabsContext.Provider>
    );
  },
);

Tabs.displayName = "Tabs";

// ── Attach compound sub-components for dot-notation API ──

const TabsCompound = Tabs as typeof Tabs & {
  List: typeof TabsList;
  Tab: typeof Tab;
  Panel: typeof TabsPanel;
};
TabsCompound.List = TabsList;
TabsCompound.Tab = Tab;
TabsCompound.Panel = TabsPanel;

export { TabsCompound as Tabs, TabsList, Tab, TabsPanel };
export type { TabsProps, TabItem };
