import { describe, it, expect } from "vitest";
import { CoreUtils } from "../../../src/core/utils";
import { Version } from "../../../src/core/version";
import { ECLevel } from "../../../src/core/error-correction-level";
import { ECCode } from "../../../src/core/error-correction-code";
import { Mode } from "../../../src/core/mode";

describe("Error Correction Codewords", () => {
  const levels = [ECLevel.L, ECLevel.M, ECLevel.Q, ECLevel.H];

  it("should return correct number of error correction codewords", () => {
    for (let v = 1; v <= 40; v++) {
      const totalCodewords = CoreUtils.getSymbolTotalCodewords(v);
      const reservedByte = Math.ceil(
        (Mode.getCharCountIndicator(Mode.BYTE, v) + 4) / 8,
      );

      for (let l = 0; l < levels.length; l++) {
        const dataCodewords =
          Version.getCapacity(v, levels[l], Mode.BYTE) + reservedByte;

        const expectedCodewords = totalCodewords - dataCodewords;

        expect(ECCode.getTotalCodewordsCount(v, levels[l])).toBe(
          expectedCodewords,
        );
      }
    }

    expect(ECCode.getTotalCodewordsCount(1)).toBeUndefined();
  });
});

describe("Error Correction Blocks", () => {
  const levels = [ECLevel.L, ECLevel.M, ECLevel.Q, ECLevel.H];

  it("should return a positive number of blocks", () => {
    for (let v = 1; v <= 40; v++) {
      for (let l = 0; l < levels.length; l++) {
        expect(ECCode.getBlocksCount(v, levels[l])).toBeGreaterThan(0);
      }
    }

    expect(ECCode.getBlocksCount(1)).toBeUndefined();
  });
});
