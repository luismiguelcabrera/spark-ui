import { AppShellContent } from "./app-shell";
import { s } from "../../lib/styles";
import { cn } from "../../lib/utils";

function AdminPage({ children }: { children: React.ReactNode }) {
  return <AppShellContent className="px-0 py-4 md:px-10 md:py-8">{children}</AppShellContent>;
}

function Header({ title, subtitle, action }: { title: string; subtitle?: string; action?: React.ReactNode }) {
  return (
    <div className="flex items-start justify-between gap-4 mb-6 px-4 md:px-0">
      <div className="flex flex-col">
        <h2 className={cn(s.title, "text-2xl text-navy-text")}>{title}</h2>
        {subtitle && <p className={cn(s.statLabel, "mt-1")}>{subtitle}</p>}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}

AdminPage.Header = Header;

export { AdminPage };
