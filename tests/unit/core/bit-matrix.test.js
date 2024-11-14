import { describe, expect, it } from "vitest";
import { BitMatrix } from "../../../src/core/bit-matrix";

describe("Bit Matrix", () => {
  it("should throw an error if size is 0", () => {
    expect(() => new BitMatrix(0)).toThrow(
      "BitMatrix size must be defined and greater than 0",
    );
  });

  it("should throw an error if size is less than 0", () => {
    expect(() => new BitMatrix(-1)).toThrow(
      "BitMatrix size must be defined and greater than 0",
    );
  });

  it("should handle bit matrix operations correctly", () => {
    const bm = new BitMatrix(2);

    expect(bm.size).toBe(2);
    expect(bm.data.length).toBe(4);
    expect(bm.reservedBit.length).toBe(4);

    bm.set(0, 1, 1, true);
    expect(bm.get(0, 1)).toBe(1);
    expect(bm.isReserved(0, 1)).toBe(1);

    bm.xor(0, 1, 1);
    expect(bm.get(0, 1)).toBe(0);

    bm.set(0, 1, 1);
    expect(bm.get(0, 1)).toBe(1);
    expect(bm.isReserved(0, 1)).toBe(1);
  });
});
