"use client";

import { forwardRef, type HTMLAttributes } from "react";
import { cn } from "../../lib/utils";
import { Icon } from "../data-display/icon";
import { useClipboard } from "../../hooks/use-clipboard";

type CopyButtonProps = HTMLAttributes<HTMLButtonElement> & {
  /** Text to copy to clipboard */
  value: string;
  /** Duration for the "copied" state (ms) */
  timeout?: number;
  /** Size variant */
  size?: "sm" | "md" | "lg";
  /** Visual variant */
  variant?: "default" | "ghost" | "outline";
  /** Label text (shown next to icon) */
  label?: string;
  /** Callback after copy */
  onCopy?: (value: string) => void;
};

const sizeMap = {
  sm: "h-7 w-7 text-xs",
  md: "h-8 w-8 text-sm",
  lg: "h-10 w-10 text-base",
};

const sizeWithLabelMap = {
  sm: "h-7 px-2 text-xs",
  md: "h-8 px-3 text-sm",
  lg: "h-10 px-4 text-base",
};

const variantMap = {
  default: "bg-slate-100 hover:bg-slate-200 text-slate-600",
  ghost: "hover:bg-slate-100 text-slate-600",
  outline: "border border-slate-200 hover:bg-slate-50 text-slate-600",
};

const CopyButton = forwardRef<HTMLButtonElement, CopyButtonProps>(
  (
    {
      className,
      value,
      timeout = 2000,
      size = "md",
      variant = "ghost",
      label,
      onCopy,
      ...props
    },
    ref
  ) => {
    const { copied, copy } = useClipboard(timeout);

    const handleClick = async () => {
      await copy(value);
      onCopy?.(value);
    };

    return (
      <button
        ref={ref}
        type="button"
        onClick={handleClick}
        className={cn(
          "inline-flex items-center justify-center gap-1.5 rounded-lg transition-all",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary",
          variantMap[variant],
          label ? sizeWithLabelMap[size] : sizeMap[size],
          copied && "text-green-700",
          className
        )}
        aria-label={copied ? "Copied!" : "Copy to clipboard"}
        {...props}
      >
        <Icon name={copied ? "check" : "copy"} size="sm" />
        {label && <span className="font-medium">{copied ? "Copied!" : label}</span>}
      </button>
    );
  }
);
CopyButton.displayName = "CopyButton";

export { CopyButton };
export type { CopyButtonProps };
