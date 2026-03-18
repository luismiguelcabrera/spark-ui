"use client";

import {
  forwardRef,
  useState,
  useRef,
  useEffect,
  useMemo,
  useCallback,
  type KeyboardEvent,
} from "react";
import { cn } from "../../lib/utils";
import { useControllable } from "../../hooks/use-controllable";
import { Icon } from "../data-display/icon";

/* -------------------------------------------------------------------------- */
/*  Types                                                                      */
/* -------------------------------------------------------------------------- */

type CascaderOption = {
  label: string;
  value: string;
  children?: CascaderOption[];
  disabled?: boolean;
};

type CascaderSize = "sm" | "md" | "lg";

type CascaderProps = {
  /** Hierarchy of options */
  options: CascaderOption[];
  /** Controlled selected path (array of values) */
  value?: string[];
  /** Default selected path (uncontrolled) */
  defaultValue?: string[];
  /** Called when a complete path is selected */
  onChange?: (value: string[], selectedOptions: CascaderOption[]) => void;
  /** Placeholder text */
  placeholder?: string;
  /** Disabled state */
  disabled?: boolean;
  /** Size variant */
  size?: CascaderSize;
  /** Enable search/filter across all levels */
  searchable?: boolean;
  /** Custom display renderer for the selected path */
  displayRender?: (labels: string[]) => string;
  /** How child columns are triggered */
  expandTrigger?: "click" | "hover";
  /** Accessible label for the combobox */
  "aria-label"?: string;
  /** Additional class names */
  className?: string;
};

/* -------------------------------------------------------------------------- */
/*  Size maps                                                                  */
/* -------------------------------------------------------------------------- */

const sizeMap: Record<CascaderSize, string> = {
  sm: "h-9 text-xs px-3",
  md: "h-12 text-sm px-4",
  lg: "h-14 text-base px-4",
};

const dropdownTextSize: Record<CascaderSize, string> = {
  sm: "text-xs",
  md: "text-sm",
  lg: "text-base",
};

/* -------------------------------------------------------------------------- */
/*  Helpers                                                                    */
/* -------------------------------------------------------------------------- */

/** Flatten tree into all possible complete paths for search */
function flattenPaths(
  options: CascaderOption[],
  parentPath: CascaderOption[] = [],
): { path: CascaderOption[]; labels: string[] }[] {
  const result: { path: CascaderOption[]; labels: string[] }[] = [];
  for (const opt of options) {
    const currentPath = [...parentPath, opt];
    const labels = currentPath.map((o) => o.label);
    if (opt.children && opt.children.length > 0) {
      result.push(...flattenPaths(opt.children, currentPath));
    } else {
      result.push({ path: currentPath, labels });
    }
  }
  return result;
}

/** Resolve a value path to the corresponding option objects */
function resolvePathOptions(
  options: CascaderOption[],
  valuePath: string[],
): CascaderOption[] {
  const result: CascaderOption[] = [];
  let current = options;
  for (const val of valuePath) {
    const found = current.find((o) => o.value === val);
    if (!found) break;
    result.push(found);
    current = found.children ?? [];
  }
  return result;
}

/* -------------------------------------------------------------------------- */
/*  Component                                                                  */
/* -------------------------------------------------------------------------- */

const Cascader = forwardRef<HTMLDivElement, CascaderProps>(
  (
    {
      options,
      value: valueProp,
      defaultValue = [],
      onChange,
      placeholder = "Select...",
      disabled = false,
      size = "md",
      searchable = false,
      displayRender,
      expandTrigger = "click",
      "aria-label": ariaLabel,
      className,
    },
    ref,
  ) => {
    // We use a custom onChange wrapper since the hook expects (value) => void
    const [selected, setSelected] = useControllable<string[]>({
      value: valueProp,
      defaultValue,
      onChange: (val: string[]) => {
        const opts = resolvePathOptions(options, val);
        onChange?.(val, opts);
      },
    });

    const [isOpen, setIsOpen] = useState(false);
    const [query, setQuery] = useState("");
    // expandedPath tracks which option is expanded at each column level
    const [expandedPath, setExpandedPath] = useState<string[]>([]);
    const [focusedColumn, setFocusedColumn] = useState(0);
    const [focusedIndex, setFocusedIndex] = useState(-1);
    const containerRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    // Close on outside click
    useEffect(() => {
      if (!isOpen) return;
      const handler = (e: MouseEvent) => {
        if (
          containerRef.current &&
          !containerRef.current.contains(e.target as Node)
        ) {
          setIsOpen(false);
          setQuery("");
        }
      };
      document.addEventListener("mousedown", handler);
      return () => document.removeEventListener("mousedown", handler);
    }, [isOpen]);

    // Get the columns to display based on expanded path
    const columns = useMemo(() => {
      const cols: CascaderOption[][] = [options];
      let current = options;
      for (const val of expandedPath) {
        const found = current.find((o) => o.value === val);
        if (found?.children && found.children.length > 0) {
          cols.push(found.children);
          current = found.children;
        } else {
          break;
        }
      }
      return cols;
    }, [options, expandedPath]);

    // Search results
    const searchResults = useMemo(() => {
      if (!query) return [];
      const all = flattenPaths(options);
      const q = query.toLowerCase();
      return all.filter(({ labels }) =>
        labels.some((l) => l.toLowerCase().includes(q)),
      );
    }, [options, query]);

    const handleSelect = useCallback(
      (option: CascaderOption, columnIndex: number) => {
        if (option.disabled) return;

        const newExpandedPath = expandedPath.slice(0, columnIndex);
        newExpandedPath[columnIndex] = option.value;

        if (option.children && option.children.length > 0) {
          // Has children — just expand
          setExpandedPath(newExpandedPath);
          setFocusedColumn(columnIndex + 1);
          setFocusedIndex(0);
        } else {
          // Leaf — select and close
          const valuePath = newExpandedPath;
          setSelected(valuePath);
          setExpandedPath([]);
          setIsOpen(false);
          setQuery("");
        }
      },
      [expandedPath, setSelected],
    );

    const handleSearchSelect = useCallback(
      (path: CascaderOption[]) => {
        const valuePath = path.map((o) => o.value);
        setSelected(valuePath);
        setExpandedPath([]);
        setIsOpen(false);
        setQuery("");
      },
      [setSelected],
    );

    const handleHover = useCallback(
      (option: CascaderOption, columnIndex: number) => {
        if (expandTrigger !== "hover" || option.disabled) return;
        const newExpandedPath = expandedPath.slice(0, columnIndex);
        newExpandedPath[columnIndex] = option.value;
        setExpandedPath(newExpandedPath);
      },
      [expandTrigger, expandedPath],
    );

    const handleKeyDown = (e: KeyboardEvent) => {
      if (disabled) return;

      if (!isOpen) {
        if (e.key === "Enter" || e.key === " " || e.key === "ArrowDown") {
          e.preventDefault();
          setIsOpen(true);
          setFocusedColumn(0);
          setFocusedIndex(0);
          return;
        }
        return;
      }

      // Search mode
      if (query && searchResults.length > 0) {
        switch (e.key) {
          case "ArrowDown":
            e.preventDefault();
            setFocusedIndex((prev) =>
              prev < searchResults.length - 1 ? prev + 1 : 0,
            );
            break;
          case "ArrowUp":
            e.preventDefault();
            setFocusedIndex((prev) =>
              prev > 0 ? prev - 1 : searchResults.length - 1,
            );
            break;
          case "Enter":
            e.preventDefault();
            if (focusedIndex >= 0 && searchResults[focusedIndex]) {
              handleSearchSelect(searchResults[focusedIndex].path);
            }
            break;
          case "Escape":
            e.preventDefault();
            setIsOpen(false);
            setQuery("");
            break;
        }
        return;
      }

      const currentColumn = columns[focusedColumn] ?? [];

      switch (e.key) {
        case "ArrowDown": {
          e.preventDefault();
          setFocusedIndex((prev) =>
            prev < currentColumn.length - 1 ? prev + 1 : 0,
          );
          break;
        }
        case "ArrowUp": {
          e.preventDefault();
          setFocusedIndex((prev) =>
            prev > 0 ? prev - 1 : currentColumn.length - 1,
          );
          break;
        }
        case "ArrowRight": {
          e.preventDefault();
          const focusedOption = currentColumn[focusedIndex];
          if (focusedOption?.children && focusedOption.children.length > 0) {
            handleSelect(focusedOption, focusedColumn);
          }
          break;
        }
        case "ArrowLeft": {
          e.preventDefault();
          if (focusedColumn > 0) {
            const newPath = expandedPath.slice(0, focusedColumn - 1);
            setExpandedPath(newPath);
            setFocusedColumn(focusedColumn - 1);
            const parentColumn = columns[focusedColumn - 1] ?? [];
            const parentIndex = parentColumn.findIndex(
              (o) => o.value === expandedPath[focusedColumn - 1],
            );
            setFocusedIndex(parentIndex >= 0 ? parentIndex : 0);
          }
          break;
        }
        case "Enter": {
          e.preventDefault();
          const opt = currentColumn[focusedIndex];
          if (opt) handleSelect(opt, focusedColumn);
          break;
        }
        case "Escape": {
          e.preventDefault();
          setIsOpen(false);
          setQuery("");
          break;
        }
      }
    };

    // Resolve display text
    const selectedOptions = resolvePathOptions(options, selected);
    const selectedLabels = selectedOptions.map((o) => o.label);
    const displayText = selected.length > 0
      ? displayRender
        ? displayRender(selectedLabels)
        : selectedLabels.join(" / ")
      : "";

    return (
      <div ref={ref} className={cn("relative", className)}>
        <div ref={containerRef} className="relative">
          {/* Trigger */}
          <div
            role="combobox"
            aria-expanded={isOpen}
            aria-haspopup="listbox"
            aria-disabled={disabled}
            aria-label={ariaLabel ?? placeholder}
            tabIndex={disabled ? -1 : 0}
            className={cn(
              "flex items-center rounded-xl border bg-slate-50 transition-colors cursor-pointer",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2",
              "border-slate-200",
              disabled && "opacity-50 cursor-not-allowed",
              sizeMap[size],
            )}
            onClick={() => {
              if (!disabled) {
                setIsOpen(!isOpen);
                if (!isOpen) {
                  setFocusedColumn(0);
                  setFocusedIndex(-1);
                  // If there's already a selected path, expand to it
                  if (selected.length > 0) {
                    setExpandedPath(selected.slice(0, -1));
                  }
                }
                setTimeout(() => inputRef.current?.focus(), 0);
              }
            }}
            onKeyDown={handleKeyDown}
          >
            {searchable && isOpen ? (
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setFocusedIndex(0);
                }}
                placeholder={displayText || placeholder}
                className="flex-1 bg-transparent outline-none placeholder:text-slate-400 text-inherit min-w-0"
                aria-label="Search options"
                onClick={(e) => e.stopPropagation()}
              />
            ) : (
              <span
                className={cn(
                  "flex-1 truncate",
                  !displayText && "text-slate-400",
                )}
              >
                {displayText || placeholder}
              </span>
            )}
            <Icon
              name="expand_more"
              size="sm"
              className={cn(
                "text-slate-400 transition-transform shrink-0 ml-1",
                isOpen && "rotate-180",
              )}
            />
          </div>

          {/* Dropdown */}
          {isOpen && !disabled && (
            <div
              className="absolute z-50 mt-1 rounded-xl border border-slate-200 bg-white shadow-lg overflow-hidden"
              role="listbox"
            >
              {query && searchable ? (
                /* Search results */
                <ul className="max-h-60 overflow-auto py-1 min-w-[200px]">
                  {searchResults.length === 0 && (
                    <li className={cn("px-4 py-3 text-slate-500", dropdownTextSize[size])}>
                      No results found.
                    </li>
                  )}
                  {searchResults.map(({ path, labels }, index) => (
                    <li
                      key={path.map((o) => o.value).join("/")}
                      role="option"
                      aria-selected={
                        selected.join("/") === path.map((o) => o.value).join("/")
                      }
                      className={cn(
                        "px-4 py-2.5 cursor-pointer transition-colors",
                        dropdownTextSize[size],
                        index === focusedIndex && "bg-slate-50",
                        index !== focusedIndex && "hover:bg-slate-50",
                      )}
                      onClick={() => handleSearchSelect(path)}
                      onMouseEnter={() => setFocusedIndex(index)}
                    >
                      {labels.join(" / ")}
                    </li>
                  ))}
                </ul>
              ) : (
                /* Multi-column panels */
                <div className="flex">
                  {columns.map((column, colIndex) => (
                    <ul
                      key={colIndex}
                      className={cn(
                        "max-h-60 overflow-auto py-1 min-w-[150px]",
                        colIndex > 0 && "border-l border-slate-200",
                      )}
                      role="group"
                    >
                      {column.map((option, optIndex) => {
                        const isExpanded = expandedPath[colIndex] === option.value;
                        const isSelectedLeaf =
                          !option.children?.length &&
                          selected[colIndex] === option.value &&
                          selected.length === colIndex + 1;
                        const isFocused =
                          colIndex === focusedColumn && optIndex === focusedIndex;

                        return (
                          <li
                            key={option.value}
                            role="option"
                            aria-selected={isSelectedLeaf}
                            aria-disabled={option.disabled}
                            className={cn(
                              "flex items-center justify-between gap-2 px-4 py-2.5 cursor-pointer transition-colors",
                              dropdownTextSize[size],
                              (isExpanded || isSelectedLeaf) && "bg-primary/5 text-primary",
                              isFocused && "bg-slate-50",
                              option.disabled && "opacity-50 cursor-not-allowed",
                              !option.disabled && !isExpanded && !isSelectedLeaf && !isFocused && "hover:bg-slate-50",
                            )}
                            onClick={() => handleSelect(option, colIndex)}
                            onMouseEnter={() => {
                              handleHover(option, colIndex);
                              setFocusedColumn(colIndex);
                              setFocusedIndex(optIndex);
                            }}
                          >
                            <span className="truncate">{option.label}</span>
                            {option.children && option.children.length > 0 && (
                              <Icon name="chevron_right" size="sm" className="text-slate-400 shrink-0" />
                            )}
                            {isSelectedLeaf && (
                              <Icon name="check" size="sm" className="text-primary shrink-0" />
                            )}
                          </li>
                        );
                      })}
                    </ul>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    );
  },
);
Cascader.displayName = "Cascader";

export { Cascader };
export type { CascaderProps, CascaderOption, CascaderSize };
