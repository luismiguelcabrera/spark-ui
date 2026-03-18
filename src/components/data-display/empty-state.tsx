import { forwardRef, type ReactNode, type HTMLAttributes } from "react";
import { cn } from "../../lib/utils";
import { s } from "../../lib/styles";
import { Icon } from "./icon";

type EmptyStateProps = HTMLAttributes<HTMLDivElement> & {
  icon?: string;
  title: string;
  description?: string;
  action?: ReactNode;
};

const EmptyState = forwardRef<HTMLDivElement, EmptyStateProps>(
  ({ icon = "inbox", title, description, action, className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        role="status"
        className={cn(s.emptyStateContainer, "py-12 gap-4", className)}
        {...props}
      >
        <div className={cn(s.emptyStateIcon, "w-16 h-16")} aria-hidden="true">
          <Icon name={icon} size="xl" />
        </div>
        <h3 className={s.emptyStateTitle}>{title}</h3>
        {description && (
          <p className={s.emptyStateDescription}>{description}</p>
        )}
        {action && <div className="mt-2">{action}</div>}
      </div>
    );
  }
);
EmptyState.displayName = "EmptyState";

export { EmptyState };
export type { EmptyStateProps };
