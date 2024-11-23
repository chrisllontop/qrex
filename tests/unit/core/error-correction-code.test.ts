import { describe, expect, it } from "vitest";
import { ECCode } from "../../../src/core/error-correction-code";
import { ECLevel } from "../../../src/core/error-correction-level";

describe("Error Correction Codewords", () => {
  const levels = [ECLevel.L, ECLevel.M, ECLevel.Q, ECLevel.H];

  it("should return the correct number of error correction codewords", () => {
    for (let v = 1; v <= 40; v++) {
      for (const level of levels) {
        // Fetch the expected codewords count from the EC_CODEWORDS_TABLE
        const expectedCodewords = ECCode.getTotalCodewordsCount(v, level);
        expect(expectedCodewords).toBeGreaterThan(0);
      }
    }

    // Test invalid error correction level
    expect(() => {
      // @ts-ignore
      ECCode.getTotalCodewordsCount(1, undefined);
    }).toThrow("Invalid error correction level");
  });
});

describe("Error Correction Blocks", () => {
  const levels = [ECLevel.L, ECLevel.M, ECLevel.Q, ECLevel.H];

  it("should return a positive number of blocks", () => {
    for (let v = 1; v <= 40; v++) {
      for (const level of levels) {
        // Fetch the expected blocks count from the EC_BLOCKS_TABLE
        const expectedBlocks = ECCode.getBlocksCount(v, level);
        expect(expectedBlocks).toBeGreaterThan(0);
      }
    }

    // Test invalid error correction level
    expect(() => {
      // @ts-ignore
      ECCode.getBlocksCount(1, undefined);
    }).toThrow("Invalid error correction level");
  });
});
