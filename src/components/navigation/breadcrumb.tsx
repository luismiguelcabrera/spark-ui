"use client";

import { forwardRef, useState, type ReactNode } from "react";
import { cn } from "../../lib/utils";
import { Icon } from "../data-display/icon";

/* -------------------------------------------------------------------------- */
/*  Types                                                                      */
/* -------------------------------------------------------------------------- */

type BreadcrumbItem = {
  label: string;
  href?: string;
  /** Icon name (built-in icon system) shown before the label */
  icon?: string;
};

type BreadcrumbProps = {
  items: BreadcrumbItem[];
  /**
   * Custom separator between items.
   * - `string` → treated as an icon name
   * - `ReactNode` → rendered as-is
   * Defaults to `"chevron-right"` icon.
   */
  separator?: string | ReactNode;
  /**
   * Maximum number of visible items. When exceeded, middle items collapse
   * into an ellipsis button. Must be ≥ 2 (first + last).
   */
  maxItems?: number;
  className?: string;
};

/* -------------------------------------------------------------------------- */
/*  Separator helper                                                           */
/* -------------------------------------------------------------------------- */

function SeparatorEl({ separator }: { separator?: string | ReactNode }) {
  if (typeof separator === "string") {
    return (
      <Icon
        name={separator}
        size="xs"
        className="text-slate-300 shrink-0"
      />
    );
  }
  if (separator) {
    return <span className="text-slate-300 shrink-0">{separator}</span>;
  }
  return (
    <Icon
      name="chevron-right"
      size="xs"
      className="text-slate-300 shrink-0"
    />
  );
}

/* -------------------------------------------------------------------------- */
/*  Breadcrumb                                                                 */
/* -------------------------------------------------------------------------- */

const Breadcrumb = forwardRef<HTMLElement, BreadcrumbProps>(
  ({ items, separator, maxItems, className }, ref) => {
    const [expanded, setExpanded] = useState(false);

    // Determine which items to show
    const shouldCollapse =
      maxItems !== undefined && maxItems >= 2 && items.length > maxItems && !expanded;

    let visibleItems: BreadcrumbItem[];
    let collapsedCount: number;

    if (shouldCollapse) {
      // Show first item, ellipsis, then last (maxItems - 1) items
      const tailCount = maxItems - 1;
      visibleItems = [items[0], ...items.slice(-tailCount)];
      collapsedCount = items.length - maxItems;
    } else {
      visibleItems = items;
      collapsedCount = 0;
    }

    return (
      <nav
        ref={ref}
        aria-label="Breadcrumb"
        className={cn("flex items-center gap-2 text-sm", className)}
      >
        <ol className="flex items-center gap-2 list-none m-0 p-0">
          {visibleItems.map((item, i) => {
            const isLast = shouldCollapse
              ? i === visibleItems.length - 1
              : i === items.length - 1;

            // Insert ellipsis after first item when collapsed
            const showEllipsis = shouldCollapse && i === 1;

            return (
              <li key={i} className="flex items-center gap-2">
                {/* Separator before this item (not before first) */}
                {i > 0 && !showEllipsis && (
                  <SeparatorEl separator={separator} />
                )}

                {/* Ellipsis button */}
                {showEllipsis && (
                  <>
                    <SeparatorEl separator={separator} />
                    <button
                      type="button"
                      onClick={() => setExpanded(true)}
                      className="text-slate-400 hover:text-slate-600 transition-colors px-1 font-medium"
                      aria-label={`Show ${collapsedCount} more breadcrumb items`}
                    >
                      ...
                    </button>
                    <SeparatorEl separator={separator} />
                  </>
                )}

                {/* Breadcrumb link or current page */}
                {item.href && !isLast ? (
                  <a
                    href={item.href}
                    className="inline-flex items-center gap-1.5 text-slate-400 hover:text-primary transition-colors"
                  >
                    {item.icon && (
                      <Icon name={item.icon} size="xs" className="shrink-0" />
                    )}
                    {item.label}
                  </a>
                ) : (
                  <span
                    className="inline-flex items-center gap-1.5 text-slate-900 font-medium"
                    aria-current={isLast ? "page" : undefined}
                  >
                    {item.icon && (
                      <Icon name={item.icon} size="xs" className="shrink-0" />
                    )}
                    {item.label}
                  </span>
                )}
              </li>
            );
          })}
        </ol>
      </nav>
    );
  },
);
Breadcrumb.displayName = "Breadcrumb";

export { Breadcrumb };
export type { BreadcrumbProps, BreadcrumbItem };
