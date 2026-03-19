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
} from "react";
import { cn } from "../../lib/utils";
import { s } from "../../lib/styles";
import { Icon } from "../data-display/icon";
import { Spinner } from "../feedback/spinner";
import { useControllable } from "../../hooks/use-controllable";
import { useDebounce } from "../../hooks/use-debounce";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type AutocompleteOption = {
  value: string;
  label: string;
  disabled?: boolean;
};

type AutocompleteProps = {
  /** Controlled selected value (or free text in freeSolo mode) */
  value?: string;
  /** Default value (uncontrolled) */
  defaultValue?: string;
  /** Called when the value changes */
  onChange?: (value: string) => void;
  /** Static options list */
  options?: AutocompleteOption[];
  /** Async or sync search function called with the debounced query */
  onSearch?: (query: string) => Promise<AutocompleteOption[]> | AutocompleteOption[];
  /** External loading state */
  loading?: boolean;
  /** Debounce delay in ms for onSearch calls */
  debounceMs?: number;
  /** Allow any text input; options serve as suggestions */
  freeSolo?: boolean;
  /** Reserved for future multi-select support */
  multiple?: boolean;
  /** Filter options client-side. Defaults to true when options provided, false when onSearch provided */
  filterLocally?: boolean;
  /** Message shown when no results match */
  emptyMessage?: string;
  /** Message shown while searching */
  loadingMessage?: string;
  /** Label rendered above the input */
  label?: string;
  /** Error message rendered below the input */
  error?: string;
  /** Disable the component */
  disabled?: boolean;
  /** Input placeholder */
  placeholder?: string;
  /** Size variant */
  size?: "sm" | "md" | "lg";
  /** Additional className on the input element */
  className?: string;
};

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const sizeMap = {
  sm: "h-8 text-sm",
  md: "h-10 text-sm",
  lg: "h-12 text-base",
};

// Use useLayoutEffect on client, useEffect on server (SSR-safe)
const useIsomorphicLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

// ---------------------------------------------------------------------------
// Autocomplete component
// ---------------------------------------------------------------------------

const Autocomplete = forwardRef<HTMLInputElement, AutocompleteProps>(
  (
    {
      value: valueProp,
      defaultValue = "",
      onChange,
      options = [],
      onSearch,
      loading: externalLoading = false,
      debounceMs = 300,
      freeSolo = false,
      filterLocally: filterLocallyProp,
      emptyMessage = "No results found",
      loadingMessage = "Loading...",
      label,
      error,
      disabled = false,
      placeholder,
      size = "md",
      className,
    },
    ref
  ) => {
    const filterLocally = filterLocallyProp ?? !onSearch;

    const [value, setValue] = useControllable({
      value: valueProp,
      defaultValue,
      onChange,
    });

    const [inputValue, setInputValue] = useState(() => {
      // Initialize input display from value if it matches an option
      if (value) {
        const match = options.find((o) => o.value === value);
        return match ? match.label : value;
      }
      return "";
    });
    const [isOpen, setIsOpen] = useState(false);
    const [highlightedIndex, setHighlightedIndex] = useState(-1);
    const [searchResults, setSearchResults] = useState<AutocompleteOption[]>([]);
    const [isSearching, setIsSearching] = useState(false);

    const wrapperRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    const listRef = useRef<HTMLUListElement>(null);

    const debouncedQuery = useDebounce(inputValue, debounceMs);

    // ---- Determine which options to display ----
    const displayOptions = useMemo(() => {
      if (onSearch && !filterLocally) {
        return searchResults;
      }
      if (filterLocally && inputValue) {
        const q = inputValue.toLowerCase();
        return options.filter((o) => o.label.toLowerCase().includes(q));
      }
      return options;
    }, [onSearch, filterLocally, searchResults, inputValue, options]);

    // ---- Async search effect ----
    useEffect(() => {
      if (!onSearch || filterLocally) return;
      if (!debouncedQuery) {
        setSearchResults([]);
        setIsSearching(false);
        return;
      }

      let cancelled = false;
      setIsSearching(true);

      const result = onSearch(debouncedQuery);
      if (result instanceof Promise) {
        result
          .then((results) => {
            if (!cancelled) {
              setSearchResults(results);
              setIsSearching(false);
            }
          })
          .catch(() => {
            if (!cancelled) {
              setSearchResults([]);
              setIsSearching(false);
            }
          });
      } else {
        setSearchResults(result);
        setIsSearching(false);
      }

      return () => {
        cancelled = true;
      };
    }, [debouncedQuery, onSearch, filterLocally]);

    // ---- Sync inputValue when controlled value changes externally ----
    useEffect(() => {
      if (valueProp !== undefined) {
        const match = options.find((o) => o.value === valueProp);
        setInputValue(match ? match.label : valueProp);
      }
    }, [valueProp]); // eslint-disable-line react-hooks/exhaustive-deps

    // ---- Clamp highlight when options change ----
    useEffect(() => {
      setHighlightedIndex((prev) => // eslint-disable-line react-hooks/set-state-in-effect -- intentional: clamp highlight index when options change
        prev >= displayOptions.length
          ? Math.max(0, displayOptions.length - 1)
          : prev
      );
    }, [displayOptions.length]);

    // ---- Scroll highlighted item into view ----
    useIsomorphicLayoutEffect(() => {
      if (!isOpen || highlightedIndex < 0) return;
      const list = listRef.current;
      if (!list) return;
      const item = list.children[highlightedIndex] as HTMLElement | undefined;
      if (item && typeof item.scrollIntoView === "function") {
        item.scrollIntoView({ block: "nearest" });
      }
    }, [highlightedIndex, isOpen]);

    // ---- Click outside to close ----
    useEffect(() => {
      if (!isOpen) return;
      const handler = (e: MouseEvent) => {
        if (
          wrapperRef.current &&
          !wrapperRef.current.contains(e.target as Node)
        ) {
          setIsOpen(false);
        }
      };
      document.addEventListener("mousedown", handler);
      return () => document.removeEventListener("mousedown", handler);
    }, [isOpen]);

    // ---- Helpers ----
    const selectOption = useCallback(
      (opt: AutocompleteOption) => {
        if (opt.disabled) return;
        setInputValue(opt.label);
        setValue(opt.value);
        setIsOpen(false);
        setHighlightedIndex(-1);
      },
      [setValue]
    );

    const handleInputChange = useCallback(
      (e: React.ChangeEvent<HTMLInputElement>) => {
        const text = e.target.value;
        setInputValue(text);
        if (!isOpen) setIsOpen(true);
        setHighlightedIndex(0);

        if (freeSolo) {
          setValue(text);
        }
      },
      [isOpen, freeSolo, setValue]
    );

    const handleFocus = useCallback(() => {
      if (!disabled) {
        setIsOpen(true);
        if (displayOptions.length > 0) {
          setHighlightedIndex(0);
        }
      }
    }, [disabled, displayOptions.length]);

    // ---- Keyboard navigation ----
    const handleKeyDown = useCallback(
      (e: KeyboardEvent<HTMLInputElement>) => {
        switch (e.key) {
          case "ArrowDown":
            e.preventDefault();
            if (!isOpen) {
              setIsOpen(true);
              setHighlightedIndex(0);
            } else {
              setHighlightedIndex((prev) => {
                let next = prev + 1;
                while (next < displayOptions.length && displayOptions[next]?.disabled) next++;
                return next < displayOptions.length ? next : prev;
              });
            }
            break;
          case "ArrowUp":
            e.preventDefault();
            if (isOpen) {
              setHighlightedIndex((prev) => {
                let next = prev - 1;
                while (next >= 0 && displayOptions[next]?.disabled) next--;
                return next >= 0 ? next : prev;
              });
            }
            break;
          case "Enter":
            if (isOpen && highlightedIndex >= 0 && displayOptions[highlightedIndex]) {
              e.preventDefault();
              selectOption(displayOptions[highlightedIndex]);
            }
            break;
          case "Escape":
            e.preventDefault();
            setIsOpen(false);
            break;
          case "Tab":
            setIsOpen(false);
            break;
        }
      },
      [isOpen, highlightedIndex, displayOptions, selectOption]
    );

    // ---- Derived state ----
    const showLoading = externalLoading || isSearching;
    const showDropdown = isOpen && !disabled;

    return (
      <div ref={wrapperRef} className="flex flex-col gap-1.5 relative">
        {/* Label */}
        {label && (
          <label className="text-sm font-medium text-slate-700">{label}</label>
        )}

        {/* Input wrapper */}
        <div className="relative">
          <input
            ref={(el) => {
              (inputRef as React.MutableRefObject<HTMLInputElement | null>).current = el;
              if (typeof ref === "function") ref(el);
              else if (ref) (ref as React.MutableRefObject<HTMLInputElement | null>).current = el;
            }}
            type="text"
            role="combobox"
            aria-expanded={isOpen}
            aria-haspopup="listbox"
            aria-autocomplete="list"
            aria-invalid={error ? true : undefined}
            placeholder={placeholder}
            value={inputValue}
            disabled={disabled}
            onChange={handleInputChange}
            onFocus={handleFocus}
            onKeyDown={handleKeyDown}
            className={cn(
              s.inputBase,
              s.inputFocus,
              s.inputDisabled,
              sizeMap[size],
              "pr-10",
              error && "border-red-300 focus:border-red-500 focus:ring-red-500/20",
              className
            )}
          />

          {/* Right icon: spinner or chevron */}
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
            {showLoading ? (
              <Spinner size="sm" color="muted" />
            ) : (
              <Icon
                name="expand_more"
                size="sm"
                className="text-slate-500"
              />
            )}
          </div>
        </div>

        {/* Dropdown */}
        {showDropdown && (
          <div
            className="absolute top-full left-0 z-50 mt-1 w-full bg-white border border-slate-200 rounded-xl shadow-float overflow-hidden"
            style={{ marginTop: label ? undefined : undefined }}
          >
            {showLoading ? (
              <div className="flex items-center gap-2 px-3 py-6 justify-center text-sm text-slate-600">
                <Spinner size="sm" color="muted" />
                <span>{loadingMessage}</span>
              </div>
            ) : displayOptions.length === 0 ? (
              <div className="px-3 py-6 text-center text-sm text-slate-600">
                {emptyMessage}
              </div>
            ) : (
              <ul
                ref={listRef}
                role="listbox"
                className="max-h-60 overflow-y-auto py-1"
              >
                {displayOptions.map((opt, index) => {
                  const isHighlighted = index === highlightedIndex;
                  return (
                    <li
                      key={opt.value}
                      role="option"
                      aria-selected={opt.value === value}
                      aria-disabled={opt.disabled || undefined}
                      data-highlighted={isHighlighted || undefined}
                      className={cn(
                        "px-3 py-2 text-sm cursor-pointer transition-colors select-none",
                        isHighlighted && "bg-primary/10 text-primary",
                        opt.disabled && "opacity-50 cursor-not-allowed"
                      )}
                      onMouseDown={(e) => {
                        e.preventDefault();
                        selectOption(opt);
                      }}
                      onMouseEnter={() => setHighlightedIndex(index)}
                    >
                      {opt.label}
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        )}

        {/* Error message */}
        {error && (
          <p className="text-xs text-red-600 font-medium" role="alert">
            {error}
          </p>
        )}
      </div>
    );
  }
);

Autocomplete.displayName = "Autocomplete";

export { Autocomplete };
export type { AutocompleteProps, AutocompleteOption };
