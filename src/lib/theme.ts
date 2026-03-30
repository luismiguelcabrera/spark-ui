import type { ThemeColors } from "./theme-tokens";

/** A named theme with color overrides */
export type Theme = {
  name: string;
  colors: Partial<ThemeColors>;
};

/** Map of theme names to their color definitions */
export type ThemeMap = Record<string, Partial<ThemeColors>>;

/** Default light theme colors (matches theme.css :root) */
const lightColors: Partial<ThemeColors> = {
  primary: "#4f46e5",
  "primary-dark": "#4338ca",
  secondary: "#1e293b",
  "secondary-light": "#334155",
  accent: "#f59e0b",
  mint: "#10b981",
  surface: "#ffffff",
  light: "#f8fafc",
  "background-subtle": "#f1f5f9",
  "background-dark": "#0f172a",
  "navy-text": "#1e293b",
  "text-secondary": "#64748b",
};

/** Default dark theme colors (matches theme.css .dark) */
const darkColors: Partial<ThemeColors> = {
  primary: "#818cf8",
  "primary-dark": "#6366f1",
  secondary: "#f1f5f9",
  "secondary-light": "#e2e8f0",
  accent: "#fbbf24",
  mint: "#34d399",
  surface: "#1e293b",
  light: "#0f172a",
  "background-subtle": "#0f172a",
  "background-dark": "#020617",
  "navy-text": "#f1f5f9",
  "text-secondary": "#94a3b8",
};

/** Default themes provided out of the box */
export const defaultThemes: ThemeMap = {
  light: lightColors,
  dark: darkColors,
};

/**
 * Create a named theme with partial color overrides.
 *
 * @param name - Unique theme identifier
 * @param colors - Partial color overrides
 * @returns A frozen Theme object
 */
export function createTheme(
  name: string,
  colors: Partial<ThemeColors>,
): Theme {
  return Object.freeze({ name, colors });
}
