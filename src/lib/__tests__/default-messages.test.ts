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
    expect(defaultMessages["pagination.nextPage"]).toBe("Next page");
    expect(defaultMessages["pagination.previousPage"]).toBe("Previous page");
    expect(defaultMessages["pagination.showing"]).toBe("Showing");
    expect(defaultMessages["pagination.of"]).toBe("of");
  });

  it("contains select keys", () => {
    expect(defaultMessages["select.placeholder"]).toBe("Select...");
    expect(defaultMessages["select.noOptions"]).toBe("No options");
  });

  it("contains datepicker keys", () => {
    expect(defaultMessages["datepicker.placeholder"]).toBe("Select date");
    expect(defaultMessages["datepicker.pickDate"]).toBe("Pick a date");
  });

  it("contains upload keys", () => {
    expect(defaultMessages["upload.dragDrop"]).toBe(
      "Drag and drop files here",
    );
    expect(defaultMessages["upload.browse"]).toBe("Browse");
  });

  it("contains calendar month and day keys", () => {
    expect(defaultMessages["calendar.monthJanuary"]).toBe("January");
    expect(defaultMessages["calendar.monthDecember"]).toBe("December");
    expect(defaultMessages["calendar.monthShortJan"]).toBe("Jan");
    expect(defaultMessages["calendar.monthShortDec"]).toBe("Dec");
    expect(defaultMessages["calendar.daySun"]).toBe("Sun");
    expect(defaultMessages["calendar.daySat"]).toBe("Sat");
    expect(defaultMessages["calendar.previousMonth"]).toBe("Previous month");
    expect(defaultMessages["calendar.nextMonth"]).toBe("Next month");
    expect(defaultMessages["calendar.today"]).toBe("Today");
  });

  it("contains tour keys", () => {
    expect(defaultMessages["tour.previous"]).toBe("Previous");
    expect(defaultMessages["tour.next"]).toBe("Next");
    expect(defaultMessages["tour.finish"]).toBe("Finish");
    expect(defaultMessages["tour.closeTour"]).toBe("Close tour");
  });

  it("contains carousel and galleria keys", () => {
    expect(defaultMessages["carousel.previous"]).toBe("Previous slide");
    expect(defaultMessages["carousel.next"]).toBe("Next slide");
    expect(defaultMessages["galleria.previous"]).toBe("Previous image");
    expect(defaultMessages["galleria.next"]).toBe("Next image");
    expect(defaultMessages["galleria.noImages"]).toBe("No images");
  });

  it("contains rich text editor keys", () => {
    expect(defaultMessages["rte.bold"]).toBe("Bold");
    expect(defaultMessages["rte.italic"]).toBe("Italic");
    expect(defaultMessages["rte.editor"]).toBe("Rich text editor");
  });

  it("all values are non-empty strings", () => {
    for (const [_key, value] of Object.entries(defaultMessages)) {
      expect(typeof value).toBe("string");
      expect(value.length).toBeGreaterThan(0);
    }
  });
});
