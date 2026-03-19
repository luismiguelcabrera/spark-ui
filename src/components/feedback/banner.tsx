"use client";

import { forwardRef, type ReactNode } from "react";
import { cn } from "../../lib/utils";
import { Icon } from "../data-display/icon";

/* -------------------------------------------------------------------------- */
/*  Types                                                                      */
/* -------------------------------------------------------------------------- */

type BannerColor = "info" | "warning" | "danger" | "success";

type BannerProps = {
  /** Icon name (resolved through Icon component's 3-tier system) */
  icon?: string;
  /** Banner message text */
  text: string;
  /** Action buttons or links rendered at the end */
  actions?: ReactNode;
  /** Whether the banner sticks to the top of the viewport */
  sticky?: boolean;
  /** Color / severity of the banner */
  color?: BannerColor;
  /** Show a dismiss/close button */
  dismissible?: boolean;
  /** Called when the dismiss button is clicked */
  onDismiss?: () => void;
  /** Additional class names */
  className?: string;
};

/* -------------------------------------------------------------------------- */
/*  Style maps                                                                 */
/* -------------------------------------------------------------------------- */

const colorStyles: Record<BannerColor, string> = {
  info: "bg-blue-600 text-white",
  warning: "bg-amber-500 text-amber-950",
  danger: "bg-red-600 text-white",
  success: "bg-green-700 text-white",
};

const defaultIcons: Record<BannerColor, string> = {
  info: "info",
  warning: "alert-triangle",
  danger: "alert-circle",
  success: "check-circle",
};

const dismissColors: Record<BannerColor, string> = {
  info: "hover:bg-white/20",
  warning: "hover:bg-amber-700/20",
  danger: "hover:bg-white/20",
  success: "hover:bg-white/20",
};

/* -------------------------------------------------------------------------- */
/*  Banner component                                                           */
/* -------------------------------------------------------------------------- */

const Banner = forwardRef<HTMLDivElement, BannerProps>(
  (
    {
      icon,
      text,
      actions,
      sticky = false,
      color = "info",
      dismissible = false,
      onDismiss,
      className,
    },
    ref,
  ) => {
    const displayIcon = icon ?? defaultIcons[color];

    return (
      <div
        ref={ref}
        role="status"
        className={cn(
          "flex items-center gap-3 px-4 py-3 w-full text-sm font-medium",
          colorStyles[color],
          sticky && "sticky top-0 z-40",
          className,
        )}
      >
        {displayIcon && (
          <Icon name={displayIcon} size="md" className="shrink-0" />
        )}
        <p className="flex-1 min-w-0">{text}</p>
        {actions && (
          <div className="shrink-0 flex items-center gap-2">{actions}</div>
        )}
        {dismissible && (
          <button
            type="button"
            aria-label="Dismiss banner"
            onClick={onDismiss}
            className={cn(
              "shrink-0 p-1 rounded-md transition-colors",
              dismissColors[color],
              "focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-white/50",
            )}
          >
            <Icon name="close" size="sm" />
          </button>
        )}
      </div>
    );
  },
);
Banner.displayName = "Banner";

/* -------------------------------------------------------------------------- */
/*  Exports                                                                    */
/* -------------------------------------------------------------------------- */

export { Banner };
export type { BannerProps, BannerColor };
