import { describe, it, expect } from "vitest";
import { GaloisField as GF } from "../../../src/core/galois-field";

describe("Galois Field", () => {
  it("should throw for log(n) with n < 1", () => {
    expect(() => GF.log(0)).toThrow("log(0)");
  });

  it("log and exp should be the inverse of each other for values 1 to 254", () => {
    const logExpResults = Array.from({ length: 254 }, (_, i) => i + 1).map((i) => ({
      value: i,
      logExpResult: GF.log(GF.exp(i)),
      expLogResult: GF.exp(GF.log(i)),
    }));

    logExpResults.forEach(({ value, logExpResult, expLogResult }) => {
      expect(logExpResult).toBe(value);
      expect(expLogResult).toBe(value);
    });
  });

  it("should return 0 if first parameter is 0 in multiplication", () => {
    expect(GF.mul(0, 1)).toBe(0);
  });

  it("should return 0 if second parameter is 0 in multiplication", () => {
    expect(GF.mul(1, 0)).toBe(0);
  });

  it("should return 0 if both parameters are 0 in multiplication", () => {
    expect(GF.mul(0, 0)).toBe(0);
  });

  it("Multiplication should be commutative for values 1 to 254", () => {
    const mulResults = Array.from({ length: 254 }, (_, j) => j + 1).map((j) => ({
      value: j,
      mulResult: GF.mul(j, 255 - j),
      commutativeResult: GF.mul(255 - j, j),
    }));

    mulResults.forEach(({ mulResult, commutativeResult }) => {
      expect(mulResult).toBe(commutativeResult);
    });
  });
});
