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
};

function StatCard({
  icon,
  iconBg = "bg-slate-100",
  iconColor = "text-slate-600",
  label,
  value,
  change,
  changeColor = "text-green-600",
  className,
}: StatCardProps) {
  return (
    <div className={cn(s.cardSection, "p-5", className)}>
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

export { StatCard };
export type { StatCardProps };
