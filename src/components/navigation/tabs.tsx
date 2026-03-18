"use client";

import { createContext, useContext, type ReactNode } from "react";
import { cn } from "../../lib/utils";
import { s } from "../../lib/styles";
import { useControllable } from "../../hooks/use-controllable";

// ── Types ────────────────────────────────────────────────

type TabsOrientation = "horizontal" | "vertical";

// ── Context ──────────────────────────────────────────────

type TabsContextValue = {
  value: string;
  setValue: (value: string) => void;
  orientation: TabsOrientation;
};

const TabsContext = createContext<TabsContextValue | null>(null);

function useTabsContext() {
  const ctx = useContext(TabsContext);
  if (!ctx) throw new Error("Tabs compound components must be used within <Tabs>");
  return ctx;
}

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
  /** Layout direction. Defaults to "horizontal". */
  orientation?: TabsOrientation;
  className?: string;
  children?: ReactNode;
};

function Tabs({
  tabs,
  value,
  defaultValue,
  onValueChange,
  orientation = "horizontal",
  className,
  children,
}: TabsProps) {
  // Legacy `tabs[]` API detection
  const isLegacy = !!tabs;

  // Derive initial active from legacy `active` field
  const legacyActive =
    isLegacy && value === undefined && defaultValue === undefined
      ? tabs!.find((t) => t.active)?.value ?? tabs!.find((t) => t.active)?.label
      : undefined;

  const [current, setCurrent] = useControllable({
    value,
    defaultValue: defaultValue ?? legacyActive ?? "",
    onChange: onValueChange,
  });

  const isVertical = orientation === "vertical";

  // Legacy mode: render tab bar from items array
  if (isLegacy) {
    return (
      <div
        className={cn(
          isVertical ? "flex" : undefined,
          className,
        )}
      >
        <div
          role="tablist"
          aria-orientation={orientation}
          className={cn(
            "flex gap-1",
            isVertical
              ? "flex-col border-r border-gray-200"
              : "items-center border-b border-gray-200",
          )}
        >
          {tabs!.map((tab, i) => {
            const tabValue = tab.value ?? tab.label;
            const isActive = current ? tabValue === current : tab.active;
            const Tag = tab.href ? "a" : "button";
            return (
              <Tag
                key={tabValue + i}
                role="tab"
                aria-selected={!!isActive}
                href={tab.href}
                onClick={!tab.href ? () => setCurrent(tabValue) : undefined}
                className={cn(
                  s.tabBase,
                  isActive ? s.tabActive : s.tabInactive,
                  isVertical && "border-b-0 border-r-2 -mr-px",
                  isVertical && isActive && "border-r-primary",
                  isVertical && !isActive && "border-r-transparent",
                )}
              >
                {tab.label}
              </Tag>
            );
          })}
        </div>
      </div>
    );
  }

  // Compound mode
  return (
    <TabsContext.Provider value={{ value: current, setValue: setCurrent, orientation }}>
      <div className={cn(isVertical ? "flex" : undefined, className)}>
        {children}
      </div>
    </TabsContext.Provider>
  );
}

// ── Compound sub-components ─────────────────────────────

function TabsList({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  const ctx = useTabsContext();
  const isVertical = ctx.orientation === "vertical";

  return (
    <div
      role="tablist"
      aria-orientation={ctx.orientation}
      className={cn(
        "flex gap-1",
        isVertical
          ? "flex-col border-r border-gray-200"
          : "items-center border-b border-gray-200",
        className,
      )}
    >
      {children}
    </div>
  );
}

function Tab({
  value,
  children,
  className,
}: {
  value: string;
  children: ReactNode;
  className?: string;
}) {
  const ctx = useTabsContext();
  const isActive = ctx.value === value;
  const isVertical = ctx.orientation === "vertical";

  return (
    <button
      type="button"
      role="tab"
      aria-selected={isActive}
      onClick={() => ctx.setValue(value)}
      className={cn(
        s.tabBase,
        isActive ? s.tabActive : s.tabInactive,
        isVertical && "border-b-0 border-r-2 -mr-px",
        isVertical && isActive && "border-r-primary",
        isVertical && !isActive && "border-r-transparent",
        className,
      )}
    >
      {children}
    </button>
  );
}

function TabsPanel({
  value,
  children,
  className,
}: {
  value: string;
  children: ReactNode;
  className?: string;
}) {
  const ctx = useTabsContext();
  if (ctx.value !== value) return null;
  return <div role="tabpanel" className={className}>{children}</div>;
}

// ── Attach compound sub-components ──────────────────────

Tabs.List = TabsList;
Tabs.Tab = Tab;
Tabs.Panel = TabsPanel;

export { Tabs };
export type { TabsProps, TabItem, TabsOrientation };
