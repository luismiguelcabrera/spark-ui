import { createContext, useContext, type ReactNode } from "react";

type DefaultsMap = Record<string, Record<string, unknown>>;

const DefaultsContext = createContext<DefaultsMap>({});

type DefaultsProviderProps = {
  /** Map of component names to default props. Example: { Button: { variant: "outline", size: "sm" } } */
  defaults: DefaultsMap;
  children: ReactNode;
};

/**
 * Context-based default prop injection for child components.
 *
 * Wrap a subtree with `<DefaultsProvider>` to set default props that
 * components can read via `useDefaults("ComponentName")`.
 */
function DefaultsProvider({ defaults, children }: DefaultsProviderProps) {
  return (
    <DefaultsContext.Provider value={defaults}>
      {children}
    </DefaultsContext.Provider>
  );
}
DefaultsProvider.displayName = "DefaultsProvider";

/**
 * Read default props for a component from the nearest `<DefaultsProvider>`.
 *
 * @param componentName — must match the key used in the `defaults` map.
 * @returns A record of default props (empty object if none provided).
 *
 * @example
 * ```tsx
 * const defaults = useDefaults("Button");
 * // defaults = { variant: "outline", size: "sm" }
 * ```
 */
function useDefaults<T extends Record<string, unknown> = Record<string, unknown>>(
  componentName: string
): Partial<T> {
  const ctx = useContext(DefaultsContext);
  return (ctx[componentName] ?? {}) as Partial<T>;
}

export { DefaultsProvider, useDefaults };
export type { DefaultsProviderProps, DefaultsMap };
