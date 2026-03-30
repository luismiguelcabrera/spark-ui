export const elevation = {
  0: "shadow-none",
  1: "shadow-sm",
  2: "shadow",
  3: "shadow-md",
  4: "shadow-lg",
  5: "shadow-xl",
  6: "shadow-2xl",
} as const;

export type ElevationLevel = keyof typeof elevation;

/** Get Tailwind shadow class for a given elevation level */
export function getElevation(level: ElevationLevel): string {
  return elevation[level];
}
