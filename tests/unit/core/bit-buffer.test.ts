import { describe, expect, it } from "vitest";
import { BitBuffer } from "../../../src/core/bit-buffer.js";

describe("Bit Buffer", () => {
  it("should handle bit buffer operations correctly", () => {
    const testData = 0x41;
    const expectedDataBits = [false, true, false, false, false, false, false, true];

    const bitBuffer = new BitBuffer();

    expect(bitBuffer.getLengthInBits()).toBe(0);

    bitBuffer.put(testData, 8);
    expect(bitBuffer.getLengthInBits()).toBe(8);

    for (let i = 0; i < 8; i++) {
      expect(bitBuffer.get(i)).toEqual(expectedDataBits[i]);
    }
  });
});
