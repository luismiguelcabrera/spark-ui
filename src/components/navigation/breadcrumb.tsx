import { forwardRef } from "react";
import { cn } from "../../lib/utils";
import { s } from "../../lib/styles";
import { Icon } from "../data-display/icon";

type BreadcrumbItem = {
  label: string;
  href?: string;
};

type BreadcrumbProps = {
  items: BreadcrumbItem[];
  className?: string;
  /** Accessible label for the nav landmark */
  "aria-label"?: string;
};

const Breadcrumb = forwardRef<HTMLElement, BreadcrumbProps>(
  ({ items, className, "aria-label": ariaLabel = "Breadcrumb" }, ref) => {
    return (
      <nav
        ref={ref}
        aria-label={ariaLabel}
        className={cn("flex items-center text-sm", className)}
      >
        <ol className="flex items-center gap-2">
          {items.map((item, i) => {
            const isLast = i === items.length - 1;

            return (
              <li key={i} className="flex items-center gap-2">
                {i > 0 && (
                  <Icon
                    name="chevron_right"
                    size="sm"
                    className={cn(s.textSubtle)}
                  />
                )}
                {item.href && !isLast ? (
                  <a
                    href={item.href}
                    className={cn(
                      s.textMuted,
                      "text-sm hover:text-primary transition-colors",
                    )}
                  >
                    {item.label}
                  </a>
                ) : (
                  <span
                    className="text-gray-900 font-medium"
                    aria-current={isLast ? "page" : undefined}
                  >
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
