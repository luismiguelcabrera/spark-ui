import { forwardRef, type ReactNode, type HTMLAttributes } from "react";
import { cn } from "../../lib/utils";
import { s } from "../../lib/styles";
import { Icon } from "./icon";

type ListProps = HTMLAttributes<HTMLUListElement> & {
  variant?: "plain" | "card" | "divided";
};

const List = forwardRef<HTMLUListElement, ListProps>(
  ({ variant = "plain", className, ...props }, ref) => {
    return (
      <ul
        ref={ref}
        role="list"
        className={cn(
          "list-none p-0 m-0",
          variant === "card" && s.cardBase,
          variant === "divided" && "divide-y divide-slate-100",
          className
        )}
        {...props}
      />
    );
  }
);
List.displayName = "List";

type ListItemProps = HTMLAttributes<HTMLLIElement> & {
  icon?: string;
  iconBg?: string;
  iconColor?: string;
  title: string;
  description?: string;
  timestamp?: string;
  actions?: ReactNode;
};

const ListItem = forwardRef<HTMLLIElement, ListItemProps>(
  (
    {
      icon,
      iconBg = "bg-slate-100",
      iconColor = "text-slate-500",
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
            aria-hidden="true"
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
      </li>
    );
  }
);
ListItem.displayName = "ListItem";

export { List, ListItem };
export type { ListProps, ListItemProps };
