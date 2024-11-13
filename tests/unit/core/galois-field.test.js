import { describe, it, expect } from "vitest";
import {GaloisField as GF} from "../../../src/core/galois-field";

describe("Galois Field", () => {
  it("should throw for log(n) with n < 1", () => {
    expect(() => GF.log(0)).toThrow("log(0)");
  });

  for (let i = 1; i < 255; i++) {
    it(`log and exp should be the inverse of each other for i = ${i}`, () => {
      expect(GF.log(GF.exp(i))).toBe(i);
      expect(GF.exp(GF.log(i))).toBe(i);
    });
  }

  it("should return 0 if first param is 0", () => {
    expect(GF.mul(0, 1)).toBe(0);
  });

  it("should return 0 if second param is 0", () => {
    expect(GF.mul(1, 0)).toBe(0);
  });

  it("should return 0 if both params are 0", () => {
    expect(GF.mul(0, 0)).toBe(0);
  });

  for (let j = 1; j < 255; j++) {
    it(`Multiplication should be commutative for j = ${j}`, () => {
      expect(GF.mul(j, 255 - j)).toBe(GF.mul(255 - j, j));
    });
  }
});
