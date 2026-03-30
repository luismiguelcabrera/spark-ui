"use client";

import { cn } from "../../lib/utils";
import { s } from "../../lib/styles";
import { Icon } from "../data-display/icon";
import { useControllable } from "../../hooks/use-controllable";

type PaginationSize = "sm" | "md" | "lg";

const sizeStyles: Record<PaginationSize, string> = {
  sm: "px-2 py-1 text-xs min-w-[28px] h-7",
  md: "px-3 py-1.5 text-xs min-w-[32px] h-8",
  lg: "px-4 py-2 text-sm min-w-[40px] h-10",
};

const iconSizeMap: Record<PaginationSize, "xs" | "sm" | "md"> = {
  sm: "xs",
  md: "sm",
  lg: "md",
};

type PaginationProps = {
  current?: number;
  defaultCurrent?: number;
  onPageChange?: (page: number) => void;
  total: number;
  pageSize: number;
  variant?: "simple" | "numbered";
  /** Show first/last page buttons. */
  showFirstLast?: boolean;
  /** Use pill-shaped (fully rounded) buttons. */
  rounded?: boolean;
  /** Size of the pagination buttons. Defaults to "md". */
  size?: PaginationSize;
  /** Custom color for the active page button (Tailwind bg class e.g. "bg-blue-600"). */
  activeColor?: string;
  className?: string;
};

/**
 * Generate visible page numbers with ellipsis markers.
 */
function getPageRange(current: number, totalPages: number): (number | "ellipsis")[] {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  const pages: (number | "ellipsis")[] = [1];

  if (current > 3) {
    pages.push("ellipsis");
  }

  const start = Math.max(2, current - 1);
  const end = Math.min(totalPages - 1, current + 1);

  for (let i = start; i <= end; i++) {
    pages.push(i);
  }

  if (current < totalPages - 2) {
    pages.push("ellipsis");
  }

  pages.push(totalPages);

  return pages;
}

function Pagination({
  current,
  defaultCurrent,
  onPageChange,
  total,
  pageSize,
  variant = "simple",
  showFirstLast = false,
  rounded = false,
  size = "md",
  activeColor,
  className,
}: PaginationProps) {
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
  const borderRadius = rounded ? "rounded-full" : "rounded-lg";
  const iconSize = iconSizeMap[size];

  if (variant === "numbered") {
    const pages = getPageRange(page, totalPages);

    return (
      <div className={cn("flex items-center justify-between", className)}>
        <p className="text-xs text-slate-400 font-medium">
          Showing {start}-{end} of {total.toLocaleString()}
        </p>
        <div className="flex gap-1">
          {showFirstLast && (
            <button
              type="button"
              aria-label="First page"
              className={cn(
                sizeStyles[size],
                "flex items-center justify-center border border-slate-200 hover:bg-slate-50 disabled:opacity-50 transition-colors",
                borderRadius,
              )}
              disabled={isFirst}
              onClick={() => !isFirst && setPage(1)}
            >
              <Icon name="chevrons-left" size={iconSize} />
            </button>
          )}
          <button
            type="button"
            aria-label="Previous page"
            className={cn(
              sizeStyles[size],
              "flex items-center justify-center border border-slate-200 hover:bg-slate-50 disabled:opacity-50 transition-colors",
              borderRadius,
            )}
            disabled={isFirst}
            onClick={() => !isFirst && setPage(page - 1)}
          >
            <Icon name="chevron_left" size={iconSize} />
          </button>

          {pages.map((p, i) =>
            p === "ellipsis" ? (
              <span
                key={`ellipsis-${i}`}
                className={cn(sizeStyles[size], "flex items-center justify-center text-slate-400")}
                aria-hidden="true"
              >
                ...
              </span>
            ) : (
              <button
                key={p}
                type="button"
                aria-label={`Page ${p}`}
                aria-current={p === page ? "page" : undefined}
                className={cn(
                  sizeStyles[size],
                  "flex items-center justify-center font-medium border transition-colors",
                  borderRadius,
                  p === page
                    ? cn(
                        activeColor ?? "bg-primary",
                        "text-white border-transparent",
                      )
                    : "border-slate-200 text-slate-600 hover:bg-slate-50",
                )}
                onClick={() => setPage(p)}
              >
                {p}
              </button>
            ),
          )}

          <button
            type="button"
            aria-label="Next page"
            className={cn(
              sizeStyles[size],
              "flex items-center justify-center border border-slate-200 hover:bg-slate-50 disabled:opacity-50 transition-colors",
              borderRadius,
            )}
            disabled={isLast}
            onClick={() => !isLast && setPage(page + 1)}
          >
            <Icon name="chevron_right" size={iconSize} />
          </button>
          {showFirstLast && (
            <button
              type="button"
              aria-label="Last page"
              className={cn(
                sizeStyles[size],
                "flex items-center justify-center border border-slate-200 hover:bg-slate-50 disabled:opacity-50 transition-colors",
                borderRadius,
              )}
              disabled={isLast}
              onClick={() => !isLast && setPage(totalPages)}
            >
              <Icon name="chevrons-right" size={iconSize} />
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className={cn("px-1 flex items-center justify-between", className)}>
      <div className="text-xs text-slate-500">
        Showing{" "}
        <span className="font-bold text-slate-900">{start}-{end}</span> of{" "}
        <span className="font-bold text-slate-900">{total}</span>
      </div>
      <div className="flex gap-2">
        {showFirstLast && (
          <button
            className={cn(s.paginationButton, borderRadius)}
            disabled={isFirst}
            onClick={() => !isFirst && setPage(1)}
          >
            First
          </button>
        )}
        <button
          className={cn(s.paginationButton, borderRadius)}
          disabled={isFirst}
          onClick={() => !isFirst && setPage(page - 1)}
        >
          Previous
        </button>
        <button
          className={cn(s.paginationButton, borderRadius)}
          disabled={isLast}
          onClick={() => !isLast && setPage(page + 1)}
        >
          Next
        </button>
        {showFirstLast && (
          <button
            className={cn(s.paginationButton, borderRadius)}
            disabled={isLast}
            onClick={() => !isLast && setPage(totalPages)}
          >
            Last
          </button>
        )}
      </div>
    </div>
  );
}

export { Pagination };
export type { PaginationProps, PaginationSize };
