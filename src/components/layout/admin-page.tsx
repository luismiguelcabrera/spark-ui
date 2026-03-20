import { forwardRef } from "react";
import { AppShellContent } from "./app-shell";
import { cn } from "../../lib/utils";
import { AdminPageHeader } from "./admin-page-header";

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
  Header: typeof AdminPageHeader;
};
AdminPage.displayName = "AdminPage";

// ── Attach compound sub-component for dot-notation API ──
AdminPage.Header = AdminPageHeader;

export { AdminPage, AdminPageHeader };
