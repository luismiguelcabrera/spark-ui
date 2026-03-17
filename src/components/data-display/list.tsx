import { type ReactNode } from "react";
import { cn } from "../../lib/utils";
import { s } from "../../lib/styles";
import { Icon } from "./icon";

type ListProps = {
  variant?: "plain" | "card" | "divided";
  children: ReactNode;
  className?: string;
};

function List({ variant = "plain", children, className }: ListProps) {
  return (
    <div
      className={cn(
        variant === "card" && s.cardBase,
        variant === "divided" && "divide-y divide-slate-100",
        className
      )}
    >
      {children}
    </div>
  );
}

type ListItemProps = {
  icon?: string;
  iconBg?: string;
  iconColor?: string;
  title: string;
  description?: string;
  timestamp?: string;
  actions?: ReactNode;
  className?: string;
};

function ListItem({
  icon,
  iconBg = "bg-slate-100",
  iconColor = "text-slate-500",
  title,
  description,
  timestamp,
  actions,
  className,
}: ListItemProps) {
  return (
    <div className={cn("flex items-start gap-3 py-3 px-4", className)}>
      {icon && (
        <div
          className={cn(
            "w-9 h-9 rounded-lg flex items-center justify-center shrink-0",
            iconBg
          )}
        >
          <Icon name={icon} size="sm" className={iconColor} />
        </div>
      )}
      <div className="flex-1 min-w-0">
        <p className={s.textPrimary}>{title}</p>
        {description && (
          <p className={cn(s.textMuted, "mt-0.5")}>{description}</p>
        )}
      </div>
      <div className="flex items-center gap-2 shrink-0">
        {timestamp && (
          <span className="text-xs text-slate-400">{timestamp}</span>
        )}
        {actions}
      </div>
    </div>
  );
}

export { List, ListItem };
export type { ListProps, ListItemProps };
