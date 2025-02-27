import { describe, expect, it } from "vitest";
import { AlphanumericData } from "../../../src/core/alphanumeric-data.js";
import { BitBuffer } from "../../../src/core/bit-buffer.js";
import { Mode } from "../../../src/core/mode.js";

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
  it("should handle undefined data", () => {
    // @ts-ignore Testing undefined case
    const alphanumericData = new AlphanumericData(undefined);
    expect(alphanumericData.length).toBe(0);
    expect(alphanumericData.data).toBeUndefined();
  });

  it("should handle alphanumeric data correctly", () => {
    for (const data of testData) {
      const alphanumericData = new AlphanumericData(data.data);

      expect(alphanumericData.mode).toBe(Mode.ALPHANUMERIC);
      expect(alphanumericData.getLength()).toBe(data.length);
      expect(alphanumericData.getBitsLength()).toBe(data.bitLength);

      const bitBuffer = new BitBuffer();
      alphanumericData.write(bitBuffer);

      expect(bitBuffer.buffer).toEqual(data.dataBit);
    }
  });
});
