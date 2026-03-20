"use client";

import { forwardRef, useState, type HTMLAttributes } from "react";
import { cn } from "../../lib/utils";
import { Icon } from "../data-display/icon";

type NavigationMenuItem = {
  /** Display label */
  label: string;
  /** Link href */
  href?: string;
  /** Description text (shown in mega-menu) */
  description?: string;
  /** Icon name */
  icon?: string;
  /** Whether this item is active */
  active?: boolean;
  /** Click handler */
  onClick?: () => void;
  /** Sub-items (creates a dropdown) */
  children?: NavigationMenuItem[];
  /** Featured/highlighted item */
  featured?: boolean;
};

type NavigationMenuProps = HTMLAttributes<HTMLElement> & {
  /** Menu items */
  items: NavigationMenuItem[];
  /** Orientation */
  orientation?: "horizontal" | "vertical";
};

const NavigationMenu = forwardRef<HTMLElement, NavigationMenuProps>(
  ({ className, items, orientation = "horizontal", ...props }, ref) => {
    const [openIndex, setOpenIndex] = useState<number | null>(null);

    return (
      <nav
        ref={ref}
        className={cn(
          "relative",
          orientation === "horizontal" ? "flex items-center gap-1" : "flex flex-col gap-1",
          className
        )}
        {...props}
      >
        {items.map((item, index) => {
          const hasChildren = item.children && item.children.length > 0;
          const isOpen = openIndex === index;

          return (
            <div
              key={item.label}
              className="relative"
              onMouseEnter={hasChildren ? () => setOpenIndex(index) : undefined}
              onMouseLeave={hasChildren ? () => setOpenIndex(null) : undefined}
            >
              {/* Trigger */}
              {hasChildren ? (
                <button
                  type="button"
                  className={cn(
                    "flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                    isOpen || item.active
                      ? "bg-muted text-navy-text"
                      : "text-muted-foreground hover:text-navy-text hover:bg-muted/50"
                  )}
                  aria-expanded={isOpen}
                  aria-haspopup="true"
                  onClick={() => setOpenIndex(isOpen ? null : index)}
                >
                  {item.icon && <Icon name={item.icon} size="sm" />}
                  {item.label}
                  <Icon
                    name="chevron-down"
                    size="sm"
                    className={cn("transition-transform text-muted-foreground", isOpen && "rotate-180")}
                  />
                </button>
              ) : (
                <a
                  href={item.href}
                  onClick={item.onClick}
                  className={cn(
                    "flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                    item.active
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:text-navy-text hover:bg-muted/50"
                  )}
                  aria-current={item.active ? "page" : undefined}
                >
                  {item.icon && <Icon name={item.icon} size="sm" />}
                  {item.label}
                </a>
              )}

              {/* Dropdown */}
              {hasChildren && isOpen && (
                <div
                  className={cn(
                    "absolute z-50 bg-surface border border-muted rounded-xl shadow-float p-2",
                    orientation === "horizontal" ? "top-full left-0 mt-1" : "left-full top-0 ml-1",
                    "min-w-[220px]"
                  )}
                >
                  {item.children!.map((child) => (
                    <a
                      key={child.label}
                      href={child.href}
                      onClick={(_e) => {
                        child.onClick?.();
                        setOpenIndex(null);
                      }}
                      className={cn(
                        "flex items-start gap-3 px-3 py-2.5 rounded-lg transition-colors",
                        "hover:bg-muted/50",
                        child.featured && "bg-primary/5 hover:bg-primary/10"
                      )}
                    >
                      {child.icon && (
                        <div className="mt-0.5 shrink-0">
                          <Icon name={child.icon} size="sm" className="text-muted-foreground" />
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <div className={cn("text-sm font-medium", child.active ? "text-primary" : "text-navy-text")}>
                          {child.label}
                        </div>
                        {child.description && (
                          <div className="text-xs text-muted-foreground mt-0.5 line-clamp-2">
                            {child.description}
                          </div>
                        )}
                      </div>
                    </a>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </nav>
    );
  }
);
NavigationMenu.displayName = "NavigationMenu";

export { NavigationMenu };
export type { NavigationMenuProps, NavigationMenuItem };
