"use client";

import { type ReactNode } from "react";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type ToastVariant = "success" | "error" | "warning" | "info";

export type ToastOptions = {
  variant?: ToastVariant;
  duration?: number;
  description?: string;
  actions?: ReactNode;
};

export type ToastEntry = {
  id: string;
  message: string;
  options: ToastOptions;
  createdAt: number;
};

export type ModalConfirmOptions = {
  title: string;
  description?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm?: () => void;
  onCancel?: () => void;
};

export type ModalInfoOptions = {
  title: string;
  description?: string;
  closeLabel?: string;
};

export type ModalEntry = {
  id: string;
  type: "confirm" | "info";
  options: ModalConfirmOptions | ModalInfoOptions;
};

export type NotificationVariant = "success" | "error" | "warning" | "info";

export type NotificationOptions = {
  title: string;
  message?: string;
  variant?: NotificationVariant;
  duration?: number;
};

export type NotificationEntry = {
  id: string;
  options: NotificationOptions;
  createdAt: number;
};

// ---------------------------------------------------------------------------
// Store — module-level ref accessed by imperative functions
// ---------------------------------------------------------------------------

export type ImperativeFeedbackStore = {
  addToast: (entry: ToastEntry) => void;
  removeToast: (id: string) => void;
  addModal: (entry: ModalEntry) => void;
  removeModal: (id: string) => void;
  addNotification: (entry: NotificationEntry) => void;
  removeNotification: (id: string) => void;
};

let storeRef: ImperativeFeedbackStore | null = null;

export function __setImperativeFeedbackStore(
  store: ImperativeFeedbackStore | null
) {
  storeRef = store;
}

export function __getImperativeFeedbackStore(): ImperativeFeedbackStore | null {
  return storeRef;
}

// ---------------------------------------------------------------------------
// ID generator
// ---------------------------------------------------------------------------

let counter = 0;

function generateId(prefix: string): string {
  return `${prefix}-${++counter}-${Date.now()}`;
}

// ---------------------------------------------------------------------------
// toast() imperative API
// ---------------------------------------------------------------------------

function toastFn(message: string, options: ToastOptions = {}): string {
  const store = storeRef;
  if (!store) {
    console.warn(
      "toast() was called but no ImperativeFeedbackProvider is mounted."
    );
    return "";
  }
  const id = generateId("toast");
  store.addToast({ id, message, options, createdAt: Date.now() });
  return id;
}

toastFn.success = (message: string, options?: Omit<ToastOptions, "variant">) =>
  toastFn(message, { ...options, variant: "success" });

toastFn.error = (message: string, options?: Omit<ToastOptions, "variant">) =>
  toastFn(message, { ...options, variant: "error" });

toastFn.warning = (message: string, options?: Omit<ToastOptions, "variant">) =>
  toastFn(message, { ...options, variant: "warning" });

toastFn.info = (message: string, options?: Omit<ToastOptions, "variant">) =>
  toastFn(message, { ...options, variant: "info" });

toastFn.dismiss = (id: string) => {
  storeRef?.removeToast(id);
};

export const toast = toastFn;

// ---------------------------------------------------------------------------
// Modal imperative API
// ---------------------------------------------------------------------------

export const Modal = {
  confirm(options: ModalConfirmOptions): string {
    const store = storeRef;
    if (!store) {
      console.warn(
        "Modal.confirm() was called but no ImperativeFeedbackProvider is mounted."
      );
      return "";
    }
    const id = generateId("modal");
    store.addModal({ id, type: "confirm", options });
    return id;
  },

  info(options: ModalInfoOptions): string {
    const store = storeRef;
    if (!store) {
      console.warn(
        "Modal.info() was called but no ImperativeFeedbackProvider is mounted."
      );
      return "";
    }
    const id = generateId("modal");
    store.addModal({ id, type: "info", options });
    return id;
  },
};

// ---------------------------------------------------------------------------
// notification imperative API
// ---------------------------------------------------------------------------

export const notification = {
  show(options: NotificationOptions): string {
    const store = storeRef;
    if (!store) {
      console.warn(
        "notification.show() was called but no ImperativeFeedbackProvider is mounted."
      );
      return "";
    }
    const id = generateId("notif");
    store.addNotification({ id, options, createdAt: Date.now() });
    return id;
  },

  close(id: string) {
    storeRef?.removeNotification(id);
  },
};
