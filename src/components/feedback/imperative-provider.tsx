"use client";

import {
  useState,
  useEffect,
  useCallback,
  useRef,
  type ReactNode,
} from "react";
import { cn } from "../../lib/utils";
import { s } from "../../lib/styles";
import { Icon } from "../data-display/icon";
import {
  __setImperativeFeedbackStore,
  type ToastEntry,
  type ModalEntry,
  type ModalConfirmOptions,
  type ModalInfoOptions,
  type NotificationEntry,
  type ImperativeFeedbackStore,
} from "../../hooks/use-imperative-feedback";

// ---------------------------------------------------------------------------
// Toast variant styling
// ---------------------------------------------------------------------------

const toastVariantStyles: Record<string, string> = {
  success: "bg-green-50 border-green-200 text-green-800",
  error: "bg-red-50 border-red-200 text-red-800",
  warning: "bg-amber-50 border-amber-200 text-amber-800",
  info: "bg-blue-50 border-blue-200 text-blue-800",
};

const toastIconMap: Record<string, string> = {
  success: "check_circle",
  error: "error",
  warning: "warning",
  info: "info",
};

// ---------------------------------------------------------------------------
// Notification variant styling
// ---------------------------------------------------------------------------

const notifVariantStyles: Record<string, string> = {
  success: "border-green-200 bg-green-50",
  error: "border-red-200 bg-red-50",
  warning: "border-amber-200 bg-amber-50",
  info: "border-blue-200 bg-blue-50",
};

const notifIconMap: Record<string, string> = {
  success: "check_circle",
  error: "error",
  warning: "warning",
  info: "info",
};

// ---------------------------------------------------------------------------
// Default durations
// ---------------------------------------------------------------------------

const DEFAULT_TOAST_DURATION = 5000;
const DEFAULT_NOTIFICATION_DURATION = 8000;

// ---------------------------------------------------------------------------
// ImperativeFeedbackProvider
// ---------------------------------------------------------------------------

type ImperativeFeedbackProviderProps = {
  children: ReactNode;
};

function ImperativeFeedbackProvider({
  children,
}: ImperativeFeedbackProviderProps) {
  const [toasts, setToasts] = useState<ToastEntry[]>([]);
  const [modals, setModals] = useState<ModalEntry[]>([]);
  const [notifications, setNotifications] = useState<NotificationEntry[]>([]);
  const timersRef = useRef<Map<string, ReturnType<typeof setTimeout>>>(
    new Map()
  );

  // Clean up timers on unmount
  useEffect(() => {
    const timers = timersRef.current;
    return () => {
      timers.forEach((t) => clearTimeout(t));
      timers.clear();
    };
  }, []);

  // ----- Toast handlers -----

  const addToast = useCallback((entry: ToastEntry) => {
    setToasts((prev) => [...prev, entry]);
    const duration = entry.options.duration ?? DEFAULT_TOAST_DURATION;
    if (duration > 0) {
      const timer = setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== entry.id));
        timersRef.current.delete(entry.id);
      }, duration);
      timersRef.current.set(entry.id, timer);
    }
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
    const timer = timersRef.current.get(id);
    if (timer) {
      clearTimeout(timer);
      timersRef.current.delete(id);
    }
  }, []);

  // ----- Modal handlers -----

  const addModal = useCallback((entry: ModalEntry) => {
    setModals((prev) => [...prev, entry]);
  }, []);

  const removeModal = useCallback((id: string) => {
    setModals((prev) => prev.filter((m) => m.id !== id));
  }, []);

  // ----- Notification handlers -----

  const addNotification = useCallback((entry: NotificationEntry) => {
    setNotifications((prev) => [...prev, entry]);
    const duration = entry.options.duration ?? DEFAULT_NOTIFICATION_DURATION;
    if (duration > 0) {
      const timer = setTimeout(() => {
        setNotifications((prev) => prev.filter((n) => n.id !== entry.id));
        timersRef.current.delete(entry.id);
      }, duration);
      timersRef.current.set(entry.id, timer);
    }
  }, []);

  const removeNotification = useCallback((id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
    const timer = timersRef.current.get(id);
    if (timer) {
      clearTimeout(timer);
      timersRef.current.delete(id);
    }
  }, []);

  // ----- Register store -----

  useEffect(() => {
    const store: ImperativeFeedbackStore = {
      addToast,
      removeToast,
      addModal,
      removeModal,
      addNotification,
      removeNotification,
    };
    __setImperativeFeedbackStore(store);
    return () => {
      __setImperativeFeedbackStore(null);
    };
  }, [
    addToast,
    removeToast,
    addModal,
    removeModal,
    addNotification,
    removeNotification,
  ]);

  // ----- Escape key for topmost modal -----

  useEffect(() => {
    if (modals.length === 0) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        const topModal = modals[modals.length - 1];
        if (topModal.type === "confirm") {
          const opts = topModal.options as ModalConfirmOptions;
          opts.onCancel?.();
        }
        removeModal(topModal.id);
      }
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [modals, removeModal]);

  return (
    <>
      {children}

      {/* Toast container — top-right */}
      {toasts.length > 0 && (
        <div
          aria-live="polite"
          aria-label="Notifications"
          className="fixed top-4 right-4 z-[200] flex flex-col gap-2 max-w-sm w-full pointer-events-none"
        >
          {toasts.map((t) => {
            const variant = t.options.variant ?? "info";
            return (
              <div
                key={t.id}
                role="alert"
                className={cn(
                  s.toastBase,
                  toastVariantStyles[variant],
                  "pointer-events-auto animate-in slide-in-from-right"
                )}
              >
                <Icon
                  name={toastIconMap[variant]}
                  size="sm"
                  className="mt-0.5 shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm">{t.message}</p>
                  {t.options.description && (
                    <p className="text-sm mt-1 opacity-80">
                      {t.options.description}
                    </p>
                  )}
                </div>
                <button
                  type="button"
                  aria-label="Dismiss"
                  onClick={() => removeToast(t.id)}
                  className="shrink-0 p-0.5 rounded hover:bg-black/5 transition-colors focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none"
                >
                  <Icon name="close" size="sm" />
                </button>
              </div>
            );
          })}
        </div>
      )}

      {/* Notification container — bottom-right */}
      {notifications.length > 0 && (
        <div
          aria-live="polite"
          aria-label="Notifications"
          className="fixed bottom-4 right-4 z-[200] flex flex-col gap-2 max-w-sm w-full pointer-events-none"
        >
          {notifications.map((n) => {
            const variant = n.options.variant ?? "info";
            return (
              <div
                key={n.id}
                role="status"
                className={cn(
                  "flex items-start gap-3 rounded-xl p-4 border shadow-float pointer-events-auto",
                  notifVariantStyles[variant]
                )}
              >
                <Icon
                  name={notifIconMap[variant]}
                  size="sm"
                  className="mt-0.5 shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm">{n.options.title}</p>
                  {n.options.message && (
                    <p className="text-sm mt-1 opacity-80">
                      {n.options.message}
                    </p>
                  )}
                </div>
                <button
                  type="button"
                  aria-label="Dismiss notification"
                  onClick={() => removeNotification(n.id)}
                  className="shrink-0 p-0.5 rounded hover:bg-black/5 transition-colors focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none"
                >
                  <Icon name="close" size="sm" />
                </button>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal overlay(s) */}
      {modals.map((m) => {
        if (m.type === "confirm") {
          const opts = m.options as ModalConfirmOptions;
          return (
            <div
              key={m.id}
              className={s.modalOverlay}
              onClick={(e) => {
                if (e.target === e.currentTarget) {
                  opts.onCancel?.();
                  removeModal(m.id);
                }
              }}
            >
              <div
                role="alertdialog"
                aria-modal="true"
                aria-labelledby={`${m.id}-title`}
                aria-describedby={
                  opts.description ? `${m.id}-desc` : undefined
                }
                className={cn(s.modalContent, "w-full max-w-md")}
              >
                <div className={s.modalHeader}>
                  <h2
                    id={`${m.id}-title`}
                    className="text-lg font-bold text-secondary"
                  >
                    {opts.title}
                  </h2>
                </div>
                {opts.description && (
                  <div className={s.modalBody}>
                    <p id={`${m.id}-desc`} className="text-sm text-slate-600">
                      {opts.description}
                    </p>
                  </div>
                )}
                <div className={s.modalFooter}>
                  <button
                    type="button"
                    onClick={() => {
                      opts.onCancel?.();
                      removeModal(m.id);
                    }}
                    className="px-4 py-2 text-sm font-medium text-slate-700 bg-slate-100 rounded-lg hover:bg-slate-200 transition-colors focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none"
                  >
                    {opts.cancelLabel ?? "Cancel"}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      opts.onConfirm?.();
                      removeModal(m.id);
                    }}
                    className="px-4 py-2 text-sm font-medium text-white bg-primary rounded-lg hover:bg-primary/90 transition-colors focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none"
                  >
                    {opts.confirmLabel ?? "Confirm"}
                  </button>
                </div>
              </div>
            </div>
          );
        }

        // info modal
        const opts = m.options as ModalInfoOptions;
        return (
          <div
            key={m.id}
            className={s.modalOverlay}
            onClick={(e) => {
              if (e.target === e.currentTarget) {
                removeModal(m.id);
              }
            }}
          >
            <div
              role="dialog"
              aria-modal="true"
              aria-labelledby={`${m.id}-title`}
              aria-describedby={opts.description ? `${m.id}-desc` : undefined}
              className={cn(s.modalContent, "w-full max-w-md")}
            >
              <div className={s.modalHeader}>
                <h2
                  id={`${m.id}-title`}
                  className="text-lg font-bold text-secondary"
                >
                  {opts.title}
                </h2>
                <button
                  type="button"
                  onClick={() => removeModal(m.id)}
                  className="p-1 rounded-lg hover:bg-slate-100 transition-colors text-slate-400 focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none"
                >
                  <Icon name="close" size="md" />
                </button>
              </div>
              {opts.description && (
                <div className={s.modalBody}>
                  <p id={`${m.id}-desc`} className="text-sm text-slate-600">
                    {opts.description}
                  </p>
                </div>
              )}
              <div className={s.modalFooter}>
                <button
                  type="button"
                  onClick={() => removeModal(m.id)}
                  className="px-4 py-2 text-sm font-medium text-white bg-primary rounded-lg hover:bg-primary/90 transition-colors focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none"
                >
                  {opts.closeLabel ?? "OK"}
                </button>
              </div>
            </div>
          </div>
        );
      })}
    </>
  );
}

ImperativeFeedbackProvider.displayName = "ImperativeFeedbackProvider";

export { ImperativeFeedbackProvider };
export type { ImperativeFeedbackProviderProps };
