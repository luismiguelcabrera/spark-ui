/**
 * All customizable theme tokens mapped to their CSS variable names.
 *
 * Consumers can override these via:
 *   1. CSS:  :root { --color-primary: #e11d48; }
 *   2. JS:   <ThemeProvider colors={{ primary: "#e11d48" }}>
 */

export type ThemeColors = {
  primary?: string;
  "primary-dark"?: string;
  secondary?: string;
  "secondary-light"?: string;
  accent?: string;
  mint?: string;
  surface?: string;
  light?: string;
  "background-subtle"?: string;
  "background-dark"?: string;
  "navy-text"?: string;
  "text-secondary"?: string;
};

export type ThemeTokens = {
  colors?: ThemeColors;
  radius?: string;
};

/** Convert a ThemeTokens object into CSS variable declarations. */
export function tokensToCssVars(tokens: ThemeTokens): Record<string, string> {
  const vars: Record<string, string> = {};

  if (tokens.colors) {
    for (const [key, value] of Object.entries(tokens.colors)) {
      if (value) {
        vars[`--color-${key}`] = value;
      }
    }
  }

  if (tokens.radius) {
    vars["--radius-base"] = tokens.radius;
  }

  return vars;
}
