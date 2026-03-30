"use client";

import { useMemo } from "react";

type DateUtils = {
  format: (date: Date, pattern: string) => string;
  relative: (date: Date) => string;
  isToday: (date: Date) => boolean;
  isSameDay: (a: Date, b: Date) => boolean;
};

function pad(n: number): string {
  return n.toString().padStart(2, "0");
}

function formatDate(date: Date, pattern: string): string {
  const tokens: Record<string, string> = {
    YYYY: date.getFullYear().toString(),
    MM: pad(date.getMonth() + 1),
    DD: pad(date.getDate()),
    HH: pad(date.getHours()),
    mm: pad(date.getMinutes()),
    ss: pad(date.getSeconds()),
  };

  let result = pattern;
  // Replace longest tokens first to avoid partial matches
  for (const [token, value] of Object.entries(tokens)) {
    result = result.replace(token, value);
  }

  return result;
}

function relativeTime(date: Date): string {
  const now = Date.now();
  const diff = now - date.getTime();

  // Future dates
  if (diff < 0) return formatDate(date, "YYYY-MM-DD");

  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (seconds < 60) return "just now";
  if (minutes < 60) return `${minutes} min ago`;
  if (hours < 24) return `${hours} hour${hours === 1 ? "" : "s"} ago`;
  if (days === 1) return "yesterday";
  if (days < 30) return `${days} days ago`;

  return formatDate(date, "YYYY-MM-DD");
}

function checkIsToday(date: Date): boolean {
  const today = new Date();
  return (
    date.getFullYear() === today.getFullYear() &&
    date.getMonth() === today.getMonth() &&
    date.getDate() === today.getDate()
  );
}

function checkIsSameDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

/**
 * Simple date utility hook.
 *
 * Returns pure functions for formatting, relative time, and date comparison.
 * No external date library dependency.
 *
 * @example
 * const { format, relative, isToday, isSameDay } = useDate();
 * format(new Date(), "YYYY-MM-DD"); // "2024-01-15"
 * relative(someDate); // "5 min ago"
 */
export function useDate(): DateUtils {
  return useMemo(
    () => ({
      format: formatDate,
      relative: relativeTime,
      isToday: checkIsToday,
      isSameDay: checkIsSameDay,
    }),
    []
  );
}
