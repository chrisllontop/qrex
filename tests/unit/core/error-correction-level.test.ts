import { describe, expect, it } from "vitest";
import { ECLevel } from "../../../src/core/error-correction-level.js";
import type { ErrorCorrectionLevel, ErrorCorrectionLevelBit } from "../../../src/types/qrex.type.js";

const EC_LEVELS = [ECLevel.L, ECLevel.M, ECLevel.Q, ECLevel.H];

describe("Error Level from Input Value", () => {
  it("should return the correct error level from input value", () => {
    const values: [string, string][] = [
      ["l", "low"],
      ["m", "medium"],
      ["q", "quartile"],
      ["h", "high"],
    ];

    for (let l = 0; l < values.length; l++) {
      for (const val of values[l]) {
        expect(ECLevel.from(val as ErrorCorrectionLevel, ECLevel.M)).toBe(EC_LEVELS[l]);
        expect(ECLevel.from(val.toUpperCase() as ErrorCorrectionLevel, ECLevel.M)).toBe(EC_LEVELS[l]);
      }
    }

    expect(ECLevel.from(ECLevel.L, ECLevel.M)).toBe(ECLevel.L);
    expect(ECLevel.from(undefined as unknown as ErrorCorrectionLevel, ECLevel.M)).toBe(ECLevel.M);
    expect(ECLevel.from("" as ErrorCorrectionLevel, ECLevel.Q)).toBe(ECLevel.Q);
  });
});

describe("Error Level Validity", () => {
  it("should return true for valid error levels", () => {
    for (const level of EC_LEVELS) {
      expect(ECLevel.isValid(level)).toBe(true);
    }
  });

  it("should return false for invalid error levels", () => {
    expect(ECLevel.isValid(undefined)).toBe(false);
    expect(ECLevel.isValid({} as ErrorCorrectionLevelBit)).toBe(false);
    expect(ECLevel.isValid({ bit: -1 } as ErrorCorrectionLevelBit)).toBe(false);
    expect(ECLevel.isValid({ bit: 4 } as ErrorCorrectionLevelBit)).toBe(false);
  });
});
