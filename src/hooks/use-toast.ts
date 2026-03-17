"use client";

import { useState, useCallback } from "react";

type ToastType = "default" | "success" | "error" | "warning" | "info";

type Toast = {
  id: string;
  message: string;
  description?: string;
  type: ToastType;
  duration: number;
  action?: { label: string; onClick: () => void };
};

type ToastOptions = {
  message: string;
  description?: string;
  type?: ToastType;
  duration?: number;
  action?: { label: string; onClick: () => void };
};

type UseToastReturn = {
  toasts: Toast[];
  toast: (options: ToastOptions) => string;
  success: (message: string, options?: Omit<ToastOptions, "message" | "type">) => string;
  error: (message: string, options?: Omit<ToastOptions, "message" | "type">) => string;
  warning: (message: string, options?: Omit<ToastOptions, "message" | "type">) => string;
  info: (message: string, options?: Omit<ToastOptions, "message" | "type">) => string;
  dismiss: (id: string) => void;
  dismissAll: () => void;
};

let toastCounter = 0;

/**
 * Programmatic toast manager hook.
 *
 * @param defaultDuration - Default auto-dismiss duration in ms (default: 5000)
 *
 * @example
 * const { toast, success, error, toasts, dismiss } = useToast();
 *
 * // Simple
 * toast({ message: "Saved!" });
 *
 * // With type helpers
 * success("File uploaded");
 * error("Upload failed", { description: "Please try again" });
 *
 * // Render toasts with Snackbar
 * {toasts.map(t => (
 *   <Snackbar key={t.id} open message={t.message} type={t.type} onClose={() => dismiss(t.id)} />
 * ))}
 */
export function useToast(defaultDuration = 5000): UseToastReturn {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = useCallback(
    (options: ToastOptions): string => {
      const id = `toast-${++toastCounter}`;
      const toast: Toast = {
        id,
        message: options.message,
        description: options.description,
        type: options.type ?? "default",
        duration: options.duration ?? defaultDuration,
        action: options.action,
      };

      setToasts((prev) => [...prev, toast]);

      if (toast.duration > 0) {
        setTimeout(() => {
          setToasts((prev) => prev.filter((t) => t.id !== id));
        }, toast.duration);
      }

      return id;
    },
    [defaultDuration]
  );

  const dismiss = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const dismissAll = useCallback(() => {
    setToasts([]);
  }, []);

  const success = useCallback(
    (message: string, options?: Omit<ToastOptions, "message" | "type">) =>
      addToast({ ...options, message, type: "success" }),
    [addToast]
  );

  const error = useCallback(
    (message: string, options?: Omit<ToastOptions, "message" | "type">) =>
      addToast({ ...options, message, type: "error" }),
    [addToast]
  );

  const warning = useCallback(
    (message: string, options?: Omit<ToastOptions, "message" | "type">) =>
      addToast({ ...options, message, type: "warning" }),
    [addToast]
  );

  const info = useCallback(
    (message: string, options?: Omit<ToastOptions, "message" | "type">) =>
      addToast({ ...options, message, type: "info" }),
    [addToast]
  );

  return { toasts, toast: addToast, success, error, warning, info, dismiss, dismissAll };
}
