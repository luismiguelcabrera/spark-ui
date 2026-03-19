import { forwardRef, type HTMLAttributes, type ThHTMLAttributes, type TdHTMLAttributes } from "react";
import { cn } from "../../lib/utils";

/* ── Table Root ─────────────────────────────────────────────────── */

type TableProps = HTMLAttributes<HTMLTableElement> & {
  /** When true, rows stack into label:value cards below the container breakpoint (480px).
   *  Requires TableCell `data-label` attributes for labels. */
  responsive?: boolean;
};

const Table = forwardRef<HTMLTableElement, TableProps>(
  ({ className, responsive, ...props }, ref) => (
    <div
      className={cn(
        "relative w-full overflow-auto",
        responsive && "@container spark-table-responsive",
      )}
    >
      <table
        ref={ref}
        className={cn("w-full caption-bottom text-sm", className)}
        {...props}
      />
    </div>
  )
);
Table.displayName = "Table";

/* ── TableHeader ──────────────────────────────────────────────── */

type TableHeaderProps = HTMLAttributes<HTMLTableSectionElement>;

const TableHeader = forwardRef<HTMLTableSectionElement, TableHeaderProps>(
  ({ className, ...props }, ref) => (
    <thead
      ref={ref}
      className={cn("[&_tr]:border-b border-slate-100", className)}
      {...props}
    />
  )
);
TableHeader.displayName = "TableHeader";

/* ── TableBody ────────────────────────────────────────────────── */

type TableBodyProps = HTMLAttributes<HTMLTableSectionElement>;

const TableBody = forwardRef<HTMLTableSectionElement, TableBodyProps>(
  ({ className, ...props }, ref) => (
    <tbody
      ref={ref}
      className={cn("[&_tr:last-child]:border-0", className)}
      {...props}
    />
  )
);
TableBody.displayName = "TableBody";

/* ── TableFooter ──────────────────────────────────────────────── */

type TableFooterProps = HTMLAttributes<HTMLTableSectionElement>;

const TableFooter = forwardRef<HTMLTableSectionElement, TableFooterProps>(
  ({ className, ...props }, ref) => (
    <tfoot
      ref={ref}
      className={cn(
        "border-t border-slate-100 bg-slate-50/50 font-medium [&>tr]:last:border-b-0",
        className
      )}
      {...props}
    />
  )
);
TableFooter.displayName = "TableFooter";

/* ── TableRow ─────────────────────────────────────────────────── */

type TableRowProps = HTMLAttributes<HTMLTableRowElement>;

const TableRow = forwardRef<HTMLTableRowElement, TableRowProps>(
  ({ className, ...props }, ref) => (
    <tr
      ref={ref}
      className={cn(
        "border-b border-slate-100 transition-colors hover:bg-slate-50/80 data-[state=selected]:bg-primary/5",
        className
      )}
      {...props}
    />
  )
);
TableRow.displayName = "TableRow";

/* ── TableHead ────────────────────────────────────────────────── */

type TableHeadProps = ThHTMLAttributes<HTMLTableCellElement>;

const TableHead = forwardRef<HTMLTableCellElement, TableHeadProps>(
  ({ className, ...props }, ref) => (
    <th
      ref={ref}
      className={cn(
        "h-10 px-4 text-left align-middle font-semibold text-slate-600",
        "text-[11px] uppercase tracking-wider",
        "[&:has([role=checkbox])]:pr-0",
        className
      )}
      {...props}
    />
  )
);
TableHead.displayName = "TableHead";

/* ── TableCell ────────────────────────────────────────────────── */

type TableCellProps = TdHTMLAttributes<HTMLTableCellElement>;

const TableCell = forwardRef<HTMLTableCellElement, TableCellProps>(
  ({ className, ...props }, ref) => (
    <td
      ref={ref}
      className={cn(
        "px-4 py-3 align-middle text-sm text-slate-700",
        "[&:has([role=checkbox])]:pr-0",
        className
      )}
      {...props}
    />
  )
);
TableCell.displayName = "TableCell";

/* ── TableCaption ─────────────────────────────────────────────── */

type TableCaptionProps = HTMLAttributes<HTMLTableCaptionElement>;

const TableCaption = forwardRef<HTMLTableCaptionElement, TableCaptionProps>(
  ({ className, ...props }, ref) => (
    <caption
      ref={ref}
      className={cn("mt-4 text-sm text-slate-600", className)}
      {...props}
    />
  )
);
TableCaption.displayName = "TableCaption";

export {
  Table,
  TableHeader,
  TableBody,
  TableFooter,
  TableRow,
  TableHead,
  TableCell,
  TableCaption,
};
export type {
  TableProps,
  TableHeaderProps,
  TableBodyProps,
  TableFooterProps,
  TableRowProps,
  TableHeadProps,
  TableCellProps,
  TableCaptionProps,
};
