import { forwardRef } from "react";
import { s } from "../../lib/styles";
import { cn } from "../../lib/utils";

export type AdminPageHeaderProps = {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
  className?: string;
};

export const AdminPageHeader = forwardRef<HTMLDivElement, AdminPageHeaderProps>(
  ({ title, subtitle, action, className }, ref) => {
    return (
      <div ref={ref} className={cn("flex items-start justify-between gap-4 mb-6 px-4 md:px-0", className)}>
        <div className="flex flex-col">
          <h2 className={cn(s.title, "text-2xl text-navy-text")}>{title}</h2>
          {subtitle && <p className={cn(s.statLabel, "mt-1")}>{subtitle}</p>}
        </div>
        {action && <div className="shrink-0">{action}</div>}
      </div>
    );
  }
);
AdminPageHeader.displayName = "AdminPage.Header";
