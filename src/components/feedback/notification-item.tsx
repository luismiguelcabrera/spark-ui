import { forwardRef } from "react";
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

const NotificationItem = forwardRef<HTMLDivElement, NotificationItemProps>(
  (
    {
      icon = "notifications",
      title,
      description,
      timestamp,
      state = "unread",
      className,
    },
    ref,
  ) => {
    return (
      <div
        ref={ref}
        className={cn(notificationItemVariants({ state }), className)}
        role="article"
        aria-label={`${state === "unread" ? "Unread notification: " : ""}${title}`}
      >
        {state === "unread" && (
          <div className={s.notificationDot} aria-hidden="true" />
        )}
        <div
          className={cn(
            s.iconBox,
            "w-9 h-9 rounded-lg bg-muted shrink-0",
          )}
        >
          <Icon name={icon} size="sm" className="text-muted-foreground" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-secondary">{title}</p>
          {description && (
            <p className="text-xs text-muted-foreground mt-0.5">{description}</p>
          )}
        </div>
        <time className={s.notificationTime}>{timestamp}</time>
      </div>
    );
  },
);

NotificationItem.displayName = "NotificationItem";

export { NotificationItem, notificationItemVariants };
export type { NotificationItemProps };
