import { describe, expect, it } from "vitest";
import { ECCode } from "../../../src/core/error-correction-code";
import { ECLevel } from "../../../src/core/error-correction-level";
import { Mode } from "../../../src/core/mode";
import { CoreUtils } from "../../../src/core/utils";
import { Version } from "../../../src/core/version";

describe("Error Correction Codewords", () => {
  const levels = [ECLevel.L, ECLevel.M, ECLevel.Q, ECLevel.H];

  it("should return correct number of error correction codewords", () => {
    for (let v = 1; v <= 40; v++) {
      const totalCodewords = CoreUtils.getSymbolTotalCodewords(v);
      const reservedByte = Math.ceil((Mode.getCharCountIndicator(Mode.BYTE, v) + 4) / 8);

      for (let l = 0; l < levels.length; l++) {
        const dataCodewords = Version.getCapacity(v, levels[l], Mode.BYTE) + reservedByte;

        const expectedCodewords = totalCodewords - dataCodewords;

        expect(ECCode.getTotalCodewordsCount(v, levels[l])).toBe(expectedCodewords);
      }
    }

    // @ts-ignore
    expect(ECCode.getTotalCodewordsCount(1, undefined)).toThrow("Invalid error correction level");
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

    // @ts-ignore
    expect(ECCode.getBlocksCount(1, undefined)).toThrow("Invalid error correction level");
  });
});
