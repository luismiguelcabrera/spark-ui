"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useMemo,
  type ReactNode,
  type CSSProperties,
} from "react";
import {
  tokensToCssVars,
  type ThemeColors,
  type ThemeTokens,
} from "../../lib/theme-tokens";

type Theme = "light" | "dark" | "system";

type ThemeContextValue = {
  theme: Theme;
  resolvedTheme: "light" | "dark";
  setTheme: (theme: Theme) => void;
  colors: ThemeColors;
  setColors: (colors: ThemeColors) => void;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used within <ThemeProvider>");
  return ctx;
}

function getSystemTheme(): "light" | "dark" {
  if (typeof window === "undefined") return "light";
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

type ThemeProviderProps = {
  /** Initial color mode: "light", "dark", or "system" */
  defaultTheme?: Theme;
  /** localStorage key for persisting the theme choice */
  storageKey?: string;
  /** Override theme color tokens at runtime */
  colors?: ThemeColors;
  /** Override the base border-radius */
  radius?: string;
  children: ReactNode;
};

function ThemeProvider({
  defaultTheme = "system",
  storageKey = "spark-ui-theme",
  colors: colorsProp,
  radius,
  children,
}: ThemeProviderProps) {
  const [theme, setThemeState] = useState<Theme>(() => {
    if (typeof window === "undefined") return defaultTheme;
    return (localStorage.getItem(storageKey) as Theme) || defaultTheme;
  });

  const [systemTheme, setSystemTheme] = useState<"light" | "dark">(
    getSystemTheme,
  );
  const [runtimeColors, setRuntimeColors] = useState<{
    fromProp: ThemeColors | undefined;
    merged: ThemeColors;
  }>({ fromProp: colorsProp, merged: colorsProp ?? {} });

  // React-recommended pattern: sync prop into state during render
  if (runtimeColors.fromProp !== colorsProp) {
    setRuntimeColors({ fromProp: colorsProp, merged: colorsProp ?? {} });
  }

  const resolvedTheme = theme === "system" ? systemTheme : theme;

  const setTheme = useCallback(
    (newTheme: Theme) => {
      setThemeState(newTheme);
      if (typeof window !== "undefined") {
        localStorage.setItem(storageKey, newTheme);
      }
    },
    [storageKey],
  );

  const setColors = useCallback((newColors: ThemeColors) => {
    setRuntimeColors((prev) => ({
      ...prev,
      merged: { ...prev.merged, ...newColors },
    }));
  }, []);

  // Listen for system theme changes
  useEffect(() => {
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const handler = (e: MediaQueryListEvent) => {
      setSystemTheme(e.matches ? "dark" : "light");
    };
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  // Apply class to document
  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove("light", "dark");
    root.classList.add(resolvedTheme);
  }, [resolvedTheme]);

  // Build CSS variable style object
  const tokens: ThemeTokens = useMemo(
    () => ({ colors: runtimeColors.merged, radius }),
    [runtimeColors.merged, radius],
  );
  const cssVars = useMemo(() => tokensToCssVars(tokens), [tokens]);

  const contextValue = useMemo<ThemeContextValue>(
    () => ({
      theme,
      resolvedTheme,
      setTheme,
      colors: runtimeColors.merged,
      setColors,
    }),
    [theme, resolvedTheme, setTheme, runtimeColors, setColors],
  );

  const hasVars = Object.keys(cssVars).length > 0;

  return (
    <ThemeContext.Provider value={contextValue}>
      {hasVars ? (
        <div style={cssVars as CSSProperties}>{children}</div>
      ) : (
        children
      )}
    </ThemeContext.Provider>
  );
}

export { ThemeProvider, useTheme };
export type { Theme, ThemeProviderProps };
