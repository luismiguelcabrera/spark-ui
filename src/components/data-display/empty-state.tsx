import { type ReactNode } from "react";
import { cn } from "../../lib/utils";
import { s } from "../../lib/styles";
import { Icon } from "./icon";

type EmptyStateProps = {
  icon?: string;
  title: string;
  description?: string;
  action?: ReactNode;
  className?: string;
};

function EmptyState({
  icon = "inbox",
  title,
  description,
  action,
  className,
}: EmptyStateProps) {
  return (
    <div className={cn(s.emptyStateContainer, "py-12 gap-4", className)}>
      <div className={cn(s.emptyStateIcon, "w-16 h-16")}>
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

export { EmptyState };
export type { EmptyStateProps };
