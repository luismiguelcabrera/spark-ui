"use client";

import { createContext, useContext } from "react";

export type DropdownContextValue = {
  close: () => void;
};

export const DropdownContext = createContext<DropdownContextValue | null>(null);

export function useDropdownContext() {
  return useContext(DropdownContext);
}
