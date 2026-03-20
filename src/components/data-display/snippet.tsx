"use client";

import { forwardRef, useState, useCallback, type HTMLAttributes } from "react";
import { cn } from "../../lib/utils";

const colorMap = {
  default: "bg-muted border-muted text-navy-text",
  primary: "bg-primary/10 border-primary/20 text-primary",
  secondary: "bg-secondary/10 border-secondary/20 text-secondary",
  success: "bg-success/10 border-success/20 text-success",
  warning: "bg-warning/10 border-warning/20 text-warning",
  danger: "bg-destructive/10 border-destructive/20 text-destructive",
} as const;

type SnippetColor = keyof typeof colorMap;

type SnippetProps = Omit<HTMLAttributes<HTMLDivElement>, "children" | "color"> & {
  /** The code string to display */
  children: string;
  /** Prefix symbol displayed before the code */
  symbol?: string;
  /** Color scheme */
  color?: SnippetColor;
  /** Hide the copy button */
  hideCopyButton?: boolean;
  /** Hide the prefix symbol */
  hideSymbol?: boolean;
};

const Snippet = forwardRef<HTMLDivElement, SnippetProps>(
  (
    {
      children,
      symbol = "$",
      color = "default",
      hideCopyButton = false,
      hideSymbol = false,
      className,
      ...props
    },
    ref
  ) => {
    const [copied, setCopied] = useState(false);

    const handleCopy = useCallback(async () => {
      try {
        await navigator.clipboard.writeText(children);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch {
        // Fallback for environments without clipboard API
      }
    }, [children]);

    return (
      <div
        ref={ref}
        className={cn(
          "inline-flex items-center gap-3 rounded-lg border px-4 py-2 font-mono text-sm",
          colorMap[color],
          className
        )}
        {...props}
      >
        <code className="flex items-center gap-2 flex-1 min-w-0">
          {!hideSymbol && (
            <span className="select-none" aria-hidden="true">
              {symbol}
            </span>
          )}
          <span className="truncate">{children}</span>
        </code>

        {!hideCopyButton && (
          <button
            type="button"
            onClick={handleCopy}
            className={cn(
              "shrink-0 p-1 rounded-md transition-colors",
              "hover:bg-black/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2",
              "disabled:opacity-50 disabled:cursor-not-allowed"
            )}
            aria-label={copied ? "Copied" : "Copy to clipboard"}
          >
            {copied ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                className="w-4 h-4 text-success"
                aria-hidden="true"
              >
                <path
                  fillRule="evenodd"
                  d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z"
                  clipRule="evenodd"
                />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                className="w-4 h-4"
                aria-hidden="true"
              >
                <path d="M7 3.5A1.5 1.5 0 018.5 2h3.879a1.5 1.5 0 011.06.44l3.122 3.12A1.5 1.5 0 0117 6.622V12.5a1.5 1.5 0 01-1.5 1.5h-1v-3.379a3 3 0 00-.879-2.121L10.5 5.379A3 3 0 008.379 4.5H7v-1z" />
                <path d="M4.5 6A1.5 1.5 0 003 7.5v9A1.5 1.5 0 004.5 18h7a1.5 1.5 0 001.5-1.5v-5.879a1.5 1.5 0 00-.44-1.06L9.44 6.439A1.5 1.5 0 008.378 6H4.5z" />
              </svg>
            )}
          </button>
        )}
      </div>
    );
  }
);
Snippet.displayName = "Snippet";

export { Snippet };
export type { SnippetProps, SnippetColor };
