"use client";

import { type ReactNode } from "react";
import { cn } from "../../lib/utils";
import { s } from "../../lib/styles";
import { SidebarProvider } from "./sidebar-context";

type AppShellProps = {
  sidebar?: ReactNode;
  children: ReactNode;
  className?: string;
  defaultCollapsed?: boolean;
};

function AppShell({ sidebar, children, className, defaultCollapsed }: AppShellProps) {
  return (
    <SidebarProvider defaultCollapsed={defaultCollapsed}>
      <div className={cn(s.shell, className)}>
        {sidebar}
        <div className={s.shellPanel}>{children}</div>
      </div>
    </SidebarProvider>
  );
}

type AppShellHeaderProps = {
  children: ReactNode;
  className?: string;
};

function AppShellHeader({ children, className }: AppShellHeaderProps) {
  return (
    <header className={cn(s.shellHeader, className)}>
      {children}
    </header>
  );
}

type AppShellContentProps = {
  children: ReactNode;
  className?: string;
};

function AppShellContent({ children, className }: AppShellContentProps) {
  return (
    <main className={cn(s.shellContent, "@container", className)}>
      {children}
    </main>
  );
}

export { AppShell, AppShellHeader, AppShellContent };
export type { AppShellProps, AppShellHeaderProps, AppShellContentProps };
