"use client";

import { createContext, useContext, type ReactNode, createElement } from "react";

type DefaultsMap = Record<string, Record<string, unknown>>;

const DefaultsContext = createContext<DefaultsMap>({});

export type DefaultsProviderProps = {
  /** Map of component names to default props */
  defaults: DefaultsMap;
  children: ReactNode;
};

/**
 * Create a frozen defaults configuration object.
 *
 * @param defaults - Map of component names to default props
 * @returns A frozen defaults object safe to pass to DefaultsProvider
 *
 * @example
 * ```tsx
 * const myDefaults = createDefaults({
 *   Button: { variant: "outline", size: "sm" },
 *   Input: { size: "lg" },
 * });
 * ```
 */
export function createDefaults(
  defaults: Record<string, Record<string, unknown>>,
): Readonly<Record<string, Record<string, unknown>>> {
  return Object.freeze(defaults);
}

/**
 * Context-based default prop injection for child components.
 *
 * Wrap a subtree with `<DefaultsProvider>` to set default props that
 * components can read via `useComponentDefaults("ComponentName", props)`.
 */
function DefaultsProvider({ defaults, children }: DefaultsProviderProps) {
  return createElement(DefaultsContext.Provider, { value: defaults }, children);
}
DefaultsProvider.displayName = "DefaultsProvider";

/**
 * Merge context defaults with component props. Props always win.
 *
 * @param componentName - Must match the key used in the `defaults` map
 * @param props - The component's actual props
 * @returns Merged props where explicit props override defaults
 *
 * @example
 * ```tsx
 * function Button(rawProps: ButtonProps) {
 *   const props = useComponentDefaults("Button", rawProps);
 *   // props.variant will be the default if not explicitly passed
 * }
 * ```
 */
function useComponentDefaults<T extends Record<string, unknown>>(
  componentName: string,
  props: T,
): T {
  const ctx = useContext(DefaultsContext);
  const defaults = ctx[componentName];
  if (!defaults) return props;

  // Merge: defaults first, then explicit props win
  const merged = { ...defaults } as Record<string, unknown>;
  for (const key of Object.keys(props)) {
    if (props[key] !== undefined) {
      merged[key] = props[key];
    }
  }
  return merged as T;
}

export { DefaultsProvider, useComponentDefaults };
export type { DefaultsMap };
