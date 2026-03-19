"use client";

import {
  forwardRef,
  useCallback,
  useEffect,
  useRef,
  type KeyboardEvent,
} from "react";
import { cn } from "../../lib/utils";
import { useControllable } from "../../hooks/use-controllable";

type CodeInputProps = {
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  /** Language hint for class-based highlighting: "json", "javascript", "html", "css" */
  language?: string;
  /** Show line numbers gutter (default true) */
  lineNumbers?: boolean;
  readOnly?: boolean;
  label?: string;
  error?: string;
  disabled?: boolean;
  /** Minimum visible lines (default 5) */
  minLines?: number;
  /** Maximum visible lines before scrolling (default 20) */
  maxLines?: number;
  placeholder?: string;
  /** Number of spaces per Tab (default 2) */
  tabSize?: number;
  /** Wrap long lines instead of horizontal scroll (default false) */
  wrap?: boolean;
  /** Custom syntax highlight function returning HTML string */
  highlight?: (code: string) => string;
  className?: string;
};

// ── Minimal JSON tokenizer ──────────────────────────────────────────────

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function tokenizeJSON(code: string): string {
  const escaped = escapeHtml(code);
  return escaped
    // strings (must come before keys to avoid double-match)
    .replace(
      /(&quot;|")([^"\\]|\\.)*(&quot;|")\s*:/g,
      (m) => `<span class="text-amber-700">${m}</span>`
    )
    .replace(
      /(&quot;|")([^"\\]|\\.)*(&quot;|")/g,
      (m) => `<span class="text-green-600">${m}</span>`
    )
    // numbers
    .replace(
      /\b(-?\d+\.?\d*([eE][+-]?\d+)?)\b/g,
      (m) => `<span class="text-blue-600">${m}</span>`
    )
    // booleans & null
    .replace(
      /\b(true|false|null)\b/g,
      (m) => `<span class="text-purple-600">${m}</span>`
    )
    // punctuation
    .replace(
      /([{}[\]:,])/g,
      (m) => `<span class="text-slate-500">${m}</span>`
    );
}

function defaultHighlight(code: string, language?: string): string {
  if (language === "json") return tokenizeJSON(code);
  return escapeHtml(code);
}

// ── Component ───────────────────────────────────────────────────────────

const CodeInput = forwardRef<HTMLTextAreaElement, CodeInputProps>(
  (
    {
      value: valueProp,
      defaultValue = "",
      onChange,
      language,
      lineNumbers = true,
      readOnly = false,
      label,
      error,
      disabled = false,
      minLines = 5,
      maxLines = 20,
      placeholder,
      tabSize = 2,
      wrap = false,
      highlight,
      className,
    },
    ref
  ) => {
    const [value, setValue] = useControllable({
      value: valueProp,
      defaultValue,
      onChange,
    });

    const preRef = useRef<HTMLPreElement>(null);
    const textareaInternalRef = useRef<HTMLTextAreaElement | null>(null);

    // Merge forwarded ref with internal ref
    const setRefs = useCallback(
      (el: HTMLTextAreaElement | null) => {
        textareaInternalRef.current = el;
        if (typeof ref === "function") {
          ref(el);
        } else if (ref) {
          (ref as React.MutableRefObject<HTMLTextAreaElement | null>).current =
            el;
        }
      },
      [ref]
    );

    // Sync scroll between textarea and pre/code overlay
    const handleScroll = useCallback(() => {
      const textarea = textareaInternalRef.current;
      const pre = preRef.current;
      if (textarea && pre) {
        pre.scrollTop = textarea.scrollTop;
        pre.scrollLeft = textarea.scrollLeft;
      }
    }, []);

    // Tab / Shift+Tab handling
    const handleKeyDown = useCallback(
      (e: KeyboardEvent<HTMLTextAreaElement>) => {
        if (readOnly || disabled) return;

        if (e.key === "Tab") {
          e.preventDefault();
          const el = e.currentTarget;
          const start = el.selectionStart;
          const end = el.selectionEnd;

          if (e.shiftKey) {
            // Shift+Tab: remove up to tabSize leading spaces from current line
            const before = value.slice(0, start);
            const lineStart = before.lastIndexOf("\n") + 1;
            const linePrefix = value.slice(lineStart, start);
            const spacesToRemove = Math.min(
              tabSize,
              linePrefix.length - linePrefix.trimStart().length
            );
            if (spacesToRemove > 0) {
              const newValue =
                value.slice(0, lineStart) +
                value.slice(lineStart + spacesToRemove);
              setValue(newValue);
              requestAnimationFrame(() => {
                el.selectionStart = start - spacesToRemove;
                el.selectionEnd = end - spacesToRemove;
              });
            }
          } else {
            // Tab: insert spaces
            const spaces = " ".repeat(tabSize);
            const newValue =
              value.slice(0, start) + spaces + value.slice(end);
            setValue(newValue);
            requestAnimationFrame(() => {
              el.selectionStart = start + tabSize;
              el.selectionEnd = start + tabSize;
            });
          }
        }
      },
      [value, setValue, tabSize, readOnly, disabled]
    );

    // Calculate height
    const lineCount = Math.max((value || "").split("\n").length, 1);
    const visibleLines = Math.max(minLines, Math.min(lineCount, maxLines));
    const lineHeightEm = 1.5; // matches text-sm leading-relaxed
    const paddingLines = 2; // top + bottom padding equivalent
    const totalHeight = `${(visibleLines + paddingLines) * lineHeightEm}em`;
    const overflowY = lineCount > maxLines ? "auto" : "hidden";

    // Highlighted code HTML
    const highlightedHtml = highlight
      ? highlight(value || "")
      : defaultHighlight(value || "", language);

    // Line numbers
    const lines = (value || "").split("\n");
    const lineNumbersContent = lines.map((_, i) => i + 1);

    // Sync scroll on value change
    useEffect(() => {
      handleScroll();
    }, [value, handleScroll]);

    const whitespaceCls = wrap ? "whitespace-pre-wrap break-words" : "whitespace-pre";

    return (
      <div className={cn("flex flex-col gap-1.5", className)}>
        {label && (
          <label className="text-sm font-medium text-slate-700">
            {label}
          </label>
        )}

        <div
          className={cn(
            "relative font-mono text-sm bg-slate-900 text-slate-100 rounded-xl border overflow-hidden",
            error ? "border-red-500" : "border-slate-700",
            disabled && "opacity-50 cursor-not-allowed"
          )}
          style={{ height: totalHeight }}
        >
          {/* Line numbers gutter */}
          {lineNumbers && (
            <div
              className="absolute left-0 top-0 bottom-0 bg-slate-800/50 border-r border-slate-700 px-3 py-4 text-right text-slate-500 text-xs select-none overflow-hidden z-10"
              style={{ width: "3.5ch", paddingRight: "0.5ch" }}
              aria-hidden="true"
              data-testid="line-numbers"
            >
              {lineNumbersContent.map((num) => (
                <div key={num} style={{ lineHeight: `${lineHeightEm}em` }}>
                  {num}
                </div>
              ))}
            </div>
          )}

          {/* Highlighted code overlay */}
          <pre
            ref={preRef}
            className={cn(
              "absolute inset-0 m-0 py-4 pointer-events-none overflow-hidden",
              whitespaceCls,
              lineNumbers ? "pl-[4.5ch] pr-4" : "px-4"
            )}
            aria-hidden="true"
            style={{ lineHeight: `${lineHeightEm}em` }}
          >
            <code
              className={language ? `language-${language}` : undefined}
              dangerouslySetInnerHTML={{
                __html: highlightedHtml + "\n",
              }}
            />
          </pre>

          {/* Transparent textarea for user input */}
          <textarea
            ref={setRefs}
            className={cn(
              "absolute inset-0 w-full h-full bg-transparent py-4 m-0 resize-none font-mono text-sm",
              "text-transparent caret-slate-100 outline-none border-none",
              "focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-inset",
              whitespaceCls,
              lineNumbers ? "pl-[4.5ch] pr-4" : "px-4"
            )}
            style={{
              lineHeight: `${lineHeightEm}em`,
              overflowY,
              overflowX: wrap ? "hidden" : "auto",
              tabSize,
            }}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onScroll={handleScroll}
            onKeyDown={handleKeyDown}
            readOnly={readOnly}
            disabled={disabled}
            placeholder={placeholder}
            spellCheck={false}
            autoCapitalize="off"
            autoComplete="off"
            autoCorrect="off"
            aria-label={label || "Code editor"}
            aria-invalid={error ? true : undefined}
            data-language={language}
          />
        </div>

        {error && (
          <p className="text-xs text-red-600 font-medium" role="alert">
            {error}
          </p>
        )}
      </div>
    );
  }
);
CodeInput.displayName = "CodeInput";

export { CodeInput };
export type { CodeInputProps };
