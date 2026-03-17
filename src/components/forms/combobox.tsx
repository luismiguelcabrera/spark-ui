"use client";

import { useState, useRef, useEffect, useMemo } from "react";
import { cn } from "../../lib/utils";
import { s } from "../../lib/styles";
import { Icon } from "../data-display/icon";

type ComboboxOption = {
  value: string;
  label: string;
};

type ComboboxProps = {
  options: ComboboxOption[];
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  label?: string;
  error?: string;
  className?: string;
};

function Combobox({
  options,
  value,
  onChange,
  placeholder = "Select...",
  label,
  error,
  className,
}: ComboboxProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const ref = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const filtered = useMemo(
    () =>
      query === ""
        ? options
        : options.filter((o) =>
            o.label.toLowerCase().includes(query.toLowerCase()),
          ),
    [options, query],
  );

  const selected = options.find((o) => o.value === value);

  useEffect(() => {
    if (!isOpen) return;
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [isOpen]);

  return (
    <div ref={ref} className={cn("flex flex-col gap-1.5", className)}>
      {label && (
        <label className={s.textLabel}>{label}</label>
      )}
      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          role="combobox"
          aria-expanded={isOpen}
          aria-autocomplete="list"
          className={cn(
            s.inputBase,
            s.inputFocus,
            "pr-10",
            error && "border-red-300 focus:border-red-500 focus:ring-red-500/20",
          )}
          placeholder={selected ? selected.label : placeholder}
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
        />
        <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
          <Icon name="expand_more" size="sm" className="text-slate-400" />
        </div>
      </div>
      {isOpen && filtered.length > 0 && (
        <ul
          role="listbox"
          className="absolute z-50 mt-1 w-full max-h-60 overflow-auto rounded-xl border border-slate-200 bg-white py-1 shadow-float"
        >
          {filtered.map((option) => (
            <li
              key={option.value}
              role="option"
              aria-selected={option.value === value}
              className={cn(
                "px-4 py-2.5 text-sm cursor-pointer transition-colors hover:bg-slate-50",
                option.value === value && "bg-primary/5 text-primary font-medium",
              )}
              onClick={() => {
                onChange?.(option.value);
                setQuery("");
                setIsOpen(false);
              }}
            >
              {option.label}
            </li>
          ))}
        </ul>
      )}
      {isOpen && filtered.length === 0 && (
        <div className="absolute z-50 mt-1 w-full rounded-xl border border-slate-200 bg-white py-3 px-4 shadow-float text-sm text-slate-500">
          No results found.
        </div>
      )}
      {error && <p className="text-xs text-red-500 font-medium">{error}</p>}
    </div>
  );
}

export { Combobox };
export type { ComboboxProps, ComboboxOption };
