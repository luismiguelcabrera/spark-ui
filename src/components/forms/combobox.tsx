"use client";

import {
  forwardRef,
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type KeyboardEvent,
  type RefObject,
} from "react";
import { cn } from "../../lib/utils";
import { s } from "../../lib/styles";
import { useControllable } from "../../hooks/use-controllable";
import { Icon } from "../data-display/icon";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type ComboboxOption = {
  /** Unique value submitted / controlled */
  value: string;
  /** Display label (falls back to `value` when omitted) */
  label?: string;
  /** Whether this option is disabled */
  disabled?: boolean;
};

type ComboboxProps = {
  /** Full list of options */
  options: ComboboxOption[];
  /** Controlled selected value */
  value?: string;
  /** Default value (uncontrolled) */
  defaultValue?: string;
  /** Called when the selected value changes */
  onChange?: (value: string) => void;
  /** Placeholder shown when nothing is selected */
  placeholder?: string;
  /** Placeholder for the search field inside the dropdown */
  searchPlaceholder?: string;
  /** Disable the entire combobox */
  disabled?: boolean;
  /** Show an error message below the combobox */
  error?: string;
  /** Additional className on the root wrapper */
  className?: string;
  /** Label for the combobox (used as aria-label when no visible label) */
  "aria-label"?: string;

  // --- Virtualization ---

  /** Enable virtual scrolling for large lists */
  virtualized?: boolean;
  /** Estimated height of each item in px (used by virtualizer). Default 36 */
  estimateSize?: number;
  /** Number of extra items rendered above/below the viewport. Default 5 */
  overscan?: number;
};

// ---------------------------------------------------------------------------
// useVirtualList hook
// ---------------------------------------------------------------------------

type VirtualItem = { index: number; offsetTop: number };

function useVirtualList({
  itemCount,
  estimateSize,
  overscan,
  containerRef,
}: {
  itemCount: number;
  estimateSize: number;
  overscan: number;
  containerRef: RefObject<HTMLElement | null>;
}): {
  virtualItems: VirtualItem[];
  totalHeight: number;
  scrollToIndex: (index: number) => void;
} {
  const totalHeight = itemCount * estimateSize;
  const [scrollTop, setScrollTop] = useState(0);
  const [containerHeight, setContainerHeight] = useState(0);

  // SSR-safe: only attach listeners after mount
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const measure = () => setContainerHeight(el.clientHeight);
    measure();

    const onScroll = () => setScrollTop(el.scrollTop);
    el.addEventListener("scroll", onScroll, { passive: true });

    // ResizeObserver for dynamic container resizing
    let ro: ResizeObserver | undefined;
    if (typeof ResizeObserver !== "undefined") {
      ro = new ResizeObserver(measure);
      ro.observe(el);
    }

    return () => {
      el.removeEventListener("scroll", onScroll);
      ro?.disconnect();
    };
  }, [containerRef]);

  const virtualItems = useMemo<VirtualItem[]>(() => {
    if (itemCount === 0) return [];

    // When container height is unknown (e.g. SSR, jsdom), render a
    // reasonable initial window so the list is never empty.
    const effectiveHeight = containerHeight > 0 ? containerHeight : overscan * estimateSize;

    const startIndex = Math.floor(scrollTop / estimateSize);
    const endIndex = Math.min(
      itemCount - 1,
      Math.floor((scrollTop + effectiveHeight) / estimateSize)
    );

    const overscanStart = Math.max(0, startIndex - overscan);
    const overscanEnd = Math.min(itemCount - 1, endIndex + overscan);

    const items: VirtualItem[] = [];
    for (let i = overscanStart; i <= overscanEnd; i++) {
      items.push({ index: i, offsetTop: i * estimateSize });
    }
    return items;
  }, [scrollTop, containerHeight, itemCount, estimateSize, overscan]);

  const scrollToIndex = useCallback(
    (index: number) => {
      const el = containerRef.current;
      if (!el) return;

      const itemTop = index * estimateSize;
      const itemBottom = itemTop + estimateSize;

      if (itemTop < el.scrollTop) {
        el.scrollTop = itemTop;
      } else if (itemBottom > el.scrollTop + el.clientHeight) {
        el.scrollTop = itemBottom - el.clientHeight;
      }
    },
    [containerRef, estimateSize]
  );

  return { virtualItems, totalHeight, scrollToIndex };
}

// ---------------------------------------------------------------------------
// Combobox component
// ---------------------------------------------------------------------------

// Use useLayoutEffect on client, useEffect on server (SSR-safe)
const useIsomorphicLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

const Combobox = forwardRef<HTMLButtonElement, ComboboxProps>(
  (
    {
      options,
      value: valueProp,
      defaultValue = "",
      onChange,
      placeholder = "Select...",
      searchPlaceholder = "Search...",
      disabled = false,
      error,
      className,
      "aria-label": ariaLabel,
      virtualized = false,
      estimateSize = 36,
      overscan = 5,
    },
    ref
  ) => {
    const [value, setValue] = useControllable({
      value: valueProp,
      defaultValue,
      onChange,
    });

    const [open, setOpen] = useState(false);
    const [search, setSearch] = useState("");
    const [highlightIndex, setHighlightIndex] = useState(0);

    const wrapperRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    const listRef = useRef<HTMLUListElement>(null);
    const virtualContainerRef = useRef<HTMLDivElement>(null);

    // ---- Filtered options ----
    const filtered = useMemo(() => {
      if (!search) return options;
      const q = search.toLowerCase();
      return options.filter((o) =>
        (o.label ?? o.value).toLowerCase().includes(q)
      );
    }, [options, search]);

    // ---- Virtual list (only used when virtualized) ----
    const { virtualItems, totalHeight, scrollToIndex } = useVirtualList({
      itemCount: filtered.length,
      estimateSize,
      overscan,
      containerRef: virtualContainerRef,
    });

    // ---- Derived ----
    const selectedOption = options.find((o) => o.value === value);
    const displayLabel = selectedOption
      ? selectedOption.label ?? selectedOption.value
      : "";

    // ---- Open / close helpers ----
    const openDropdown = useCallback(() => {
      if (disabled) return;
      setOpen(true);
      setSearch("");
      setHighlightIndex(0);
    }, [disabled]);

    const closeDropdown = useCallback(() => {
      setOpen(false);
      setSearch("");
    }, []);

    const selectOption = useCallback(
      (opt: ComboboxOption) => {
        if (opt.disabled) return;
        setValue(opt.value);
        closeDropdown();
      },
      [setValue, closeDropdown]
    );

    // ---- Focus search input on open ----
    useIsomorphicLayoutEffect(() => {
      if (open) {
        // Slight delay so the DOM is painted
        requestAnimationFrame(() => inputRef.current?.focus());
      }
    }, [open]);

    // ---- Click outside to close ----
    useEffect(() => {
      if (!open) return;
      const handler = (e: MouseEvent) => {
        if (
          wrapperRef.current &&
          !wrapperRef.current.contains(e.target as Node)
        ) {
          closeDropdown();
        }
      };
      document.addEventListener("mousedown", handler);
      return () => document.removeEventListener("mousedown", handler);
    }, [open, closeDropdown]);

    // ---- Clamp highlight when filtered list shrinks ----
    useEffect(() => {
      setHighlightIndex((prev) => // eslint-disable-line react-hooks/set-state-in-effect -- intentional: clamp highlight index when filtered list shrinks
        prev >= filtered.length ? Math.max(0, filtered.length - 1) : prev
      );
    }, [filtered.length]);

    // ---- Scroll highlighted item into view ----
    useIsomorphicLayoutEffect(() => {
      if (!open) return;

      if (virtualized) {
        scrollToIndex(highlightIndex);
      } else {
        const list = listRef.current;
        if (!list) return;
        const item = list.children[highlightIndex] as HTMLElement | undefined;
        if (item && typeof item.scrollIntoView === "function") {
          item.scrollIntoView({ block: "nearest" });
        }
      }
    }, [highlightIndex, open, virtualized, scrollToIndex]);

    // ---- Keyboard navigation ----
    const handleKeyDown = useCallback(
      (e: KeyboardEvent) => {
        if (!open) {
          if (e.key === "ArrowDown" || e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            openDropdown();
          }
          return;
        }

        switch (e.key) {
          case "ArrowDown":
            e.preventDefault();
            setHighlightIndex((prev) => {
              let next = prev + 1;
              while (next < filtered.length && filtered[next]?.disabled) next++;
              return next < filtered.length ? next : prev;
            });
            break;
          case "ArrowUp":
            e.preventDefault();
            setHighlightIndex((prev) => {
              let next = prev - 1;
              while (next >= 0 && filtered[next]?.disabled) next--;
              return next >= 0 ? next : prev;
            });
            break;
          case "Enter":
            e.preventDefault();
            if (filtered[highlightIndex]) {
              selectOption(filtered[highlightIndex]);
            }
            break;
          case "Escape":
            e.preventDefault();
            closeDropdown();
            break;
          case "Home":
            e.preventDefault();
            setHighlightIndex(0);
            break;
          case "End":
            e.preventDefault();
            setHighlightIndex(Math.max(0, filtered.length - 1));
            break;
        }
      },
      [open, openDropdown, closeDropdown, filtered, highlightIndex, selectOption]
    );

    // ---- Render option list (shared between virtual / normal) ----
    const renderOption = (opt: ComboboxOption, index: number, style?: React.CSSProperties) => {
      const isHighlighted = index === highlightIndex;
      const isSelected = opt.value === value;
      return (
        <li
          key={opt.value}
          id={`combobox-option-${index}`}
          role="option"
          aria-selected={isSelected}
          aria-disabled={opt.disabled || undefined}
          data-highlighted={isHighlighted || undefined}
          style={style}
          className={cn(
            "flex items-center px-3 py-2 text-sm cursor-pointer transition-colors select-none",
            isHighlighted && "bg-primary/10 text-primary",
            isSelected && !isHighlighted && "font-semibold",
            opt.disabled && "opacity-50 cursor-not-allowed"
          )}
          onMouseDown={(e) => {
            e.preventDefault(); // keep focus on input
            selectOption(opt);
          }}
          onMouseEnter={() => setHighlightIndex(index)}
        >
          <span className="flex-1 truncate">{opt.label ?? opt.value}</span>
          {isSelected && (
            <Icon name="check" size="sm" className="text-primary shrink-0" />
          )}
        </li>
      );
    };

    // ---- Dropdown list ----
    const renderList = () => {
      if (filtered.length === 0) {
        return (
          <li className="px-3 py-6 text-center text-sm text-slate-600">
            No results found
          </li>
        );
      }

      if (virtualized) {
        return (
          <div
            ref={virtualContainerRef}
            className="max-h-60 overflow-y-auto"
            role="presentation"
          >
            <ul
              ref={listRef}
              role="listbox"
              aria-label={ariaLabel ?? "Options"}
              style={{ height: totalHeight, position: "relative" }}
            >
              {virtualItems.map(({ index, offsetTop }) => {
                const opt = filtered[index];
                return renderOption(opt, index, {
                  position: "absolute",
                  top: 0,
                  left: 0,
                  right: 0,
                  height: estimateSize,
                  transform: `translateY(${offsetTop}px)`,
                });
              })}
            </ul>
          </div>
        );
      }

      return (
        <ul
          ref={listRef}
          role="listbox"
          aria-label={ariaLabel ?? "Options"}
          className="max-h-60 overflow-y-auto"
        >
          {filtered.map((opt, i) => renderOption(opt, i))}
        </ul>
      );
    };

    return (
      <div
        ref={wrapperRef}
        className={cn("relative", className)}
        onKeyDown={handleKeyDown}
      >
        {/* Trigger button */}
        <button
          ref={ref}
          type="button"
          role="combobox"
          aria-expanded={open}
          aria-haspopup="listbox"
          aria-label={ariaLabel ?? placeholder}
          disabled={disabled}
          className={cn(
            s.inputBase,
            "flex items-center justify-between text-left",
            s.inputFocus,
            s.inputDisabled,
            !displayLabel && "text-slate-600",
            error && "border-red-300 focus:border-red-500 focus:ring-red-500/20"
          )}
          onClick={() => (open ? closeDropdown() : openDropdown())}
        >
          <span className="truncate">
            {displayLabel || placeholder}
          </span>
          <Icon
            name={open ? "expand_less" : "expand_more"}
            size="sm"
            className="text-slate-500 shrink-0 ml-2"
          />
        </button>

        {/* Error message */}
        {error && (
          <p className="mt-1.5 text-xs text-red-600 font-medium">{error}</p>
        )}

        {/* Dropdown */}
        {open && (
          <div
            className={cn(
              "absolute z-50 mt-1 w-full bg-white border border-slate-200 rounded-xl shadow-float overflow-hidden"
            )}
          >
            {/* Search input */}
            <div className="p-2 border-b border-slate-100">
              <input
                ref={inputRef}
                type="text"
                role="searchbox"
                aria-label="Search options"
                placeholder={searchPlaceholder}
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setHighlightIndex(0);
                }}
                className={cn(
                  "w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg",
                  "placeholder:text-slate-500",
                  "focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                )}
              />
            </div>

            {/* Options list */}
            {renderList()}
          </div>
        )}
      </div>
    );
  }
);

Combobox.displayName = "Combobox";

export { Combobox };
export type { ComboboxProps, ComboboxOption };
