import { forwardRef, type HTMLAttributes } from "react";
import { cn } from "../../lib/utils";
import { s } from "../../lib/styles";
import { Icon } from "./icon";

type StatCardProps = {
  icon: string;
  iconBg?: string;
  iconColor?: string;
  label: string;
  value: string | number;
  change?: string;
  changeColor?: string;
  className?: string;
} & Omit<HTMLAttributes<HTMLDivElement>, "children">;

const StatCard = forwardRef<HTMLDivElement, StatCardProps>(
  (
    {
      icon,
      iconBg = "bg-muted",
      iconColor = "text-muted-foreground",
      label,
      value,
      change,
      changeColor = "text-success",
      className,
      ...props
    },
    ref
  ) => {
    return (
      <div ref={ref} className={cn(s.cardSection, "p-5", className)} {...props}>
        <div className="mb-4 flex items-center justify-between relative">
          <span
            className={cn(s.iconBox, "h-10 w-10", iconBg, iconColor)}
          >
            <Icon name={icon} size="md" />
          </span>
          {change && (
            <span
              className={cn(
                "flex items-center text-xs font-semibold px-2 py-1 rounded-lg",
                changeColor
              )}
            >
              {change}
            </span>
          )}
        </div>
        <p className={s.statLabel}>{label}</p>
        <p className={cn(s.statValue, "mt-1")}>{value}</p>
      </div>
    );
  }
);
StatCard.displayName = "StatCard";

export { StatCard };
export type { StatCardProps };
