"use client";

import { forwardRef, useState, useRef, type KeyboardEvent, type InputHTMLAttributes } from "react";
import { cn } from "../../lib/utils";
import { useControllable } from "../../hooks/use-controllable";
import { Icon } from "../data-display/icon";

type TagInputProps = Omit<InputHTMLAttributes<HTMLInputElement>, "value" | "defaultValue" | "onChange" | "size"> & {
  /** Current tags */
  value?: string[];
  /** Default tags */
  defaultValue?: string[];
  /** Callback when tags change */
  onChange?: (tags: string[]) => void;
  /** Maximum number of tags */
  maxTags?: number;
  /** Separator keys that create a new tag */
  separators?: string[];
  /** Whether duplicates are allowed */
  allowDuplicates?: boolean;
  /** Size variant */
  size?: "sm" | "md" | "lg";
  /** Label */
  label?: string;
  /** Error message */
  error?: string;
  /** Tag color */
  color?: "primary" | "secondary" | "default";
};

const sizeMap = {
  sm: "min-h-8 text-sm",
  md: "min-h-10 text-sm",
  lg: "min-h-12 text-base",
};

const tagSizeMap = {
  sm: "text-xs px-1.5 py-0.5",
  md: "text-xs px-2 py-1",
  lg: "text-sm px-2.5 py-1",
};

const tagColorMap = {
  primary: "bg-primary/10 text-primary border-primary/20",
  secondary: "bg-secondary/10 text-secondary border-secondary/20",
  default: "bg-slate-100 text-slate-700 border-slate-200",
};

const TagInput = forwardRef<HTMLInputElement, TagInputProps>(
  (
    {
      className,
      value: valueProp,
      defaultValue = [],
      onChange,
      maxTags,
      separators = ["Enter", ","],
      allowDuplicates = false,
      size = "md",
      label,
      error,
      disabled,
      placeholder = "Type and press enter...",
      color = "primary",
      ...props
    },
    ref
  ) => {
    const [tags, setTags] = useControllable({
      value: valueProp,
      defaultValue,
      onChange,
    });
    const [inputValue, setInputValue] = useState("");
    const inputRef = useRef<HTMLInputElement>(null);

    const addTag = (tag: string) => {
      const trimmed = tag.trim();
      if (!trimmed) return;
      if (!allowDuplicates && tags.includes(trimmed)) return;
      if (maxTags && tags.length >= maxTags) return;
      setTags([...tags, trimmed]);
      setInputValue("");
    };

    const removeTag = (index: number) => {
      if (disabled) return;
      setTags(tags.filter((_, i) => i !== index));
    };

    const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
      if (separators.includes(e.key)) {
        e.preventDefault();
        addTag(inputValue);
      } else if (e.key === "Backspace" && !inputValue && tags.length > 0) {
        removeTag(tags.length - 1);
      }
    };

    const handlePaste = (e: React.ClipboardEvent) => {
      e.preventDefault();
      const text = e.clipboardData.getData("text");
      const newTags = text.split(/[,\n\t]/).map((t) => t.trim()).filter(Boolean);
      const validTags = newTags.filter((t) => allowDuplicates || !tags.includes(t));
      const limited = maxTags ? validTags.slice(0, maxTags - tags.length) : validTags;
      if (limited.length) setTags([...tags, ...limited]);
    };

    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label className="text-sm font-medium text-slate-700">{label}</label>
        )}
        <div
          className={cn(
            "flex flex-wrap items-center gap-1.5 rounded-xl border bg-slate-50 px-3 py-2 transition-colors cursor-text",
            "focus-within:ring-2 focus-within:ring-primary focus-within:border-primary",
            error ? "border-red-300" : "border-slate-200",
            disabled && "opacity-50 cursor-not-allowed",
            sizeMap[size],
            className
          )}
          onClick={() => inputRef.current?.focus()}
        >
          {tags.map((tag, index) => (
            <span
              key={`${tag}-${index}`}
              className={cn(
                "inline-flex items-center gap-1 rounded-md border font-medium",
                tagSizeMap[size],
                tagColorMap[color]
              )}
            >
              {tag}
              {!disabled && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    removeTag(index);
                  }}
                  className="hover:text-red-500 transition-colors"
                  aria-label={`Remove ${tag}`}
                >
                  <Icon name="close" size="sm" />
                </button>
              )}
            </span>
          ))}
          <input
            ref={(el) => {
              (inputRef as React.MutableRefObject<HTMLInputElement | null>).current = el;
              if (typeof ref === "function") ref(el);
              else if (ref) (ref as React.MutableRefObject<HTMLInputElement | null>).current = el;
            }}
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            onPaste={handlePaste}
            placeholder={tags.length === 0 ? placeholder : ""}
            disabled={disabled || (maxTags !== undefined && tags.length >= maxTags)}
            className="flex-1 min-w-[80px] bg-transparent outline-none text-sm placeholder:text-slate-400"
            {...props}
          />
        </div>
        {maxTags && (
          <p className="text-xs text-slate-400">
            {tags.length}/{maxTags} tags
          </p>
        )}
        {error && <p className="text-xs text-red-500 font-medium">{error}</p>}
      </div>
    );
  }
);
TagInput.displayName = "TagInput";

export { TagInput };
export type { TagInputProps };
