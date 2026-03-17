"use client";

import { cn } from "../../lib/utils";
import { s } from "../../lib/styles";
import { Icon } from "../data-display/icon";
import { useControllable } from "../../hooks/use-controllable";

type FilterOption = {
  label: string;
  value: string;
  icon?: string;
};

type FilterBarProps = {
  filters: FilterOption[];
  activeValues?: string[];
  defaultActiveValues?: string[];
  onFilterChange?: (values: string[]) => void;
  showClearAll?: boolean;
  className?: string;
};

function FilterBar({
  filters,
  activeValues,
  defaultActiveValues,
  onFilterChange,
  showClearAll = true,
  className,
}: FilterBarProps) {
  const [current, setCurrent] = useControllable({
    value: activeValues,
    defaultValue: defaultActiveValues ?? [],
    onChange: onFilterChange,
  });

  const toggle = (filterValue: string) => {
    if (current.includes(filterValue)) {
      setCurrent(current.filter((v) => v !== filterValue));
    } else {
      setCurrent([...current, filterValue]);
    }
  };

  return (
    <div className={cn("flex items-center gap-2 flex-wrap", className)}>
      {filters.map((filter) => {
        const isActive = current.includes(filter.value);
        return (
          <button
            key={filter.value}
            onClick={() => toggle(filter.value)}
            className={cn(
              s.filterChip,
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
          onClick={() => setCurrent([])}
          className="text-xs text-slate-400 hover:text-slate-600 transition-colors ml-1"
        >
          Clear all
        </button>
      )}
    </div>
  );
}

export { FilterBar };
export type { FilterBarProps, FilterOption };
