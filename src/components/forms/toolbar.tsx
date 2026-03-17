import { forwardRef, type HTMLAttributes, type ReactNode } from "react";
import { cn } from "../../lib/utils";

type ToolbarProps = HTMLAttributes<HTMLDivElement> & {
  /** Orientation */
  orientation?: "horizontal" | "vertical";
};

const Toolbar = forwardRef<HTMLDivElement, ToolbarProps>(
  ({ className, orientation = "horizontal", ...props }, ref) => (
    <div
      ref={ref}
      role="toolbar"
      aria-orientation={orientation}
      className={cn(
        "flex items-center gap-1 p-1 bg-white border border-slate-200 rounded-lg",
        orientation === "vertical" && "flex-col",
        className
      )}
      {...props}
    />
  )
);
Toolbar.displayName = "Toolbar";

/* ── ToolbarButton ─────────────────────────────────────────────── */

type ToolbarButtonProps = HTMLAttributes<HTMLButtonElement> & {
  /** Whether this button is pressed/active */
  active?: boolean;
  /** Disabled state */
  disabled?: boolean;
  /** Tooltip text */
  tooltip?: string;
};

const ToolbarButton = forwardRef<HTMLButtonElement, ToolbarButtonProps>(
  ({ className, active, disabled, tooltip, children, ...props }, ref) => (
    <button
      ref={ref}
      type="button"
      disabled={disabled}
      aria-pressed={active}
      title={tooltip}
      className={cn(
        "inline-flex items-center justify-center w-8 h-8 rounded-md text-sm transition-colors",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary",
        "disabled:opacity-50 disabled:cursor-not-allowed",
        active
          ? "bg-slate-100 text-slate-900"
          : "text-slate-500 hover:text-slate-700 hover:bg-slate-50",
        className
      )}
      {...props}
    >
      {children}
    </button>
  )
);
ToolbarButton.displayName = "ToolbarButton";

/* ── ToolbarSeparator ──────────────────────────────────────────── */

type ToolbarSeparatorProps = HTMLAttributes<HTMLDivElement> & {
  /** Orientation of the separator */
  orientation?: "horizontal" | "vertical";
};

const ToolbarSeparator = forwardRef<HTMLDivElement, ToolbarSeparatorProps>(
  ({ className, orientation = "vertical", ...props }, ref) => (
    <div
      ref={ref}
      role="separator"
      className={cn(
        "bg-slate-200",
        orientation === "vertical" ? "w-px h-5 mx-0.5" : "h-px w-full my-0.5",
        className
      )}
      {...props}
    />
  )
);
ToolbarSeparator.displayName = "ToolbarSeparator";

/* ── ToolbarGroup ──────────────────────────────────────────────── */

type ToolbarGroupProps = HTMLAttributes<HTMLDivElement>;

const ToolbarGroup = forwardRef<HTMLDivElement, ToolbarGroupProps>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      role="group"
      className={cn("flex items-center gap-0.5", className)}
      {...props}
    />
  )
);
ToolbarGroup.displayName = "ToolbarGroup";

export { Toolbar, ToolbarButton, ToolbarSeparator, ToolbarGroup };
export type { ToolbarProps, ToolbarButtonProps, ToolbarSeparatorProps, ToolbarGroupProps };
