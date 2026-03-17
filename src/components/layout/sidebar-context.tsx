"use client";

import { createContext, useContext, useState, type ReactNode } from "react";

type SidebarContextType = {
  isOpen: boolean;
  open: () => void;
  close: () => void;
  isCollapsed: boolean;
  toggleCollapse: () => void;
};

const SidebarContext = createContext<SidebarContextType | null>(null);

const COOKIE_NAME = "sidebar:collapsed";

function SidebarProvider({
  children,
  defaultCollapsed = false,
}: {
  children: ReactNode;
  defaultCollapsed?: boolean;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(defaultCollapsed);

  const toggleCollapse = () =>
    setIsCollapsed((v) => {
      const next = !v;
      document.cookie = `${COOKIE_NAME}=${next}; path=/; max-age=31536000`;
      return next;
    });

  return (
    <SidebarContext.Provider
      value={{
        isOpen,
        open: () => setIsOpen(true),
        close: () => setIsOpen(false),
        isCollapsed,
        toggleCollapse,
      }}
    >
      {children}
    </SidebarContext.Provider>
  );
}

function useSidebar() {
  const ctx = useContext(SidebarContext);
  if (!ctx) throw new Error("useSidebar must be used within SidebarProvider");
  return ctx;
}

export { SidebarProvider, useSidebar };
