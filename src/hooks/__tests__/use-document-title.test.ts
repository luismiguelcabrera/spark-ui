import { renderHook } from "@testing-library/react";
import { describe, it, expect, beforeEach } from "vitest";
import { useDocumentTitle } from "../use-document-title";

describe("useDocumentTitle", () => {
  const originalTitle = "Original Title";

  beforeEach(() => {
    document.title = originalTitle;
  });

  it("sets the document title", () => {
    renderHook(() => useDocumentTitle("New Title"));
    expect(document.title).toBe("New Title");
  });

  it("updates the document title when the title prop changes", () => {
    const { rerender } = renderHook(
      ({ title }) => useDocumentTitle(title),
      { initialProps: { title: "Title A" } },
    );

    expect(document.title).toBe("Title A");

    rerender({ title: "Title B" });
    expect(document.title).toBe("Title B");
  });

  it("restores the original title on unmount by default", () => {
    const { unmount } = renderHook(() => useDocumentTitle("Temporary Title"));

    expect(document.title).toBe("Temporary Title");

    unmount();
    expect(document.title).toBe(originalTitle);
  });

  it("does not restore the title on unmount when restoreOnUnmount is false", () => {
    const { unmount } = renderHook(() =>
      useDocumentTitle("Permanent Title", false),
    );

    expect(document.title).toBe("Permanent Title");

    unmount();
    expect(document.title).toBe("Permanent Title");
  });

  it("restores the original title even after multiple updates", () => {
    const { rerender, unmount } = renderHook(
      ({ title }) => useDocumentTitle(title),
      { initialProps: { title: "First" } },
    );

    rerender({ title: "Second" });
    rerender({ title: "Third" });

    expect(document.title).toBe("Third");

    unmount();
    expect(document.title).toBe(originalTitle);
  });
});
