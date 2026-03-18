"use client";

/**
 * Re-exports from sidebar.tsx for backward compatibility.
 * The canonical SidebarProvider and useSidebar now live in sidebar.tsx.
 */
export { SidebarProvider, useSidebar } from "./sidebar";
export type { SidebarProviderProps, SidebarContextValue } from "./sidebar";
