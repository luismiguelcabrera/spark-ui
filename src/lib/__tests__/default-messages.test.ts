import { describe, it, expect } from "vitest";
import { defaultMessages } from "../default-messages";

describe("defaultMessages", () => {
  it("contains all expected common keys", () => {
    const commonKeys = [
      "common.close",
      "common.cancel",
      "common.confirm",
      "common.save",
      "common.delete",
      "common.search",
      "common.clear",
      "common.loading",
      "common.noResults",
      "common.showMore",
      "common.showLess",
    ];
    for (const key of commonKeys) {
      expect(defaultMessages[key]).toBeDefined();
    }
  });

  it("contains pagination keys", () => {
    expect(defaultMessages["pagination.next"]).toBe("Next");
    expect(defaultMessages["pagination.previous"]).toBe("Previous");
    expect(defaultMessages["pagination.first"]).toBe("First page");
    expect(defaultMessages["pagination.last"]).toBe("Last page");
  });

  it("contains select keys", () => {
    expect(defaultMessages["select.placeholder"]).toBe("Select...");
    expect(defaultMessages["select.noOptions"]).toBe("No options");
  });

  it("contains datepicker keys", () => {
    expect(defaultMessages["datepicker.placeholder"]).toBe("Select date");
  });

  it("contains upload keys", () => {
    expect(defaultMessages["upload.dragDrop"]).toBe(
      "Drag and drop files here",
    );
    expect(defaultMessages["upload.browse"]).toBe("Browse");
  });

  it("all values are non-empty strings", () => {
    for (const [key, value] of Object.entries(defaultMessages)) {
      expect(typeof value).toBe("string");
      expect(value.length).toBeGreaterThan(0);
    }
  });
});
