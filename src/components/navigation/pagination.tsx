"use client";

import { forwardRef } from "react";
import { cn } from "../../lib/utils";
import { s } from "../../lib/styles";
import { Icon } from "../data-display/icon";
import { useControllable } from "../../hooks/use-controllable";
import { useLocale } from "../../lib/locale";

type PaginationProps = {
  current?: number;
  defaultCurrent?: number;
  onPageChange?: (page: number) => void;
  total: number;
  pageSize: number;
  variant?: "simple" | "numbered";
  className?: string;
  /** Accessible label for the navigation landmark */
  "aria-label"?: string;
};

const Pagination = forwardRef<HTMLElement, PaginationProps>(
  (
    {
      current,
      defaultCurrent,
      onPageChange,
      total,
      pageSize,
      variant = "simple",
      className,
      "aria-label": ariaLabel,
    },
    ref,
  ) => {
    const { t } = useLocale();

    const [page, setPage] = useControllable({
      value: current,
      defaultValue: defaultCurrent ?? current ?? 1,
      onChange: onPageChange,
    });

    const start = (page - 1) * pageSize + 1;
    const end = Math.min(page * pageSize, total);
    const totalPages = Math.ceil(total / pageSize);
    const isFirst = page <= 1;
    const isLast = page >= totalPages;

    if (variant === "numbered") {
      return (
        <nav
          ref={ref}
          aria-label={ariaLabel ?? "Pagination"}
          className={cn("flex items-center justify-between", className)}
        >
          <p className="text-xs text-muted-foreground font-medium">
            {t("pagination.showing", "Showing")} {start}-{end} of {total.toLocaleString()}
          </p>
          <div className="flex gap-2">
            <button
              type="button"
              className="p-2 border border-muted rounded-xl hover:bg-muted/50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:outline-none"
              disabled={isFirst}
              aria-label={t("pagination.previousPage", "Previous page")}
              onClick={() => !isFirst && setPage(page - 1)}
            >
              <Icon name="chevron_left" size="sm" />
            </button>
            <button
              type="button"
              className="p-2 border border-muted rounded-xl hover:bg-muted/50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:outline-none"
              disabled={isLast}
              aria-label={t("pagination.nextPage", "Next page")}
              onClick={() => !isLast && setPage(page + 1)}
            >
              <Icon name="chevron_right" size="sm" />
            </button>
          </div>
        </nav>
      );
    }

    return (
      <nav
        ref={ref}
        aria-label="Pagination"
        className={cn("px-1 flex items-center justify-between", className)}
      >
        <div className="text-xs text-muted-foreground">
          {t("pagination.showing", "Showing")}{" "}
          <span className="font-bold text-navy-text">
            {start}-{end}
          </span>{" "}
          of <span className="font-bold text-navy-text">{total}</span>
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            className={cn(
              s.paginationButton,
              "focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:outline-none",
            )}
            disabled={isFirst}
            aria-label={t("pagination.previousPage", "Previous page")}
            onClick={() => !isFirst && setPage(page - 1)}
          >
            {t("pagination.previous", "Previous")}
          </button>
          <button
            type="button"
            className={cn(
              s.paginationButton,
              "focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:outline-none",
            )}
            disabled={isLast}
            aria-label={t("pagination.nextPage", "Next page")}
            onClick={() => !isLast && setPage(page + 1)}
          >
            {t("pagination.next", "Next")}
          </button>
        </div>
      </nav>
    );
  },
);

Pagination.displayName = "Pagination";

export { Pagination };
export type { PaginationProps };
