import { forwardRef, type ReactNode, type HTMLAttributes } from "react";
import { cn } from "../../lib/utils";
import { s } from "../../lib/styles";
import { Icon } from "./icon";

type ListProps = {
  variant?: "plain" | "card" | "divided";
  ordered?: boolean;
  children: ReactNode;
  className?: string;
} & Omit<HTMLAttributes<HTMLUListElement | HTMLOListElement>, "children">;

const List = forwardRef<HTMLUListElement | HTMLOListElement, ListProps>(
  ({ variant = "plain", ordered = false, children, className, ...props }, ref) => {
    const Tag = ordered ? "ol" : "ul";
    return (
      <Tag
        ref={ref as React.Ref<HTMLUListElement> & React.Ref<HTMLOListElement>}
        role="list"
        className={cn(
          variant === "card" && s.cardBase,
          variant === "divided" && "divide-y divide-slate-100",
          className
        )}
        {...props}
      >
        {children}
      </Tag>
    );
  }
);
List.displayName = "List";

type ListItemProps = {
  icon?: string;
  iconBg?: string;
  iconColor?: string;
  title: string;
  description?: string;
  timestamp?: string;
  actions?: ReactNode;
  className?: string;
} & Omit<HTMLAttributes<HTMLLIElement>, "title">;

const ListItem = forwardRef<HTMLLIElement, ListItemProps>(
  (
    {
      icon,
      iconBg = "bg-slate-100",
      iconColor = "text-slate-600",
      title,
      description,
      timestamp,
      actions,
      className,
      ...props
    },
    ref
  ) => {
    return (
      <li ref={ref} className={cn("flex items-start gap-3 py-3 px-4", className)} {...props}>
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
            <span className="text-xs text-slate-600">{timestamp}</span>
          )}
          {actions}
        </div>
      </li>
    );
  }
);
ListItem.displayName = "ListItem";

export { List, ListItem };
export type { ListProps, ListItemProps };
