import { describe, it, expect } from "vitest";
import { ECLevel } from "../../../src/core/error-correction-level";

const EC_LEVELS = [ECLevel.L, ECLevel.M, ECLevel.Q, ECLevel.H];

describe("Error Level from Input Value", () => {
  it("should return correct error level from input value", () => {
    const values = [
      ["l", "low"],
      ["m", "medium"],
      ["q", "quartile"],
      ["h", "high"],
    ];

    for (let l = 0; l < values.length; l++) {
      for (let i = 0; i < values[l].length; i++) {
        expect(ECLevel.from(values[l][i])).toBe(EC_LEVELS[l]);
        expect(ECLevel.from(values[l][i].toUpperCase())).toBe(EC_LEVELS[l]);
      }
    }

    expect(ECLevel.from(ECLevel.L)).toBe(ECLevel.L);
    expect(ECLevel.from(undefined, ECLevel.M)).toBe(ECLevel.M);
    expect(ECLevel.from("", ECLevel.Q)).toBe(ECLevel.Q);
  });
});

describe("Error Level Validity", () => {
  it("should return true for valid error levels", () => {
    for (let l = 0; l < EC_LEVELS.length; l++) {
      expect(ECLevel.isValid(EC_LEVELS[l])).toBe(true);
    }
  });

  it("should return false for invalid error levels", () => {
    expect(ECLevel.isValid(undefined)).toBe(undefined);
    expect(ECLevel.isValid({})).toBe(false);
    expect(ECLevel.isValid({ bit: -1 })).toBe(false);
    expect(ECLevel.isValid({ bit: 4 })).toBe(false);
  });
});
