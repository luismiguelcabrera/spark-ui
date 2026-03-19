import { describe, it, expect } from "vitest";
import { defaultMessages } from "../../lib/default-messages";
import { en } from "../en";
import { es } from "../es";
import { fr } from "../fr";
import { de } from "../de";
import { pt } from "../pt";
import { ar } from "../ar";
import { zh } from "../zh";
import { ja } from "../ja";

const packs = { en, es, fr, de, pt, ar, zh, ja };
const defaultKeys = Object.keys(defaultMessages).sort();

describe("locale packs", () => {
  it.each(Object.entries(packs))(
    "%s pack has all keys from defaultMessages",
    (_locale, pack) => {
      const packKeys = Object.keys(pack).sort();
      expect(packKeys).toEqual(defaultKeys);
    },
  );

  it.each(Object.entries(packs))(
    "%s pack has no empty values",
    (_locale, pack) => {
      for (const [key, value] of Object.entries(pack)) {
        expect(value, `key "${key}" should not be empty`).toBeTruthy();
        expect(typeof value).toBe("string");
      }
    },
  );

  it("en pack matches defaultMessages values", () => {
    for (const [key, value] of Object.entries(defaultMessages)) {
      expect(en[key]).toBe(value);
    }
  });

  it("all packs have the same number of keys", () => {
    const expectedCount = defaultKeys.length;
    for (const [locale, pack] of Object.entries(packs)) {
      expect(
        Object.keys(pack).length,
        `${locale} should have ${expectedCount} keys`,
      ).toBe(expectedCount);
    }
  });
});
