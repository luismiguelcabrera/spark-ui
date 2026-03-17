import { type ReactNode } from "react";
import { cn } from "../../lib/utils";
import { s } from "../../lib/styles";
import { Icon } from "./icon";

type MetadataGridProps = {
  columns?: 2 | 3 | 4;
  children: ReactNode;
  className?: string;
};

const colsMap = {
  2: "grid-cols-2",
  3: "grid-cols-3",
  4: "grid-cols-4",
} as const;

function MetadataGrid({ columns = 4, children, className }: MetadataGridProps) {
  return (
    <div className={cn("grid gap-4", colsMap[columns], className)}>
      {children}
    </div>
  );
}

type MetadataItemProps = {
  label: string;
  value: ReactNode;
  icon?: string;
  className?: string;
};

function MetadataItem({ label, value, icon, className }: MetadataItemProps) {
  return (
    <div className={cn("flex items-start gap-2", className)}>
      {icon && (
        <Icon name={icon} size="sm" className="text-slate-400 mt-0.5" />
      )}
      <div>
        <p className={s.textMuted}>{label}</p>
        <p className={cn(s.textPrimary, "mt-0.5")}>{value}</p>
      </div>
    </div>
  );
}

export { MetadataGrid, MetadataItem };
export type { MetadataGridProps, MetadataItemProps };
