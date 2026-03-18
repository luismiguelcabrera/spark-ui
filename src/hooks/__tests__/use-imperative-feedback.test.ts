import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  toast,
  Modal,
  notification,
  __setImperativeFeedbackStore,
  type ImperativeFeedbackStore,
} from "../use-imperative-feedback";

// ---------------------------------------------------------------------------
// Test helpers
// ---------------------------------------------------------------------------

function createMockStore(): ImperativeFeedbackStore {
  return {
    addToast: vi.fn(),
    removeToast: vi.fn(),
    addModal: vi.fn(),
    removeModal: vi.fn(),
    addNotification: vi.fn(),
    removeNotification: vi.fn(),
  };
}

// ---------------------------------------------------------------------------
// Setup / teardown
// ---------------------------------------------------------------------------

beforeEach(() => {
  __setImperativeFeedbackStore(null);
});

// ---------------------------------------------------------------------------
// toast()
// ---------------------------------------------------------------------------

describe("toast()", () => {
  it("calls addToast with message and default options", () => {
    const store = createMockStore();
    __setImperativeFeedbackStore(store);

    const id = toast("Hello");

    expect(store.addToast).toHaveBeenCalledTimes(1);
    const entry = (store.addToast as ReturnType<typeof vi.fn>).mock.calls[0][0];
    expect(entry.message).toBe("Hello");
    expect(entry.id).toBeTruthy();
    expect(typeof id).toBe("string");
    expect(id).toBe(entry.id);
  });

  it("passes variant and duration options through", () => {
    const store = createMockStore();
    __setImperativeFeedbackStore(store);

    toast("Saved", { variant: "success", duration: 3000 });

    const entry = (store.addToast as ReturnType<typeof vi.fn>).mock.calls[0][0];
    expect(entry.options.variant).toBe("success");
    expect(entry.options.duration).toBe(3000);
  });

  it("returns empty string when no store is set", () => {
    const spy = vi.spyOn(console, "warn").mockImplementation(() => {});
    const id = toast("No store");
    expect(id).toBe("");
    spy.mockRestore();
  });

  it("warns in dev mode when no store is set", () => {
    const spy = vi.spyOn(console, "warn").mockImplementation(() => {});
    toast("No store");
    expect(spy).toHaveBeenCalledWith(
      expect.stringContaining("ImperativeFeedbackProvider")
    );
    spy.mockRestore();
  });
});

describe("toast.success()", () => {
  it("sets variant to success", () => {
    const store = createMockStore();
    __setImperativeFeedbackStore(store);

    toast.success("Done");

    const entry = (store.addToast as ReturnType<typeof vi.fn>).mock.calls[0][0];
    expect(entry.options.variant).toBe("success");
    expect(entry.message).toBe("Done");
  });
});

describe("toast.error()", () => {
  it("sets variant to error", () => {
    const store = createMockStore();
    __setImperativeFeedbackStore(store);

    toast.error("Failed");

    const entry = (store.addToast as ReturnType<typeof vi.fn>).mock.calls[0][0];
    expect(entry.options.variant).toBe("error");
    expect(entry.message).toBe("Failed");
  });
});

describe("toast.warning()", () => {
  it("sets variant to warning", () => {
    const store = createMockStore();
    __setImperativeFeedbackStore(store);

    toast.warning("Careful");

    const entry = (store.addToast as ReturnType<typeof vi.fn>).mock.calls[0][0];
    expect(entry.options.variant).toBe("warning");
  });
});

describe("toast.info()", () => {
  it("sets variant to info", () => {
    const store = createMockStore();
    __setImperativeFeedbackStore(store);

    toast.info("FYI");

    const entry = (store.addToast as ReturnType<typeof vi.fn>).mock.calls[0][0];
    expect(entry.options.variant).toBe("info");
  });
});

describe("toast.dismiss()", () => {
  it("calls removeToast with id", () => {
    const store = createMockStore();
    __setImperativeFeedbackStore(store);

    toast.dismiss("toast-1");
    expect(store.removeToast).toHaveBeenCalledWith("toast-1");
  });

  it("does not throw when no store is set", () => {
    expect(() => toast.dismiss("toast-1")).not.toThrow();
  });
});

// ---------------------------------------------------------------------------
// Modal.confirm()
// ---------------------------------------------------------------------------

describe("Modal.confirm()", () => {
  it("calls addModal with confirm type", () => {
    const store = createMockStore();
    __setImperativeFeedbackStore(store);

    const onConfirm = vi.fn();
    const onCancel = vi.fn();

    const promise = Modal.confirm({
      title: "Delete?",
      description: "This cannot be undone.",
      onConfirm,
      onCancel,
    });

    expect(promise).toBeInstanceOf(Promise);
    expect(store.addModal).toHaveBeenCalledTimes(1);
    const entry = (store.addModal as ReturnType<typeof vi.fn>).mock.calls[0][0];
    expect(entry.type).toBe("confirm");
    expect(entry.options.title).toBe("Delete?");
    expect(entry.options.description).toBe("This cannot be undone.");
  });

  it("resolves true when confirmed", async () => {
    const store = createMockStore();
    __setImperativeFeedbackStore(store);

    const onConfirm = vi.fn();
    const promise = Modal.confirm({ title: "Delete?", onConfirm });

    const entry = (store.addModal as ReturnType<typeof vi.fn>).mock.calls[0][0];
    entry.options.onConfirm();

    const result = await promise;
    expect(result).toBe(true);
    expect(onConfirm).toHaveBeenCalled();
  });

  it("resolves false when cancelled", async () => {
    const store = createMockStore();
    __setImperativeFeedbackStore(store);

    const onCancel = vi.fn();
    const promise = Modal.confirm({ title: "Delete?", onCancel });

    const entry = (store.addModal as ReturnType<typeof vi.fn>).mock.calls[0][0];
    entry.options.onCancel();

    const result = await promise;
    expect(result).toBe(false);
    expect(onCancel).toHaveBeenCalled();
  });

  it("resolves false when no store is set", async () => {
    const spy = vi.spyOn(console, "warn").mockImplementation(() => {});
    const result = await Modal.confirm({ title: "No store" });
    expect(result).toBe(false);
    spy.mockRestore();
  });
});

// ---------------------------------------------------------------------------
// Modal.info()
// ---------------------------------------------------------------------------

describe("Modal.info()", () => {
  it("calls addModal with info type", () => {
    const store = createMockStore();
    __setImperativeFeedbackStore(store);

    const promise = Modal.info({
      title: "Info",
      description: "Some info text.",
    });

    expect(promise).toBeInstanceOf(Promise);
    expect(store.addModal).toHaveBeenCalledTimes(1);
    const entry = (store.addModal as ReturnType<typeof vi.fn>).mock.calls[0][0];
    expect(entry.type).toBe("info");
    expect(entry.options.title).toBe("Info");
  });

  it("resolves when dismissed", async () => {
    const store = createMockStore();
    __setImperativeFeedbackStore(store);

    const promise = Modal.info({ title: "Info" });

    const entry = (store.addModal as ReturnType<typeof vi.fn>).mock.calls[0][0];
    const onClose = (entry.options as Record<string, unknown>)._onClose as (() => void) | undefined;
    onClose?.();

    await expect(promise).resolves.toBeUndefined();
  });

  it("resolves void when no store is set", async () => {
    const spy = vi.spyOn(console, "warn").mockImplementation(() => {});
    await expect(Modal.info({ title: "No store" })).resolves.toBeUndefined();
    spy.mockRestore();
  });
});

// ---------------------------------------------------------------------------
// notification.show()
// ---------------------------------------------------------------------------

describe("notification.show()", () => {
  it("calls addNotification with options", () => {
    const store = createMockStore();
    __setImperativeFeedbackStore(store);

    const id = notification.show({
      title: "New message",
      message: "You have mail",
      variant: "info",
    });

    expect(store.addNotification).toHaveBeenCalledTimes(1);
    const entry = (store.addNotification as ReturnType<typeof vi.fn>).mock
      .calls[0][0];
    expect(entry.options.title).toBe("New message");
    expect(entry.options.message).toBe("You have mail");
    expect(entry.options.variant).toBe("info");
    expect(typeof id).toBe("string");
    expect(id).toBeTruthy();
  });

  it("returns empty string when no store is set", () => {
    const spy = vi.spyOn(console, "warn").mockImplementation(() => {});
    const id = notification.show({ title: "No store" });
    expect(id).toBe("");
    spy.mockRestore();
  });
});

// ---------------------------------------------------------------------------
// notification.close()
// ---------------------------------------------------------------------------

describe("notification.close()", () => {
  it("calls removeNotification with id", () => {
    const store = createMockStore();
    __setImperativeFeedbackStore(store);

    notification.close("notif-1");
    expect(store.removeNotification).toHaveBeenCalledWith("notif-1");
  });

  it("does not throw when no store is set", () => {
    expect(() => notification.close("notif-1")).not.toThrow();
  });
});

// ---------------------------------------------------------------------------
// Unique IDs
// ---------------------------------------------------------------------------

describe("ID generation", () => {
  it("generates unique IDs for each call", () => {
    const store = createMockStore();
    __setImperativeFeedbackStore(store);

    const id1 = toast("first");
    const id2 = toast("second");
    const id3 = notification.show({ title: "third" });

    expect(id1).not.toBe(id2);
    expect(id2).not.toBe(id3);
    expect(id1).not.toBe(id3);
  });
});
