"use client";

import { forwardRef, type HTMLAttributes } from "react";
import { cn } from "../../lib/utils";
import { Icon } from "../data-display/icon";

type BottomNavItem = {
  /** Label text */
  label: string;
  /** Icon name */
  icon: string;
  /** Whether this item is active */
  active?: boolean;
  /** Badge count */
  badge?: number;
  /** Click handler */
  onClick?: () => void;
  /** href for navigation */
  href?: string;
  /** Disabled state */
  disabled?: boolean;
};

type BottomNavProps = HTMLAttributes<HTMLElement> & {
  /** Navigation items (max 5 recommended) */
  items: BottomNavItem[];
  /** Visual variant */
  variant?: "default" | "floating" | "bordered";
  /** Show labels */
  showLabels?: boolean;
};

const variantMap = {
  default: "bg-surface border-t border-muted",
  floating: "bg-surface/90 backdrop-blur-lg mx-4 mb-4 rounded-2xl shadow-float border border-muted/50",
  bordered: "bg-surface border-t border-muted shadow-[0_-1px_3px_rgba(0,0,0,0.05)]",
};

const BottomNav = forwardRef<HTMLElement, BottomNavProps>(
  ({ className, items, variant = "default", showLabels = true, ...props }, ref) => (
    <nav
      ref={ref}
      className={cn(
        "fixed bottom-0 left-0 right-0 z-50 safe-area-bottom",
        variantMap[variant],
        className
      )}
      role="navigation"
      aria-label="Bottom navigation"
      {...props}
    >
      <div className="flex items-center justify-around h-16 px-2">
        {items.map((item) => {
          const Component = item.href ? "a" : "button";
          return (
            <Component
              key={item.label}
              {...(item.href ? { href: item.href } : { type: "button" as const })}
              onClick={item.onClick}
              disabled={!item.href ? item.disabled : undefined}
              className={cn(
                "relative flex flex-col items-center justify-center gap-0.5 flex-1 h-full transition-colors",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-inset rounded-lg",
                item.active
                  ? "text-primary"
                  : "text-muted-foreground hover:text-navy-text",
                item.disabled && "opacity-50 pointer-events-none"
              )}
              aria-current={item.active ? "page" : undefined}
              aria-label={!showLabels ? item.label : undefined}
            >
              <div className="relative">
                <Icon name={item.icon} size="md" />
                {item.badge !== undefined && item.badge > 0 && (
                  <span className="absolute -top-1 -right-1.5 min-w-[16px] h-4 px-1 flex items-center justify-center rounded-full bg-destructive text-white text-[10px] font-bold">
                    {item.badge > 99 ? "99+" : item.badge}
                  </span>
                )}
              </div>
              {showLabels && (
                <span className={cn("text-[10px] font-medium", item.active && "font-semibold")}>
                  {item.label}
                </span>
              )}
            </Component>
          );
        })}
      </div>
    </nav>
  )
);
BottomNav.displayName = "BottomNav";

export { BottomNav };
export type { BottomNavProps, BottomNavItem };
