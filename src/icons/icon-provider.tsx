"use client";

import { createContext, useContext, type ReactNode, type ComponentType } from "react";

export type IconComponentProps = {
  ref?: React.Ref<SVGSVGElement>;
  size?: number;
  className?: string;
};

export type IconResolver = (name: string) => ComponentType<IconComponentProps> | undefined;

const IconContext = createContext<IconResolver | null>(null);

export function useIconResolver(): IconResolver | null {
  return useContext(IconContext);
}

type IconProviderProps = {
  /** Maps icon names to React components. Return undefined to fall back to built-in. */
  resolver: IconResolver;
  children: ReactNode;
};

function IconProvider({ resolver, children }: IconProviderProps) {
  return (
    <IconContext.Provider value={resolver}>{children}</IconContext.Provider>
  );
}

export { IconProvider };
export type { IconProviderProps };
