"use client";

import { forwardRef, useCallback, useRef, type KeyboardEvent } from "react";
import { cn } from "../../lib/utils";
import { s } from "../../lib/styles";
import { useControllable } from "../../hooks/use-controllable";

type TabFilterItem = {
  label: string;
  value: string;
};

type TabFilterProps = {
  items: TabFilterItem[];
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  className?: string;
};

const TabFilter = forwardRef<HTMLDivElement, TabFilterProps>(
  ({ items, value, defaultValue, onValueChange, className }, ref) => {
    const [current, setCurrent] = useControllable({
      value,
      defaultValue: defaultValue ?? items[0]?.value ?? "",
      onChange: onValueChange,
    });

    const buttonsRef = useRef<(HTMLButtonElement | null)[]>([]);

    const handleKeyDown = useCallback(
      (e: KeyboardEvent<HTMLDivElement>) => {
        if (e.key !== "ArrowLeft" && e.key !== "ArrowRight") return;

        e.preventDefault();
        const currentIndex = items.findIndex((i) => i.value === current);
        let nextIndex: number;
        if (e.key === "ArrowRight") {
          nextIndex = (currentIndex + 1) % items.length;
        } else {
          nextIndex = (currentIndex - 1 + items.length) % items.length;
        }
        setCurrent(items[nextIndex].value);
        buttonsRef.current[nextIndex]?.focus();
      },
      [items, current, setCurrent]
    );

    return (
      <>
        {/* Mobile: compact styled select */}
        <div className="relative md:hidden shrink-0">
          <select
            value={current}
            onChange={(e) => setCurrent(e.target.value)}
            aria-label="Filter"
            className={cn(
              "appearance-none cursor-pointer",
              "bg-slate-200/60 rounded-xl px-4 py-1.5 pr-7",
              "text-[13px] font-semibold text-slate-700",
              "border-0 focus:outline-none focus:ring-2 focus:ring-primary/20",
              className
            )}
          >
            {items.map((item) => (
              <option key={item.value} value={item.value}>
                {item.label}
              </option>
            ))}
          </select>
          <svg
            className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-500"
            width="10"
            height="10"
            viewBox="0 0 10 10"
            fill="none"
            aria-hidden="true"
          >
            <path
              d="M2 3.5L5 6.5L8 3.5"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>

        {/* Desktop: segmented pills */}
        <div ref={ref} className={cn("hidden md:block shrink-0", className)}>
          <div
            role="tablist"
            className="flex bg-slate-200/60 @[600px]:p-1 p-0.5 rounded-xl"
            onKeyDown={handleKeyDown}
          >
            {items.map((item, index) => {
              const isSelected = item.value === current;
              return (
                <button
                  key={item.value}
                  ref={(el) => {
                    buttonsRef.current[index] = el;
                  }}
                  type="button"
                  role="tab"
                  aria-selected={isSelected}
                  tabIndex={isSelected ? 0 : -1}
                  onClick={() => setCurrent(item.value)}
                  className={cn(
                    "rounded-lg transition-all whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-1",
                    "@[600px]:px-4 @[600px]:py-1.5 @[600px]:text-[13px] px-2 py-1 text-[11px]",
                    isSelected ? s.segmentActive : s.segmentInactive
                  )}
                >
                  {item.label}
                </button>
              );
            })}
          </div>
        </div>
      </>
    );
  }
);
TabFilter.displayName = "TabFilter";

export { TabFilter };
export type { TabFilterProps, TabFilterItem };
