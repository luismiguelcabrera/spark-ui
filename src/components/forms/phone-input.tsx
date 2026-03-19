"use client";

import {
  forwardRef,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { cn } from "../../lib/utils";
import { Icon } from "../data-display/icon";
import { countries as allCountries, type Country } from "./phone-input-countries";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type PhoneInputProps = {
  /** Controlled value in E.164 format (e.g. "+14155552671") */
  value?: string;
  /** Default value in E.164 format */
  defaultValue?: string;
  /** Called with the full E.164 value and the ISO country code */
  onChange?: (value: string, countryCode: string) => void;
  /** Default country ISO alpha-2 code */
  defaultCountry?: string;
  /** Filter the country list to only these ISO codes */
  countries?: string[];
  /** Show these countries at the top of the dropdown */
  preferredCountries?: string[];
  /** Label above the input */
  label?: string;
  /** Error message below the input */
  error?: string;
  /** Disable the entire component */
  disabled?: boolean;
  /** Placeholder for the phone number input */
  placeholder?: string;
  /** Size variant */
  size?: "sm" | "md" | "lg";
  /** Additional className on the root wrapper */
  className?: string;
};

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const sizeMap = {
  sm: "h-8 text-sm",
  md: "h-10 text-sm",
  lg: "h-12 text-base",
} as const;

/** Count the digit slots ("9") in a mask */
function countMaskSlots(mask: string): number {
  let count = 0;
  for (let i = 0; i < mask.length; i++) {
    if (mask[i] === "9") count++;
  }
  return count;
}

/** Format raw digits into a mask pattern (9 = digit placeholder) */
function applyMask(mask: string, rawDigits: string): string {
  let result = "";
  let digitIndex = 0;
  for (let i = 0; i < mask.length; i++) {
    if (mask[i] === "9") {
      if (digitIndex < rawDigits.length) {
        result += rawDigits[digitIndex];
        digitIndex++;
      } else {
        break;
      }
    } else {
      if (digitIndex < rawDigits.length) {
        result += mask[i];
      } else {
        break;
      }
    }
  }
  return result;
}

/** Extract raw digits from a string */
function extractDigits(str: string): string {
  return str.replace(/\D/g, "");
}

/** Parse an E.164 value into { country, rawDigits } */
function parseE164(
  e164: string,
  availableCountries: Country[],
  fallbackCountry: Country
): { country: Country; rawDigits: string } {
  if (!e164 || !e164.startsWith("+")) {
    return { country: fallbackCountry, rawDigits: "" };
  }

  // Try to match the longest dial code first
  const sorted = [...availableCountries].sort(
    (a, b) => b.dialCode.length - a.dialCode.length
  );
  for (const c of sorted) {
    if (e164.startsWith(c.dialCode)) {
      return { country: c, rawDigits: extractDigits(e164.slice(c.dialCode.length)) };
    }
  }

  return { country: fallbackCountry, rawDigits: extractDigits(e164) };
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

const PhoneInput = forwardRef<HTMLInputElement, PhoneInputProps>(
  (
    {
      value: valueProp,
      defaultValue,
      onChange,
      defaultCountry = "US",
      countries: countryCodes,
      preferredCountries,
      label,
      error,
      disabled = false,
      placeholder,
      size = "md",
      className,
    },
    ref
  ) => {
    // ---- Available countries ----
    const availableCountries = useMemo(() => {
      if (!countryCodes) return allCountries;
      const codeSet = new Set(countryCodes.map((c) => c.toUpperCase()));
      return allCountries.filter((c) => codeSet.has(c.code));
    }, [countryCodes]);

    // ---- Sorted country list (preferred at top) ----
    const sortedCountries = useMemo(() => {
      if (!preferredCountries || preferredCountries.length === 0) return availableCountries;
      const prefSet = new Set(preferredCountries.map((c) => c.toUpperCase()));
      const preferred = availableCountries.filter((c) => prefSet.has(c.code));
      const rest = availableCountries.filter((c) => !prefSet.has(c.code));
      return [...preferred, ...rest];
    }, [availableCountries, preferredCountries]);

    // ---- Find default / initial country ----
    const fallbackCountry = useMemo(
      () =>
        availableCountries.find((c) => c.code === defaultCountry.toUpperCase()) ??
        availableCountries[0],
      [availableCountries, defaultCountry]
    );

    // ---- Parse initial value ----
    const initial = useMemo(() => {
      const init = valueProp ?? defaultValue ?? "";
      return parseE164(init, availableCountries, fallbackCountry);
    }, []); // eslint-disable-line react-hooks/exhaustive-deps -- only on mount

    // ---- State ----
    const [selectedCountry, setSelectedCountry] = useState<Country>(initial.country);
    const [rawDigits, setRawDigits] = useState(initial.rawDigits);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");

    const wrapperRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    const searchInputRef = useRef<HTMLInputElement>(null);

    // ---- Sync controlled value ----
    useEffect(() => {
      if (valueProp !== undefined) {
        const parsed = parseE164(valueProp, availableCountries, fallbackCountry);
        setSelectedCountry(parsed.country);
        setRawDigits(parsed.rawDigits);
      }
    }, [valueProp, availableCountries, fallbackCountry]);

    // ---- Computed ----
    const mask = selectedCountry.mask;
    const maxDigits = countMaskSlots(mask);
    const displayValue = applyMask(mask, rawDigits);
    const e164Value = selectedCountry.dialCode + rawDigits;

    // ---- Filtered countries for dropdown ----
    const filteredCountries = useMemo(() => {
      if (!searchQuery) return sortedCountries;
      const q = searchQuery.toLowerCase();
      return sortedCountries.filter(
        (c) =>
          c.name.toLowerCase().includes(q) ||
          c.dialCode.includes(q) ||
          c.code.toLowerCase().includes(q)
      );
    }, [sortedCountries, searchQuery]);

    // ---- Handlers ----
    const handleDigitChange = useCallback(
      (e: React.ChangeEvent<HTMLInputElement>) => {
        const digits = extractDigits(e.target.value);
        const clamped = digits.slice(0, maxDigits);
        setRawDigits(clamped);
        onChange?.(selectedCountry.dialCode + clamped, selectedCountry.code);
      },
      [maxDigits, onChange, selectedCountry]
    );

    const handleCountrySelect = useCallback(
      (country: Country) => {
        setSelectedCountry(country);
        setRawDigits("");
        setDropdownOpen(false);
        setSearchQuery("");
        onChange?.(country.dialCode, country.code);
        // Focus the phone input after country selection
        requestAnimationFrame(() => inputRef.current?.focus());
      },
      [onChange]
    );

    const toggleDropdown = useCallback(() => {
      if (disabled) return;
      setDropdownOpen((prev) => {
        const next = !prev;
        if (next) {
          setSearchQuery("");
          requestAnimationFrame(() => searchInputRef.current?.focus());
        }
        return next;
      });
    }, [disabled]);

    // ---- Click outside ----
    useEffect(() => {
      if (!dropdownOpen) return;
      const handler = (e: MouseEvent) => {
        if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
          setDropdownOpen(false);
          setSearchQuery("");
        }
      };
      document.addEventListener("mousedown", handler);
      return () => document.removeEventListener("mousedown", handler);
    }, [dropdownOpen]);

    // ---- Merge refs ----
    const mergedRef = useCallback(
      (el: HTMLInputElement | null) => {
        (inputRef as React.MutableRefObject<HTMLInputElement | null>).current = el;
        if (typeof ref === "function") ref(el);
        else if (ref) (ref as React.MutableRefObject<HTMLInputElement | null>).current = el;
      },
      [ref]
    );

    // ---- Determine if preferred countries separator is needed ----
    const showPreferredSeparator =
      preferredCountries &&
      preferredCountries.length > 0 &&
      !searchQuery;
    const preferredSet = useMemo(
      () => new Set((preferredCountries ?? []).map((c) => c.toUpperCase())),
      [preferredCountries]
    );

    return (
      <div ref={wrapperRef} className={cn("relative flex flex-col gap-1.5", className)}>
        {/* Label */}
        {label && (
          <label className="text-sm font-medium text-slate-700">{label}</label>
        )}

        {/* Input container */}
        <div
          className={cn(
            "inline-flex items-center rounded-xl border bg-slate-50 transition-colors",
            "focus-within:ring-2 focus-within:ring-primary focus-within:border-primary",
            error && "border-red-300 focus-within:border-red-500 focus-within:ring-red-500/20",
            !error && "border-slate-200",
            disabled && "opacity-50 cursor-not-allowed"
          )}
        >
          {/* Country selector button */}
          <button
            type="button"
            disabled={disabled}
            onClick={toggleDropdown}
            aria-label={`Selected country: ${selectedCountry.name}`}
            aria-expanded={dropdownOpen}
            aria-haspopup="listbox"
            className={cn(
              "flex items-center gap-1.5 px-3 border-r border-slate-200 cursor-pointer hover:bg-slate-100 transition-colors rounded-l-xl shrink-0",
              sizeMap[size],
              disabled && "pointer-events-none"
            )}
          >
            <span aria-hidden="true">{selectedCountry.flag}</span>
            <span className="text-sm text-slate-700">{selectedCountry.dialCode}</span>
            <Icon
              name="expand_more"
              size="sm"
              className="text-slate-500 shrink-0"
            />
          </button>

          {/* Phone number input */}
          <input
            ref={mergedRef}
            type="text"
            inputMode="tel"
            value={displayValue}
            onChange={handleDigitChange}
            placeholder={placeholder ?? mask.replace(/9/g, "_")}
            disabled={disabled}
            aria-label="Phone number"
            aria-invalid={error ? true : undefined}
            className={cn(
              "flex-1 min-w-0 bg-transparent outline-none px-3",
              sizeMap[size],
              disabled && "cursor-not-allowed"
            )}
          />
        </div>

        {/* Error message */}
        {error && (
          <p className="text-xs text-red-600 font-medium" role="alert">
            {error}
          </p>
        )}

        {/* Country dropdown */}
        {dropdownOpen && (
          <div className="absolute top-full left-0 z-50 mt-1 w-full bg-white border border-slate-200 rounded-xl shadow-float overflow-hidden">
            {/* Search input */}
            <div className="p-2 border-b border-slate-100">
              <input
                ref={searchInputRef}
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                aria-label="Search countries"
                className={cn(
                  "w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg",
                  "placeholder:text-slate-500",
                  "focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                )}
              />
            </div>

            {/* Country list */}
            <ul
              role="listbox"
              aria-label="Countries"
              className="max-h-60 overflow-y-auto"
            >
              {filteredCountries.length === 0 && (
                <li className="px-3 py-6 text-center text-sm text-slate-600">
                  No countries found
                </li>
              )}
              {filteredCountries.map((country, index) => {
                const isSelected = country.code === selectedCountry.code;
                // Insert separator after the last preferred country
                const showSeparatorAfter =
                  showPreferredSeparator &&
                  preferredSet.has(country.code) &&
                  (index + 1 >= filteredCountries.length ||
                    !preferredSet.has(filteredCountries[index + 1].code));

                return (
                  <li key={country.code}>
                    <button
                      type="button"
                      role="option"
                      aria-selected={isSelected}
                      className={cn(
                        "flex items-center gap-3 px-3 py-2 hover:bg-slate-50 cursor-pointer text-sm w-full text-left transition-colors",
                        isSelected && "bg-primary/5 font-semibold"
                      )}
                      onMouseDown={(e) => {
                        e.preventDefault();
                        handleCountrySelect(country);
                      }}
                    >
                      <span aria-hidden="true" className="text-base">{country.flag}</span>
                      <span className="flex-1 truncate">{country.name}</span>
                      <span className="text-slate-500 text-xs">{country.dialCode}</span>
                    </button>
                    {showSeparatorAfter && (
                      <div className="my-1 h-px bg-slate-100" />
                    )}
                  </li>
                );
              })}
            </ul>
          </div>
        )}
      </div>
    );
  }
);

PhoneInput.displayName = "PhoneInput";

export { PhoneInput };
export type { PhoneInputProps };
