"use client";

import {
  forwardRef,
  useState,
  useRef,
  useEffect,
  useMemo,
  type KeyboardEvent,
} from "react";
import { cn } from "../../lib/utils";
import { useControllable } from "../../hooks/use-controllable";
import { Icon } from "../data-display/icon";

/* -------------------------------------------------------------------------- */
/*  Types                                                                      */
/* -------------------------------------------------------------------------- */

type MultiSelectOption = {
  value: string;
  label: string;
  disabled?: boolean;
};

type MultiSelectSize = "sm" | "md" | "lg";

type MultiSelectProps = {
  /** Available options */
  options: MultiSelectOption[];
  /** Controlled selected values */
  value?: string[];
  /** Default selected values (uncontrolled) */
  defaultValue?: string[];
  /** Called when selection changes */
  onChange?: (values: string[]) => void;
  /** Placeholder when no items selected */
  placeholder?: string;
  /** Enable search/filter input */
  searchable?: boolean;
  /** Custom search placeholder */
  searchPlaceholder?: string;
  /** Show clear-all button when items are selected */
  clearable?: boolean;
  /** Maximum number of selections */
  maxSelections?: number;
  /** Label above the component */
  label?: string;
  /** Error message */
  error?: string;
  /** Size variant */
  size?: MultiSelectSize;
  /** Disabled state */
  disabled?: boolean;
  /** Additional class names */
  className?: string;
  /** Accessible label for the combobox */
  "aria-label"?: string;
};

/* -------------------------------------------------------------------------- */
/*  Size maps                                                                  */
/* -------------------------------------------------------------------------- */

const sizeMap: Record<MultiSelectSize, string> = {
  sm: "min-h-9 text-xs",
  md: "min-h-12 text-sm",
  lg: "min-h-14 text-base",
};

const chipSizeMap: Record<MultiSelectSize, string> = {
  sm: "text-[10px] px-1.5 py-0.5 gap-0.5",
  md: "text-xs px-2 py-1 gap-1",
  lg: "text-sm px-2.5 py-1 gap-1",
};

const chipIconSize: Record<MultiSelectSize, "sm" | "md"> = {
  sm: "sm",
  md: "sm",
  lg: "md",
};

/* -------------------------------------------------------------------------- */
/*  Component                                                                  */
/* -------------------------------------------------------------------------- */

const MultiSelect = forwardRef<HTMLDivElement, MultiSelectProps>(
  (
    {
      options,
      value: valueProp,
      defaultValue = [],
      onChange,
      placeholder = "Select...",
      searchable = true,
      searchPlaceholder = "Search...",
      clearable = true,
      maxSelections,
      label,
      error,
      size = "md",
      disabled = false,
      className,
      "aria-label": ariaLabel,
    },
    ref,
  ) => {
    const [selected, setSelected] = useControllable({
      value: valueProp,
      defaultValue,
      onChange,
    });

    const [isOpen, setIsOpen] = useState(false);
    const [query, setQuery] = useState("");
    const [highlightedIndex, setHighlightedIndex] = useState(-1);
    const containerRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    const listRef = useRef<HTMLUListElement>(null);

    // Filter options by search query, excluding already-selected
    const filteredOptions = useMemo(() => {
      const available = options.filter((o) => !selected.includes(o.value));
      if (!query) return available;
      return available.filter((o) =>
        o.label.toLowerCase().includes(query.toLowerCase()),
      );
    }, [options, selected, query]);

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
          setHighlightedIndex(-1);
        }
      };
      document.addEventListener("mousedown", handler);
      return () => document.removeEventListener("mousedown", handler);
    }, [isOpen]);

    // Scroll highlighted option into view
    useEffect(() => {
      if (highlightedIndex < 0 || !listRef.current) return;
      const items = listRef.current.querySelectorAll('[role="option"]');
      const el = items[highlightedIndex];
      if (el && typeof el.scrollIntoView === "function") {
        el.scrollIntoView({ block: "nearest" });
      }
    }, [highlightedIndex]);

    const toggleOption = (optionValue: string) => {
      if (disabled) return;
      const option = options.find((o) => o.value === optionValue);
      if (option?.disabled) return;

      if (selected.includes(optionValue)) {
        setSelected(selected.filter((v) => v !== optionValue));
      } else {
        if (maxSelections && selected.length >= maxSelections) return;
        setSelected([...selected, optionValue]);
      }
      setQuery("");
      setHighlightedIndex(-1);
      inputRef.current?.focus();
    };

    const removeValue = (val: string) => {
      if (disabled) return;
      setSelected(selected.filter((v) => v !== val));
    };

    const clearAll = () => {
      if (disabled) return;
      setSelected([]);
      setQuery("");
      inputRef.current?.focus();
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (disabled) return;

      switch (e.key) {
        case "ArrowDown": {
          e.preventDefault();
          if (!isOpen) {
            setIsOpen(true);
            setHighlightedIndex(0);
          } else {
            setHighlightedIndex((prev) =>
              prev < filteredOptions.length - 1 ? prev + 1 : 0,
            );
          }
          break;
        }
        case "ArrowUp": {
          e.preventDefault();
          if (isOpen) {
            setHighlightedIndex((prev) =>
              prev > 0 ? prev - 1 : filteredOptions.length - 1,
            );
          }
          break;
        }
        case "Enter": {
          e.preventDefault();
          if (isOpen && highlightedIndex >= 0 && filteredOptions[highlightedIndex]) {
            toggleOption(filteredOptions[highlightedIndex].value);
          } else if (!isOpen) {
            setIsOpen(true);
          }
          break;
        }
        case "Escape": {
          setIsOpen(false);
          setQuery("");
          setHighlightedIndex(-1);
          break;
        }
        case "Backspace": {
          if (!query && selected.length > 0) {
            removeValue(selected[selected.length - 1]);
          }
          break;
        }
      }
    };

    const selectedLabels = selected
      .map((v) => options.find((o) => o.value === v))
      .filter(Boolean) as MultiSelectOption[];

    const atLimit = maxSelections !== undefined && selected.length >= maxSelections;

    return (
      <div ref={ref} className={cn("flex flex-col gap-1.5", className)}>
        {label && (
          <label className="text-sm font-medium text-slate-700">{label}</label>
        )}
        <div ref={containerRef} className="relative">
          {/* Trigger / chip area */}
          <div
            role="combobox"
            aria-expanded={isOpen}
            aria-haspopup="listbox"
            aria-disabled={disabled}
            aria-label={ariaLabel ?? label ?? placeholder}
            tabIndex={disabled ? -1 : 0}
            className={cn(
              "flex flex-wrap items-center gap-1.5 rounded-xl border bg-slate-50 px-3 py-2 transition-colors cursor-text",
              "focus-within:ring-2 focus-within:ring-primary focus-within:border-primary",
              error
                ? "border-red-300 focus-within:border-red-500 focus-within:ring-red-500/20"
                : "border-slate-200",
              disabled && "cursor-not-allowed",
              sizeMap[size],
            )}
            onClick={() => {
              if (!disabled) {
                setIsOpen(true);
                inputRef.current?.focus();
              }
            }}
            onKeyDown={handleKeyDown}
          >
            {/* Selected chips */}
            {selectedLabels.map((opt) => (
              <span
                key={opt.value}
                className={cn(
                  "inline-flex items-center rounded-md border font-medium bg-primary/10 text-primary border-primary/20",
                  chipSizeMap[size],
                )}
              >
                {opt.label}
                {!disabled && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      removeValue(opt.value);
                    }}
                    className="hover:text-red-500 transition-colors"
                    aria-label={`Remove ${opt.label}`}
                  >
                    <Icon name="close" size={chipIconSize[size]} />
                  </button>
                )}
              </span>
            ))}

            {/* Search input */}
            {searchable && !disabled && !atLimit && (
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setIsOpen(true);
                  setHighlightedIndex(0);
                }}
                onFocus={() => setIsOpen(true)}
                placeholder={selected.length === 0 ? placeholder : searchPlaceholder}
                className="flex-1 min-w-[80px] bg-transparent outline-none placeholder:text-slate-500 text-inherit"
                aria-label="Search options"
              />
            )}

            {/* Placeholder when not searchable and nothing selected */}
            {(!searchable || disabled || atLimit) && selected.length === 0 && (
              <span className="text-slate-600">{placeholder}</span>
            )}

            {/* Right side: clear + chevron */}
            <div className="ml-auto flex items-center gap-1 shrink-0 pl-1">
              {clearable && selected.length > 0 && !disabled && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    clearAll();
                  }}
                  className="text-slate-600 hover:text-slate-700 transition-colors"
                  aria-label="Clear all selections"
                >
                  <Icon name="close" size="sm" />
                </button>
              )}
              <Icon
                name="chevron-down"
                size="sm"
                className={cn(
                  "text-slate-500 transition-transform",
                  isOpen && "rotate-180",
                )}
              />
            </div>
          </div>

          {/* Dropdown */}
          {isOpen && !disabled && (
            <ul
              ref={listRef}
              role="listbox"
              aria-multiselectable="true"
              className="absolute z-50 mt-1 w-full max-h-60 overflow-auto rounded-xl border border-slate-200 bg-white py-1 shadow-float"
            >
              {filteredOptions.length === 0 && (
                <li className="px-4 py-3 text-sm text-slate-600">
                  {query ? "No results found." : "No options available."}
                </li>
              )}
              {filteredOptions.map((option, index) => {
                const isHighlighted = index === highlightedIndex;
                const isDisabledOption = option.disabled || atLimit;
                return (
                  <li
                    key={option.value}
                    role="option"
                    aria-selected={selected.includes(option.value)}
                    aria-disabled={isDisabledOption}
                    className={cn(
                      "flex items-center gap-2 px-4 py-2.5 text-sm cursor-pointer transition-colors",
                      isHighlighted && "bg-slate-50",
                      isDisabledOption && "opacity-50 cursor-not-allowed",
                      !isDisabledOption && !isHighlighted && "hover:bg-slate-50",
                    )}
                    onClick={() => {
                      if (!isDisabledOption) toggleOption(option.value);
                    }}
                    onMouseEnter={() => setHighlightedIndex(index)}
                  >
                    {/* Checkbox indicator */}
                    <span
                      className={cn(
                        "w-4 h-4 rounded border flex items-center justify-center shrink-0 transition-colors",
                        selected.includes(option.value)
                          ? "bg-primary border-primary text-white"
                          : "border-slate-300",
                      )}
                    >
                      {selected.includes(option.value) && (
                        <Icon name="check" size="sm" />
                      )}
                    </span>
                    {option.label}
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        {/* Meta info */}
        {maxSelections && (
          <p className="text-xs text-slate-600">
            {selected.length}/{maxSelections} selected
          </p>
        )}
        {error && <p className="text-xs text-red-600 font-medium">{error}</p>}
      </div>
    );
  },
);
MultiSelect.displayName = "MultiSelect";

export { MultiSelect };
export type { MultiSelectProps, MultiSelectOption, MultiSelectSize };
