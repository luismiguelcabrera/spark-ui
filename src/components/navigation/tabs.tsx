"use client";

import {
  createContext,
  useContext,
  useId,
  forwardRef,
  type ReactNode,
  type KeyboardEvent,
} from "react";
import { cn } from "../../lib/utils";
import { s } from "../../lib/styles";
import { useControllable } from "../../hooks/use-controllable";

// ── Context ──────────────────────────────────────────────

type TabsContextValue = {
  value: string;
  setValue: (value: string) => void;
  baseId: string;
};

const TabsContext = createContext<TabsContextValue | null>(null);

function useTabsContext() {
  const ctx = useContext(TabsContext);
  if (!ctx)
    throw new Error("Tabs compound components must be used within <Tabs>");
  return ctx;
}

// ── Keyboard handler for tab list ────────────────────────

function handleTabListKeyDown(e: KeyboardEvent<HTMLDivElement>) {
  const target = e.target as HTMLElement;
  if (target.getAttribute("role") !== "tab") return;

  const container = e.currentTarget;
  const tabs = Array.from(
    container.querySelectorAll<HTMLButtonElement>('[role="tab"]'),
  );

  const index = tabs.indexOf(target as HTMLButtonElement);
  if (index === -1) return;

  let nextIndex: number | null = null;

  switch (e.key) {
    case "ArrowLeft":
      e.preventDefault();
      nextIndex = (index - 1 + tabs.length) % tabs.length;
      break;
    case "ArrowRight":
      e.preventDefault();
      nextIndex = (index + 1) % tabs.length;
      break;
    case "Home":
      e.preventDefault();
      nextIndex = 0;
      break;
    case "End":
      e.preventDefault();
      nextIndex = tabs.length - 1;
      break;
  }

  if (nextIndex !== null) {
    tabs[nextIndex].focus();
    tabs[nextIndex].click();
  }
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

// ── Compound sub-components ─────────────────────────────

const TabsList = forwardRef<
  HTMLDivElement,
  {
    children: ReactNode;
    className?: string;
  }
>(({ children, className }, ref) => {
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
});

TabsList.displayName = "TabsList";

const Tab = forwardRef<
  HTMLButtonElement,
  {
    value: string;
    children: ReactNode;
    className?: string;
  }
>(({ value, children, className }, ref) => {
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
});

Tab.displayName = "Tab";

const TabsPanel = forwardRef<
  HTMLDivElement,
  {
    value: string;
    children: ReactNode;
    className?: string;
  }
>(({ value, children, className }, ref) => {
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
});

TabsPanel.displayName = "TabsPanel";

// ── Attach compound sub-components ──────────────────────

const TabsCompound = Tabs as typeof Tabs & {
  List: typeof TabsList;
  Tab: typeof Tab;
  Panel: typeof TabsPanel;
};
TabsCompound.List = TabsList;
TabsCompound.Tab = Tab;
TabsCompound.Panel = TabsPanel;

export { TabsCompound as Tabs };
export type { TabsProps, TabItem };
