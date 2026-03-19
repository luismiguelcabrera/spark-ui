"use client";

import {
  forwardRef,
  useState,
  useRef,
  useCallback,
  useEffect,
  type ReactNode,
  type KeyboardEvent,
  type ChangeEvent,
} from "react";
import { cn } from "../../lib/utils";
import { s } from "../../lib/styles";
import { useControllable } from "../../hooks/use-controllable";
import { Spinner } from "../feedback/spinner";

export type MentionOption = {
  value: string;
  label: string;
  avatar?: string;
  description?: string;
  disabled?: boolean;
};

export type MentionProps = {
  options: MentionOption[];
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  onMention?: (option: MentionOption) => void;
  trigger?: string;
  placeholder?: string;
  disabled?: boolean;
  size?: "sm" | "md" | "lg";
  multiline?: boolean;
  rows?: number;
  loading?: boolean;
  notFoundContent?: ReactNode;
  className?: string;
};

const sizeStyles = {
  sm: "h-9 text-sm px-3",
  md: "h-12 text-sm px-4",
  lg: "h-14 text-base px-4",
} as const;

const textareaSizeStyles = {
  sm: "text-sm px-3 py-2",
  md: "text-sm px-4 py-3",
  lg: "text-base px-4 py-4",
} as const;

const dropdownSizeStyles = {
  sm: "text-sm",
  md: "text-sm",
  lg: "text-base",
} as const;

function getQueryInfo(
  text: string,
  cursorPos: number,
  trigger: string
): { active: boolean; query: string; startIndex: number } {
  // Look backward from cursor to find the trigger character
  const beforeCursor = text.slice(0, cursorPos);
  const lastTriggerIndex = beforeCursor.lastIndexOf(trigger);

  if (lastTriggerIndex === -1) {
    return { active: false, query: "", startIndex: -1 };
  }

  // Trigger must be at start of text or preceded by whitespace
  if (
    lastTriggerIndex > 0 &&
    !/\s/.test(beforeCursor[lastTriggerIndex - 1])
  ) {
    return { active: false, query: "", startIndex: -1 };
  }

  const query = beforeCursor.slice(lastTriggerIndex + trigger.length);

  // Query must not contain whitespace (would mean the mention is "done")
  if (/\s/.test(query)) {
    return { active: false, query: "", startIndex: -1 };
  }

  return { active: true, query, startIndex: lastTriggerIndex };
}

const Mention = forwardRef<
  HTMLInputElement | HTMLTextAreaElement,
  MentionProps
>(
  (
    {
      options,
      value: valueProp,
      defaultValue = "",
      onChange,
      onMention,
      trigger = "@",
      placeholder,
      disabled = false,
      size = "md",
      multiline = false,
      rows = 3,
      loading = false,
      notFoundContent,
      className,
    },
    ref
  ) => {
    const [text, setText] = useControllable({
      value: valueProp,
      defaultValue,
      onChange,
    });

    const [showDropdown, setShowDropdown] = useState(false);
    const [query, setQuery] = useState("");
    const [triggerStartIndex, setTriggerStartIndex] = useState(-1);
    const [activeIndex, setActiveIndex] = useState(0);
    const containerRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement | null>(
      null
    );
    const dropdownRef = useRef<HTMLUListElement>(null);

    const filteredOptions = options.filter(
      (opt) =>
        opt.label.toLowerCase().includes(query.toLowerCase()) && !opt.disabled
    );

    // Close dropdown on click outside
    useEffect(() => {
      if (!showDropdown) return;

      function handleClickOutside(e: MouseEvent) {
        if (
          containerRef.current &&
          !containerRef.current.contains(e.target as Node)
        ) {
          setShowDropdown(false);
        }
      }

      document.addEventListener("mousedown", handleClickOutside);
      return () =>
        document.removeEventListener("mousedown", handleClickOutside);
    }, [showDropdown]);

    // Scroll active option into view
    useEffect(() => {
      if (!showDropdown || !dropdownRef.current) return;
      const activeEl = dropdownRef.current.children[activeIndex] as
        | HTMLElement
        | undefined;
      if (typeof activeEl?.scrollIntoView === "function") {
        activeEl.scrollIntoView({ block: "nearest" });
      }
    }, [activeIndex, showDropdown]);

    const handleChange = useCallback(
      (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const newValue = e.target.value;
        const cursorPos = e.target.selectionStart ?? newValue.length;

        setText(newValue);

        const info = getQueryInfo(newValue, cursorPos, trigger);
        if (info.active) {
          setQuery(info.query);
          setTriggerStartIndex(info.startIndex);
          setShowDropdown(true);
          setActiveIndex(0);
        } else {
          setShowDropdown(false);
          setQuery("");
          setTriggerStartIndex(-1);
        }
      },
      [setText, trigger]
    );

    const selectOption = useCallback(
      (option: MentionOption) => {
        if (!inputRef.current) return;

        const mentionText = `${trigger}${option.label} `;
        const before = text.slice(0, triggerStartIndex);
        const cursorPos =
          inputRef.current.selectionStart ?? text.length;
        const after = text.slice(cursorPos);
        const newText = before + mentionText + after;

        setText(newText);
        setShowDropdown(false);
        setQuery("");
        setTriggerStartIndex(-1);
        onMention?.(option);

        // Restore focus and cursor position
        requestAnimationFrame(() => {
          if (inputRef.current) {
            inputRef.current.focus();
            const newCursor = before.length + mentionText.length;
            inputRef.current.setSelectionRange(newCursor, newCursor);
          }
        });
      },
      [text, triggerStartIndex, trigger, setText, onMention]
    );

    const handleKeyDown = useCallback(
      (e: KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        if (!showDropdown) return;

        switch (e.key) {
          case "ArrowDown":
            e.preventDefault();
            setActiveIndex((prev) =>
              prev < filteredOptions.length - 1 ? prev + 1 : 0
            );
            break;
          case "ArrowUp":
            e.preventDefault();
            setActiveIndex((prev) =>
              prev > 0 ? prev - 1 : filteredOptions.length - 1
            );
            break;
          case "Enter":
          case "Tab":
            if (filteredOptions.length > 0) {
              e.preventDefault();
              selectOption(filteredOptions[activeIndex]);
            }
            break;
          case "Escape":
            e.preventDefault();
            setShowDropdown(false);
            break;
        }
      },
      [showDropdown, filteredOptions, activeIndex, selectOption]
    );

    const setInputRef = useCallback(
      (el: HTMLInputElement | HTMLTextAreaElement | null) => {
        inputRef.current = el;
        if (typeof ref === "function") {
          ref(el as HTMLInputElement & HTMLTextAreaElement);
        } else if (ref) {
          (ref as React.MutableRefObject<HTMLInputElement | HTMLTextAreaElement | null>).current = el;
        }
      },
      [ref]
    );

    return (
      <div ref={containerRef} className="relative">
        {multiline ? (
          <textarea
            ref={setInputRef as React.Ref<HTMLTextAreaElement>}
            rows={rows}
            value={text}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            disabled={disabled}
            className={cn(
              s.inputBase,
              "h-auto min-h-[80px] resize-none",
              textareaSizeStyles[size],
              s.inputFocus,
              s.inputDisabled,
              className
            )}
          />
        ) : (
          <input
            ref={setInputRef as React.Ref<HTMLInputElement>}
            type="text"
            role="combobox"
            value={text}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            disabled={disabled}
            aria-autocomplete="list"
            aria-expanded={showDropdown}
            aria-haspopup="listbox"
            className={cn(
              s.inputBase,
              sizeStyles[size],
              s.inputFocus,
              s.inputDisabled,
              className
            )}
          />
        )}

        {showDropdown && (
          <ul
            ref={dropdownRef}
            role="listbox"
            aria-label="Suggestions"
            className={cn(
              "absolute left-0 right-0 z-50 mt-1 max-h-60 overflow-auto",
              "bg-white border border-slate-200 rounded-xl shadow-float py-1",
              dropdownSizeStyles[size]
            )}
          >
            {loading ? (
              <li className="flex items-center justify-center py-4">
                <Spinner size="sm" />
              </li>
            ) : filteredOptions.length === 0 ? (
              <li className="px-4 py-3 text-slate-600 text-center">
                {notFoundContent ?? "No results found"}
              </li>
            ) : (
              filteredOptions.map((option, index) => (
                <li
                  key={option.value}
                  role="option"
                  aria-selected={index === activeIndex}
                  className={cn(
                    "flex items-center gap-3 px-4 py-2.5 cursor-pointer transition-colors",
                    index === activeIndex
                      ? "bg-primary/5 text-primary"
                      : "text-slate-700 hover:bg-slate-50"
                  )}
                  onMouseDown={(e) => {
                    e.preventDefault();
                    selectOption(option);
                  }}
                  onMouseEnter={() => setActiveIndex(index)}
                >
                  {option.avatar && (
                    <img
                      src={option.avatar}
                      alt=""
                      className="w-7 h-7 rounded-full object-cover shrink-0"
                    />
                  )}
                  <div className="flex flex-col min-w-0">
                    <span className="font-medium truncate">
                      {option.label}
                    </span>
                    {option.description && (
                      <span className="text-xs text-slate-600 truncate">
                        {option.description}
                      </span>
                    )}
                  </div>
                </li>
              ))
            )}
          </ul>
        )}
      </div>
    );
  }
);
Mention.displayName = "Mention";

export { Mention };
