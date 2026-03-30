"use client";

import { createContext, useContext, type ReactNode, createElement } from "react";

export type Density = "default" | "comfortable" | "compact";

const DensityContext = createContext<Density>("default");

export type DensityProviderProps = {
  /** The density level to apply to child components */
  density: Density;
  children: ReactNode;
};

/**
 * Provides a density context to child components.
 *
 * Components can read the current density via `useDensity()` and
 * adjust their sizing/spacing accordingly.
 */
function DensityProvider({ density, children }: DensityProviderProps) {
  return createElement(DensityContext.Provider, { value: density }, children);
}
DensityProvider.displayName = "DensityProvider";

/**
 * Returns the current density from the nearest DensityProvider.
 * Defaults to "default" if no provider is found.
 */
function useDensity(): Density {
  return useContext(DensityContext);
}

export { DensityProvider, useDensity };
