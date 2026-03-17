import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../../lib/utils";
import { s } from "../../lib/styles";
import { Icon } from "../data-display/icon";

const notificationItemVariants = cva(s.notificationBase, {
  variants: {
    state: {
      unread: s.notificationUnread,
      read: s.notificationRead,
    },
  },
  defaultVariants: {
    state: "unread",
  },
});

type NotificationItemProps = {
  icon?: string;
  title: string;
  description?: string;
  timestamp: string;
  className?: string;
} & VariantProps<typeof notificationItemVariants>;

function NotificationItem({
  icon = "notifications",
  title,
  description,
  timestamp,
  state = "unread",
  className,
}: NotificationItemProps) {
  return (
    <div className={cn(notificationItemVariants({ state, className }))}>
      {state === "unread" && <div className={s.notificationDot} />}
      <div className={cn(s.iconBox, "w-9 h-9 rounded-lg bg-slate-100 shrink-0")}>
        <Icon name={icon} size="sm" className="text-slate-500" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-secondary">{title}</p>
        {description && (
          <p className="text-xs text-slate-500 mt-0.5">{description}</p>
        )}
      </div>
      <span className={s.notificationTime}>{timestamp}</span>
    </div>
  );
}

export { NotificationItem, notificationItemVariants };
export type { NotificationItemProps };
