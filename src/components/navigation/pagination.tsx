"use client";

import { cn } from "../../lib/utils";
import { s } from "../../lib/styles";
import { Icon } from "../data-display/icon";
import { useControllable } from "../../hooks/use-controllable";

type PaginationProps = {
  current?: number;
  defaultCurrent?: number;
  onPageChange?: (page: number) => void;
  total: number;
  pageSize: number;
  variant?: "simple" | "numbered";
  className?: string;
};

function Pagination({
  current,
  defaultCurrent,
  onPageChange,
  total,
  pageSize,
  variant = "simple",
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

  if (variant === "numbered") {
    return (
      <div className={cn("flex items-center justify-between", className)}>
        <p className="text-xs text-slate-400 font-medium">
          Showing {start}-{end} of {total.toLocaleString()}
        </p>
        <div className="flex gap-2">
          <button
            className="p-2 border border-slate-200 rounded-xl hover:bg-slate-50 disabled:opacity-50 transition-colors"
            disabled={isFirst}
            onClick={() => !isFirst && setPage(page - 1)}
          >
            <Icon name="chevron_left" size="sm" />
          </button>
          <button
            className="p-2 border border-slate-200 rounded-xl hover:bg-slate-50 disabled:opacity-50 transition-colors"
            disabled={isLast}
            onClick={() => !isLast && setPage(page + 1)}
          >
            <Icon name="chevron_right" size="sm" />
          </button>
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
        <button
          className={s.paginationButton}
          disabled={isFirst}
          onClick={() => !isFirst && setPage(page - 1)}
        >
          Previous
        </button>
        <button
          className={s.paginationButton}
          disabled={isLast}
          onClick={() => !isLast && setPage(page + 1)}
        >
          Next
        </button>
      </div>
    </div>
  );
}

export { Pagination };
export type { PaginationProps };
