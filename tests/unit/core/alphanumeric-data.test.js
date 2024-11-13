import { describe, it, expect } from "vitest";
import { BitBuffer } from "../../../src/core/bit-buffer";
import { AlphanumericData } from "../../../src/core/alphanumeric-data";
import { Mode } from "../../../src/core/mode";

const testData = [
  {
    data: "A",
    length: 1,
    bitLength: 6,
    dataBit: [40],
  },
  {
    data: "AB",
    length: 2,
    bitLength: 11,
    dataBit: [57, 160],
  },
  {
    data: "ABC12",
    length: 5,
    bitLength: 28,
    dataBit: [57, 168, 116, 32],
  },
];

describe("Alphanumeric Data", () => {
  it("should handle alphanumeric data correctly", () => {
    testData.forEach((data) => {
      const alphanumericData = new AlphanumericData(data.data);

      expect(alphanumericData.mode).toBe(Mode.ALPHANUMERIC);
      expect(alphanumericData.getLength()).toBe(data.length);
      expect(alphanumericData.getBitsLength()).toBe(data.bitLength);

      const bitBuffer = new BitBuffer();
      alphanumericData.write(bitBuffer);

      expect(bitBuffer.buffer).toEqual(data.dataBit);
    });
  });
});
