import { elevation, type ElevationLevel } from "../lib/elevation";

/**
 * Returns the Tailwind shadow class for a given elevation level.
 *
 * @param level - Elevation level from 0 (none) to 6 (2xl)
 * @returns The corresponding Tailwind shadow class string
 *
 * @example
 * ```tsx
 * const shadow = useElevation(3);
 * return <div className={shadow}>Elevated card</div>;
 * ```
 */
export function useElevation(level: ElevationLevel): string {
  return elevation[level];
}
