import {
  forwardRef,
  useCallback,
  useEffect,
  useRef,
  type TextareaHTMLAttributes,
} from "react";
import { cn } from "../../lib/utils";
import { s } from "../../lib/styles";

type TextareaProps = TextareaHTMLAttributes<HTMLTextAreaElement> & {
  /** Validation error message displayed below the textarea */
  error?: string;
  /** When true, the textarea grows automatically with its content */
  autoResize?: boolean;
  /** Minimum number of visible rows (default: 3). Only used when autoResize is true */
  minRows?: number;
  /** Maximum number of rows before scrolling. Only used when autoResize is true */
  maxRows?: number;
};

/**
 * Computes the line-height of a textarea element in pixels.
 * Falls back to 20 if the computed value is "normal" or unparseable.
 */
function getLineHeight(el: HTMLTextAreaElement): number {
  const computed = window.getComputedStyle(el).lineHeight;
  const parsed = parseFloat(computed);
  return Number.isNaN(parsed) ? 20 : parsed;
}

const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  (
    { className, error, autoResize = false, minRows = 3, maxRows, style, onInput, ...props },
    ref
  ) => {
    const internalRef = useRef<HTMLTextAreaElement | null>(null);

    // Merge the forwarded ref with the internal ref
    const mergeRef = useCallback(
      (node: HTMLTextAreaElement | null) => {
        internalRef.current = node;
        if (typeof ref === "function") {
          ref(node);
        } else if (ref) {
          (ref as React.MutableRefObject<HTMLTextAreaElement | null>).current = node;
        }
      },
      [ref]
    );

    const resize = useCallback(() => {
      const el = internalRef.current;
      if (!el || !autoResize) return;

      const lineHeight = getLineHeight(el);
      const minHeight = lineHeight * minRows;
      const maxHeight = maxRows ? lineHeight * maxRows : undefined;

      // Reset height so scrollHeight reflects actual content size
      el.style.height = "auto";

      let newHeight = Math.max(el.scrollHeight, minHeight);
      if (maxHeight !== undefined && newHeight > maxHeight) {
        newHeight = maxHeight;
        el.style.overflowY = "auto";
      } else {
        el.style.overflowY = "hidden";
      }

      el.style.height = `${newHeight}px`;
    }, [autoResize, minRows, maxRows]);

    // Resize on mount and when value changes from the outside
    useEffect(() => {
      resize();
    }, [resize, props.value, props.defaultValue]);

    const handleInput = useCallback(
      (e: React.InputEvent<HTMLTextAreaElement>) => {
        resize();
        onInput?.(e);
      },
      [resize, onInput]
    );

    // Compute min-height style for autoResize mode so the textarea
    // never shrinks below minRows even when empty.
    const autoResizeStyle: React.CSSProperties | undefined = autoResize
      ? { minHeight: `${minRows * 1.5}rem`, ...style }
      : style;

    return (
      <div className="flex flex-col gap-1.5">
        <textarea
          className={cn(
            s.inputBase,
            "p-4 h-auto min-h-[120px]",
            autoResize ? "resize-none" : "resize-y",
            s.inputFocus,
            s.inputDisabled,
            error && "border-red-300 focus:border-red-500 focus:ring-red-500/20",
            autoResize && "overflow-hidden",
            className
          )}
          ref={mergeRef}
          onInput={handleInput}
          style={autoResizeStyle}
          {...props}
        />
        {error && (
          <p className="text-xs text-red-500 font-medium">{error}</p>
        )}
      </div>
    );
  }
);
Textarea.displayName = "Textarea";

export { Textarea };
export type { TextareaProps };
