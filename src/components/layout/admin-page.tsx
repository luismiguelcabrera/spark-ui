import { forwardRef } from "react";
import { AppShellContent } from "./app-shell";
import { s } from "../../lib/styles";
import { cn } from "../../lib/utils";

type HeaderProps = {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
  className?: string;
};

const Header = forwardRef<HTMLDivElement, HeaderProps>(
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
Header.displayName = "AdminPage.Header";

type AdminPageProps = {
  children: React.ReactNode;
  className?: string;
};

const AdminPage = forwardRef<HTMLElement, AdminPageProps>(
  ({ children, className }, ref) => {
    return (
      <AppShellContent ref={ref} className={cn("px-0 py-4 md:px-10 md:py-8", className)}>
        {children}
      </AppShellContent>
    );
  }
) as React.ForwardRefExoticComponent<
  AdminPageProps & React.RefAttributes<HTMLElement>
> & {
  Header: typeof Header;
};
AdminPage.displayName = "AdminPage";

AdminPage.Header = Header;

export { AdminPage };
