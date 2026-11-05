import { describe, it, expect } from "vitest";
import { minorArcana } from "./minorArcanaCards";
import { getMinorProse } from "./minorArcanaProse";

describe("minor arcana prose", () => {
  it("has prose for all 56 cards", () => {
    expect(minorArcana).toHaveLength(56);
    for (const c of minorArcana) {
      const p = getMinorProse(c.id);
      expect(p?.meaning.length).toBeGreaterThan(20);
      expect(p?.reversedMeaning.length).toBeGreaterThan(20);
    }
  });
});
