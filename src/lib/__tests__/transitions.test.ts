import { describe, it, expect } from "vitest";
import { transitions } from "../transitions";
import type { TransitionDuration, TransitionEasing } from "../transitions";

describe("transitions", () => {
  describe("duration", () => {
    it("exposes all duration presets as numbers", () => {
      expect(transitions.duration.fastest).toBe(100);
      expect(transitions.duration.fast).toBe(150);
      expect(transitions.duration.normal).toBe(200);
      expect(transitions.duration.slow).toBe(300);
      expect(transitions.duration.slowest).toBe(500);
    });

    it("has 5 duration levels", () => {
      expect(Object.keys(transitions.duration)).toHaveLength(5);
    });
  });

  describe("easing", () => {
    it("exposes all easing presets as strings", () => {
      expect(transitions.easing.ease).toBe("ease");
      expect(transitions.easing.easeIn).toBe("ease-in");
      expect(transitions.easing.easeOut).toBe("ease-out");
      expect(transitions.easing.easeInOut).toBe("ease-in-out");
      expect(transitions.easing.spring).toBe(
        "cubic-bezier(0.175, 0.885, 0.32, 1.275)"
      );
    });

    it("has 5 easing presets", () => {
      expect(Object.keys(transitions.easing)).toHaveLength(5);
    });
  });

  describe("types", () => {
    it("TransitionDuration accepts valid keys", () => {
      const d: TransitionDuration = "normal";
      expect(transitions.duration[d]).toBe(200);
    });

    it("TransitionEasing accepts valid keys", () => {
      const e: TransitionEasing = "spring";
      expect(transitions.easing[e]).toBe(
        "cubic-bezier(0.175, 0.885, 0.32, 1.275)"
      );
    });
  });
});
