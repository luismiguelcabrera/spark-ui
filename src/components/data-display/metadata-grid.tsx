import { forwardRef, type ReactNode, type HTMLAttributes } from "react";
import { cn } from "../../lib/utils";
import { s } from "../../lib/styles";
import { Icon } from "./icon";

type MetadataGridProps = {
  columns?: 2 | 3 | 4;
  children: ReactNode;
  className?: string;
} & Omit<HTMLAttributes<HTMLDListElement>, "children">;

const colsMap = {
  2: "grid-cols-2",
  3: "grid-cols-3",
  4: "grid-cols-4",
} as const;

const MetadataGrid = forwardRef<HTMLDListElement, MetadataGridProps>(
  ({ columns = 4, children, className, ...props }, ref) => {
    return (
      <dl ref={ref} className={cn("grid gap-4", colsMap[columns], className)} {...props}>
        {children}
      </dl>
    );
  }
);
MetadataGrid.displayName = "MetadataGrid";

type MetadataItemProps = {
  label: string;
  value: ReactNode;
  icon?: string;
  className?: string;
} & Omit<HTMLAttributes<HTMLDivElement>, "children">;

const MetadataItem = forwardRef<HTMLDivElement, MetadataItemProps>(
  ({ label, value, icon, className, ...props }, ref) => {
    return (
      <div ref={ref} className={cn(className)} {...props}>
        <dt className={cn(s.textMuted, "flex items-center gap-2")}>
          {icon && (
            <Icon name={icon} size="sm" className="text-slate-600 shrink-0" aria-hidden="true" />
          )}
          {label}
        </dt>
        <dd className={cn(s.textPrimary, "mt-0.5")}>{value}</dd>
      </div>
    );
  }
);
MetadataItem.displayName = "MetadataItem";

export { MetadataGrid, MetadataItem };
export type { MetadataGridProps, MetadataItemProps };
