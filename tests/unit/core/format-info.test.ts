import { describe, expect, it } from "vitest";
import { ECLevel } from "../../../src/core/error-correction-level.js";
import { FormatInfo } from "../../../src/core/format-info.js";
import { MaskPattern } from "../../../src/core/mask-pattern.js";
import type { ErrorCorrectionLevelBit, MaskPatternType } from "../../../src/types/qrex.type.js";

const EXPECTED_FORMAT_BITS: readonly number[][] = [
  [0x77c4, 0x72f3, 0x7daa, 0x789d, 0x662f, 0x6318, 0x6c41, 0x6976],
  [0x5412, 0x5125, 0x5e7c, 0x5b4b, 0x45f9, 0x40ce, 0x4f97, 0x4aa0],
  [0x355f, 0x3068, 0x3f31, 0x3a06, 0x24b4, 0x2183, 0x2eda, 0x2bed],
  [0x1689, 0x13be, 0x1ce7, 0x19d0, 0x0762, 0x0255, 0x0d0c, 0x083b],
] as const;

describe("Format encoded info", () => {
  it("should return correct bits for all levels and patterns", () => {
    const levels: ErrorCorrectionLevelBit[] = [ECLevel.L, ECLevel.M, ECLevel.Q, ECLevel.H];
    const patterns: number = Object.keys(MaskPattern.Patterns).length;

    const allResultsPass = levels.every((level, lIndex) =>
      Array.from(
        { length: patterns },
        (_, p) => FormatInfo.getEncodedBits(level, p as MaskPatternType) === EXPECTED_FORMAT_BITS[lIndex][p],
      ).every(Boolean),
    );

    expect(allResultsPass).toBe(true);
  });
});
