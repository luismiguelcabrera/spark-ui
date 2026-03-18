"use client";

import { forwardRef, type ReactNode } from "react";
import { cn } from "../../lib/utils";
import { s } from "../../lib/styles";
import { SidebarProvider } from "./sidebar-context";

type AppShellProps = {
  sidebar?: ReactNode;
  children: ReactNode;
  className?: string;
  defaultCollapsed?: boolean;
};

const AppShell = forwardRef<HTMLDivElement, AppShellProps>(
  ({ sidebar, children, className, defaultCollapsed }, ref) => {
    return (
      <SidebarProvider defaultCollapsed={defaultCollapsed}>
        <div ref={ref} className={cn(s.shell, className)}>
          {sidebar}
          <div className={s.shellPanel}>{children}</div>
        </div>
      </SidebarProvider>
    );
  }
);
AppShell.displayName = "AppShell";

type AppShellHeaderProps = {
  children: ReactNode;
  className?: string;
};

const AppShellHeader = forwardRef<HTMLElement, AppShellHeaderProps>(
  ({ children, className }, ref) => {
    return (
      <header ref={ref} className={cn(s.shellHeader, className)}>
        {children}
      </header>
    );
  }
);
AppShellHeader.displayName = "AppShellHeader";

type AppShellContentProps = {
  children: ReactNode;
  className?: string;
};

const AppShellContent = forwardRef<HTMLElement, AppShellContentProps>(
  ({ children, className }, ref) => {
    return (
      <main ref={ref} className={cn(s.shellContent, "@container", className)}>
        {children}
      </main>
    );
  }
);
AppShellContent.displayName = "AppShellContent";

export { AppShell, AppShellHeader, AppShellContent };
export type { AppShellProps, AppShellHeaderProps, AppShellContentProps };
