"use client";

import {
  forwardRef,
  useCallback,
  useEffect,
  useRef,
  type TextareaHTMLAttributes,
} from "react";
import { cn } from "../../lib/utils";
import { s } from "../../lib/styles";

type AutoResizeTextareaProps = TextareaHTMLAttributes<HTMLTextAreaElement> & {
  error?: string;
  /** Minimum number of visible rows (default 3) */
  minRows?: number;
  /** Maximum number of visible rows before scrolling (default unlimited) */
  maxRows?: number;
};

const AutoResizeTextarea = forwardRef<
  HTMLTextAreaElement,
  AutoResizeTextareaProps
>(({ className, error, minRows = 3, maxRows, value, defaultValue, onInput, ...props }, ref) => {
  const internalRef = useRef<HTMLTextAreaElement | null>(null);

  // Merge forwarded ref with internal ref
  const setRefs = useCallback(
    (el: HTMLTextAreaElement | null) => {
      internalRef.current = el;
      if (typeof ref === "function") {
        ref(el);
      } else if (ref) {
        (ref as React.MutableRefObject<HTMLTextAreaElement | null>).current = el;
      }
    },
    [ref]
  );

  const resize = useCallback(() => {
    const el = internalRef.current;
    if (!el) return;

    // Get computed line height and padding
    const computed = getComputedStyle(el);
    const lineHeight = parseFloat(computed.lineHeight) || 20;
    const paddingTop = parseFloat(computed.paddingTop) || 0;
    const paddingBottom = parseFloat(computed.paddingBottom) || 0;

    // Calculate min height from minRows
    const minHeight = minRows * lineHeight + paddingTop + paddingBottom;

    // Reset height to auto to get accurate scrollHeight
    el.style.height = "auto";

    // Calculate the desired height
    let newHeight = Math.max(el.scrollHeight, minHeight);

    // Apply max height constraint if maxRows is set
    if (maxRows !== undefined) {
      const maxHeight = maxRows * lineHeight + paddingTop + paddingBottom;
      if (newHeight > maxHeight) {
        newHeight = maxHeight;
        el.style.overflowY = "auto";
      } else {
        el.style.overflowY = "hidden";
      }
    } else {
      el.style.overflowY = "hidden";
    }

    el.style.height = `${newHeight}px`;
  }, [minRows, maxRows]);

  // Apply min-height on mount and resize when value changes
  useEffect(() => {
    const el = internalRef.current;
    if (!el) return;

    // Set initial min-height
    const computed = getComputedStyle(el);
    const lineHeight = parseFloat(computed.lineHeight) || 20;
    const paddingTop = parseFloat(computed.paddingTop) || 0;
    const paddingBottom = parseFloat(computed.paddingBottom) || 0;
    const minHeight = minRows * lineHeight + paddingTop + paddingBottom;
    el.style.minHeight = `${minHeight}px`;

    resize();
  }, [minRows, resize, value, defaultValue]);

  const handleInput = useCallback(
    (e: React.FormEvent<HTMLTextAreaElement>) => {
      resize();
      onInput?.(e as unknown as React.InputEvent<HTMLTextAreaElement>);
    },
    [resize, onInput]
  );

  const hasAccessibleName =
    !!props["aria-label"] ||
    !!props["aria-labelledby"] ||
    !!props.placeholder ||
    !!props.id;

  return (
    <div className="flex flex-col gap-1.5">
      <textarea
        className={cn(
          s.inputBase,
          "p-4 h-auto resize-none overflow-hidden",
          s.inputFocus,
          s.inputDisabled,
          error && "border-red-300 focus:border-red-500 focus:ring-red-500/20",
          className
        )}
        ref={setRefs}
        value={value}
        defaultValue={defaultValue}
        onInput={handleInput}
        aria-label={!hasAccessibleName ? "Text area" : undefined}
        aria-invalid={error ? true : undefined}
        {...props}
      />
      {error && (
        <p className="text-xs text-red-600 font-medium" role="alert">
          {error}
        </p>
      )}
    </div>
  );
});
AutoResizeTextarea.displayName = "AutoResizeTextarea";

export { AutoResizeTextarea };
export type { AutoResizeTextareaProps };
