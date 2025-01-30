import { describe, expect, it } from "vitest";
import { FinderPattern } from "../../../src/core/finder-pattern.js";

describe("Finder Pattern", () => {
  it("should always return 3 pattern positions for QR code versions 1 to 40", () => {
    for (let i = 1; i <= 40; i++) {
      expect(FinderPattern.getPositions(i).length).toBe(3);
    }
  });
});
