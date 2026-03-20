"use client";

import { forwardRef, useCallback, type HTMLAttributes } from "react";
import { cn } from "../../lib/utils";
import { s } from "../../lib/styles";
import { Icon } from "../data-display/icon";
import { useControllable } from "../../hooks/use-controllable";

type FilterOption = {
  label: string;
  value: string;
  icon?: string;
};

type FilterBarProps = HTMLAttributes<HTMLDivElement> & {
  filters: FilterOption[];
  activeValues?: string[];
  defaultActiveValues?: string[];
  onFilterChange?: (values: string[]) => void;
  showClearAll?: boolean;
};

const FilterBar = forwardRef<HTMLDivElement, FilterBarProps>(
  (
    {
      filters,
      activeValues,
      defaultActiveValues,
      onFilterChange,
      showClearAll = true,
      className,
      ...props
    },
    ref
  ) => {
    const [current, setCurrent] = useControllable({
      value: activeValues,
      defaultValue: defaultActiveValues ?? [],
      onChange: onFilterChange,
    });

    const toggle = useCallback(
      (filterValue: string) => {
        if (current.includes(filterValue)) {
          setCurrent(current.filter((v) => v !== filterValue));
        } else {
          setCurrent([...current, filterValue]);
        }
      },
      [current, setCurrent]
    );

    const clearAll = useCallback(() => {
      setCurrent([]);
    }, [setCurrent]);

    return (
      <div
        ref={ref}
        role="group"
        aria-label={props["aria-label"] ?? "Filters"}
        className={cn("flex items-center gap-2 flex-wrap", className)}
        {...props}
      >
        {filters.map((filter) => {
          const isActive = current.includes(filter.value);
          return (
            <button
              key={filter.value}
              type="button"
              onClick={() => toggle(filter.value)}
              aria-pressed={isActive}
              className={cn(
                s.filterChip,
                "focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary focus-visible:outline-none",
                isActive ? s.filterChipActive : s.filterChipInactive
              )}
            >
              {filter.icon && <Icon name={filter.icon} size="sm" />}
              <span>{filter.label}</span>
              {isActive && (
                <Icon name="close" size="sm" className="ml-0.5" />
              )}
            </button>
          );
        })}
        {showClearAll && current.length > 0 && (
          <button
            type="button"
            onClick={clearAll}
            className="text-xs text-muted-foreground hover:text-muted-foreground transition-colors ml-1 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary focus-visible:outline-none rounded"
          >
            Clear all
          </button>
        )}
      </div>
    );
  }
);
FilterBar.displayName = "FilterBar";

export { FilterBar };
export type { FilterBarProps, FilterOption };
