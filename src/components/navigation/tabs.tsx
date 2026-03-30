"use client";

import { createContext, useContext, useRef, useState, useEffect, useCallback, type ReactNode } from "react";
import { cn } from "../../lib/utils";
import { s } from "../../lib/styles";
import { Icon } from "../data-display/icon";
import { useControllable } from "../../hooks/use-controllable";

// ── Types ────────────────────────────────────────────────

type TabsOrientation = "horizontal" | "vertical";
type TabsDensity = "default" | "comfortable" | "compact";

// ── Context ──────────────────────────────────────────────

type TabsContextValue = {
  value: string;
  setValue: (value: string) => void;
  orientation: TabsOrientation;
  grow: boolean;
  density: TabsDensity;
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

// ── Density config ──────────────────────────────────────

const densityStyles: Record<TabsDensity, string> = {
  default: "px-4 py-2.5 text-sm",
  comfortable: "px-5 py-3.5 text-sm",
  compact: "px-3 py-1.5 text-xs",
};

// ── Scroll arrows hook ──────────────────────────────────

function useScrollArrows(enabled: boolean) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const updateScroll = useCallback(() => {
    const el = scrollRef.current;
    if (!el || !enabled) return;
    setCanScrollLeft(el.scrollLeft > 0);
    setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 1);
  }, [enabled]);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el || !enabled) return;
    updateScroll();
    el.addEventListener("scroll", updateScroll);
    let observer: ResizeObserver | undefined;
    if (typeof ResizeObserver !== "undefined") {
      observer = new ResizeObserver(updateScroll);
      observer.observe(el);
    }
    return () => {
      el.removeEventListener("scroll", updateScroll);
      observer?.disconnect();
    };
  }, [enabled, updateScroll]);

  const scrollBy = useCallback((direction: "left" | "right") => {
    const el = scrollRef.current;
    if (!el) return;
    const amount = el.clientWidth * 0.5;
    el.scrollBy({ left: direction === "left" ? -amount : amount, behavior: "smooth" });
  }, []);

  return { scrollRef, canScrollLeft, canScrollRight, scrollBy };
}

// ── Main component ──────────────────────────────────────

type TabsProps = {
  tabs?: TabItem[];
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  /** Layout direction. Defaults to "horizontal". */
  orientation?: TabsOrientation;
  /** Show scroll arrows when tabs overflow horizontally. */
  showArrows?: boolean;
  /** Tabs stretch to fill container width equally. */
  grow?: boolean;
  /** Affects tab height/padding. Defaults to "default". */
  density?: TabsDensity;
  className?: string;
  children?: ReactNode;
};

function Tabs({
  tabs,
  value,
  defaultValue,
  onValueChange,
  orientation = "horizontal",
  showArrows = false,
  grow = false,
  density = "default",
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

  const { scrollRef, canScrollLeft, canScrollRight, scrollBy } = useScrollArrows(
    showArrows && !isVertical,
  );

  // Legacy mode: render tab bar from items array
  if (isLegacy) {
    return (
      <div
        className={cn(
          isVertical ? "flex" : undefined,
          className,
        )}
      >
        {showArrows && !isVertical ? (
          <div className="relative flex items-center">
            {canScrollLeft && (
              <button
                type="button"
                aria-label="Scroll tabs left"
                className="absolute left-0 z-10 flex items-center justify-center w-8 h-full bg-gradient-to-r from-white to-transparent"
                onClick={() => scrollBy("left")}
              >
                <Icon name="chevron-left" size="sm" />
              </button>
            )}
            <div
              ref={scrollRef}
              role="tablist"
              aria-orientation={orientation}
              className={cn(
                "flex gap-1 overflow-x-auto scrollbar-none",
                "items-center border-b border-gray-200",
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
                      densityStyles[density],
                      isActive ? s.tabActive : s.tabInactive,
                      grow && "flex-1 text-center",
                    )}
                  >
                    {tab.label}
                  </Tag>
                );
              })}
            </div>
            {canScrollRight && (
              <button
                type="button"
                aria-label="Scroll tabs right"
                className="absolute right-0 z-10 flex items-center justify-center w-8 h-full bg-gradient-to-l from-white to-transparent"
                onClick={() => scrollBy("right")}
              >
                <Icon name="chevron-right" size="sm" />
              </button>
            )}
          </div>
        ) : (
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
                    densityStyles[density],
                    isActive ? s.tabActive : s.tabInactive,
                    isVertical && "border-b-0 border-r-2 -mr-px",
                    isVertical && isActive && "border-r-primary",
                    isVertical && !isActive && "border-r-transparent",
                    grow && !isVertical && "flex-1 text-center",
                  )}
                >
                  {tab.label}
                </Tag>
              );
            })}
          </div>
        )}
      </div>
    );
  }

  // Compound mode
  return (
    <TabsContext.Provider value={{ value: current, setValue: setCurrent, orientation, grow, density }}>
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
  showArrows,
}: {
  children: ReactNode;
  className?: string;
  /** Override parent showArrows on the list level. */
  showArrows?: boolean;
}) {
  const ctx = useTabsContext();
  const isVertical = ctx.orientation === "vertical";
  const arrowsEnabled = showArrows !== undefined ? showArrows : false;
  const { scrollRef, canScrollLeft, canScrollRight, scrollBy } = useScrollArrows(
    arrowsEnabled && !isVertical,
  );

  if (arrowsEnabled && !isVertical) {
    return (
      <div className={cn("relative flex items-center", className)}>
        {canScrollLeft && (
          <button
            type="button"
            aria-label="Scroll tabs left"
            className="absolute left-0 z-10 flex items-center justify-center w-8 h-full bg-gradient-to-r from-white to-transparent"
            onClick={() => scrollBy("left")}
          >
            <Icon name="chevron-left" size="sm" />
          </button>
        )}
        <div
          ref={scrollRef}
          role="tablist"
          aria-orientation={ctx.orientation}
          className={cn(
            "flex gap-1 overflow-x-auto scrollbar-none",
            "items-center border-b border-gray-200",
          )}
        >
          {children}
        </div>
        {canScrollRight && (
          <button
            type="button"
            aria-label="Scroll tabs right"
            className="absolute right-0 z-10 flex items-center justify-center w-8 h-full bg-gradient-to-l from-white to-transparent"
            onClick={() => scrollBy("right")}
          >
            <Icon name="chevron-right" size="sm" />
          </button>
        )}
      </div>
    );
  }

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
        densityStyles[ctx.density],
        isActive ? s.tabActive : s.tabInactive,
        isVertical && "border-b-0 border-r-2 -mr-px",
        isVertical && isActive && "border-r-primary",
        isVertical && !isActive && "border-r-transparent",
        ctx.grow && !isVertical && "flex-1 text-center",
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
export type { TabsProps, TabItem, TabsOrientation, TabsDensity };
