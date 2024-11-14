import { describe, it, expect } from "vitest";
import { BitBuffer } from "../../../src/core/bit-buffer";
import NumericData from "../../../src/core/numeric-data";
import { Mode } from "../../../src/core/mode";

const testData = [
  {
    data: 8,
    length: 1,
    bitLength: 4,
    dataBit: [128],
  },
  {
    data: 16,
    length: 2,
    bitLength: 7,
    dataBit: [32],
  },
  {
    data: 128,
    length: 3,
    bitLength: 10,
    dataBit: [32, 0],
  },
  {
    data: 12345,
    length: 5,
    bitLength: 17,
    dataBit: [30, 214, 128],
  },
];

describe("Numeric Data", () => {
  for (const data of testData) {
    it(`Testing numeric data: ${data.data}`, () => {
      const numericData = new NumericData(data.data);

      expect(numericData.mode).toBe(Mode.NUMERIC);
      expect(numericData.getLength()).toBe(data.length);
      expect(numericData.getBitsLength()).toBe(data.bitLength);

      const bitBuffer = new BitBuffer();
      numericData.write(bitBuffer);

      expect(bitBuffer.buffer).toEqual(data.dataBit);
    });
  };
});
