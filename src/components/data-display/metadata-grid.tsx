import { forwardRef, type ReactNode, type HTMLAttributes } from "react";
import { cn } from "../../lib/utils";
import { s } from "../../lib/styles";
import { Icon } from "./icon";

type MetadataGridProps = HTMLAttributes<HTMLDListElement> & {
  columns?: 2 | 3 | 4;
};

const colsMap = {
  2: "grid-cols-2",
  3: "grid-cols-3",
  4: "grid-cols-4",
} as const;

const MetadataGrid = forwardRef<HTMLDListElement, MetadataGridProps>(
  ({ columns = 4, className, ...props }, ref) => {
    return (
      <dl ref={ref} className={cn("grid gap-4", colsMap[columns], className)} {...props} />
    );
  }
);
MetadataGrid.displayName = "MetadataGrid";

type MetadataItemProps = HTMLAttributes<HTMLDivElement> & {
  label: string;
  value: ReactNode;
  icon?: string;
};

const MetadataItem = forwardRef<HTMLDivElement, MetadataItemProps>(
  ({ label, value, icon, className, ...props }, ref) => {
    return (
      <div ref={ref} className={cn("flex items-start gap-2", className)} {...props}>
        {icon && (
          <Icon name={icon} size="sm" className="text-slate-400 mt-0.5" />
        )}
        <div>
          <dt className={s.textMuted}>{label}</dt>
          <dd className={cn(s.textPrimary, "mt-0.5 ml-0")}>{value}</dd>
        </div>
      </div>
    );
  }
);
MetadataItem.displayName = "MetadataItem";

export { MetadataGrid, MetadataItem };
export type { MetadataGridProps, MetadataItemProps };
