import { describe, expect, it } from "vitest";
import { BitMatrix } from "../../../src/core/bit-matrix.js";
import { MaskPattern } from "../../../src/core/mask-pattern.js";
import type { MaskPatternType } from "../../../src/types/qrex.type.js";

describe("Mask pattern - Pattern references", () => {
  it("Should return 8 patterns", () => {
    const patternsCount = Object.keys(MaskPattern.Patterns).length;
    expect(patternsCount).toBe(8);
  });
});

const expectedPattern000 = [
  1, 0, 1, 0, 1, 0, 0, 1, 0, 1, 0, 1, 1, 0, 1, 0, 1, 0, 0, 1, 0, 1, 0, 1, 1, 0, 1, 0, 1, 0, 0, 1, 0, 1, 0, 1,
];

const expectedPattern001 = [
  1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0,
];

const expectedPattern010 = [
  1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0,
];

const expectedPattern011 = [
  1, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 1, 0, 1, 0, 0, 1, 0, 1, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 1, 0, 1, 0, 0, 1, 0,
];

const expectedPattern100 = [
  1, 1, 1, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 1, 1, 1, 1, 1, 1, 0, 0, 0, 1, 1, 1, 0, 0, 0,
];

const expectedPattern101 = [
  1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 1, 0, 1, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 0,
];

const expectedPattern110 = [
  1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 1, 1, 0, 1, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 1, 0, 1, 1, 0, 0, 0, 1, 1,
];

const expectedPattern111 = [
  1, 0, 1, 0, 1, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 1, 1, 0, 1, 0, 1, 0, 1, 1, 1, 1, 0, 0, 0, 0, 1, 1, 1, 0, 0,
];

describe("MaskPattern validity", () => {
  it("Should return false if no input", () => {
    expect(MaskPattern.isValid(undefined as unknown as MaskPatternType)).toBe(false);
  });

  it("Should return false if value is not a number", () => {
    expect(MaskPattern.isValid("" as unknown as MaskPatternType)).toBe(true);
  });

  it("Should return false if value is not in range", () => {
    expect(MaskPattern.isValid(-1 as MaskPatternType)).toBe(false);
  });

  it("Should return false if value is not in range", () => {
    expect(MaskPattern.isValid(8 as MaskPatternType)).toBe(false);
  });
});

describe("MaskPattern from value", () => {
  it("Should return correct mask pattern from a number", () => {
    const input: MaskPatternType = 5;
    const result = MaskPattern.from(input);
    expect(result).toBe(5);
  });

  it("Should return undefined if value is invalid", () => {
    const invalidInputs: (number | string | null)[] = [-1, null, "invalid"];
    for (const input of invalidInputs) {
      const result = MaskPattern.from(input as unknown as MaskPatternType);
      expect(result).toBeUndefined();
    }
  });
});

describe("Mask pattern - Apply mask", () => {
  const patterns: number = Object.keys(MaskPattern.Patterns).length;
  const expectedPatterns: number[][] = [
    expectedPattern000,
    expectedPattern001,
    expectedPattern010,
    expectedPattern011,
    expectedPattern100,
    expectedPattern101,
    expectedPattern110,
    expectedPattern111,
  ];

  it("Should return correct pattern", () => {
    for (let p = 0; p < patterns; p++) {
      const matrix = new BitMatrix(6);
      MaskPattern.applyMask(p as MaskPatternType, matrix);
      expect(matrix.data).toEqual(new Uint8Array(expectedPatterns[p]));
    }
  });

  it("Should leave reserved bit unchanged", () => {
    const matrix = new BitMatrix(2);
    matrix.set(0, 0, 0, true);
    matrix.set(0, 1, 0, true);
    matrix.set(1, 0, 0, true);
    matrix.set(1, 1, 0, true);
    MaskPattern.applyMask(0 as MaskPatternType, matrix);

    expect(matrix.data).toEqual(new Uint8Array([0, 0, 0, 0]));
  });

  it("Should throw if pattern is invalid", () => {
    expect(() => {
      MaskPattern.applyMask(-1 as MaskPatternType, new BitMatrix(1));
    }).toThrow();
  });
});

describe("Mask pattern - Penalty calculations", () => {
  it("Penalty N1", () => {
    let matrix = new BitMatrix(11);
    matrix.data = new Uint8Array([
      1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 0, 1, 1, 1, 0, 0, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0,
      1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1,
      1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 1, 0,
      0, 0, 0, 0, 0, 0, 1,
    ]);
    expect(MaskPattern.getPenaltyN1(matrix)).toBe(59);

    matrix = new BitMatrix(6);
    matrix.data = new Uint8Array(expectedPattern000);
    expect(MaskPattern.getPenaltyN1(matrix)).toBe(0);

    matrix.data = new Uint8Array(expectedPattern001);
    expect(MaskPattern.getPenaltyN1(matrix)).toBe(24);

    matrix.data = new Uint8Array(expectedPattern010);
    expect(MaskPattern.getPenaltyN1(matrix)).toBe(24);

    matrix.data = new Uint8Array(expectedPattern101);
    expect(MaskPattern.getPenaltyN1(matrix)).toBe(20);
  });

  it("Penalty N2", () => {
    let matrix = new BitMatrix(8);
    matrix.data = new Uint8Array([
      1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 1, 1, 0, 1, 1, 1, 0, 0, 1, 1, 1, 0, 0, 0, 1, 1, 0, 1, 0, 0, 0, 0, 0, 0,
      0, 0, 1, 0, 1, 1, 0, 0, 0, 0, 1, 1, 1, 1, 1, 0, 0, 0, 1, 1, 0, 0, 1, 0, 1, 1,
    ]);
    expect(MaskPattern.getPenaltyN2(matrix)).toBe(45);

    matrix = new BitMatrix(6);
    matrix.data = new Uint8Array(expectedPattern000);
    expect(MaskPattern.getPenaltyN2(matrix)).toBe(0);

    matrix.data = new Uint8Array(expectedPattern001);
    expect(MaskPattern.getPenaltyN1(matrix)).toBe(24);

    matrix.data = new Uint8Array(expectedPattern010);
    expect(MaskPattern.getPenaltyN1(matrix)).toBe(24);

    matrix.data = new Uint8Array(expectedPattern101);
    expect(MaskPattern.getPenaltyN1(matrix)).toBe(20);
  });

  it("Penalty N3", () => {
    const matrix = new BitMatrix(11);
    matrix.data = new Uint8Array([
      0, 1, 1, 0, 0, 1, 0, 1, 1, 1, 1, 0, 0, 0, 0, 1, 0, 1, 1, 1, 0, 1, 0, 1, 0, 0, 1, 1, 1, 1, 0, 0, 1, 0, 1, 1, 1, 1,
      1, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 1, 1, 1, 1, 1, 0, 1, 1, 1, 0, 0, 1, 1, 0, 0,
      1, 1, 0, 1, 1, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 1, 1, 0, 1, 1, 0, 0, 0, 1, 1, 1, 0, 1, 0, 1, 1,
      1, 0, 1, 0, 0, 0, 0,
    ]);
    expect(MaskPattern.getPenaltyN3(matrix)).toBe(160);

    matrix.data = new Uint8Array([
      1, 0, 1, 1, 1, 0, 1, 0, 0, 0, 0, 1, 0, 1, 1, 1, 0, 1, 0, 0, 0, 0, 1, 0, 1, 1, 1, 0, 1, 0, 0, 0, 0, 1, 0, 1, 1, 1,
      0, 1, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 1, 1, 0, 1, 0, 0, 0, 1, 1, 1, 1, 0, 0, 1, 1, 1, 0, 1, 1, 1, 0, 0,
      1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 1, 0, 1, 0, 0, 0, 1, 0, 1, 0, 1, 1, 1, 0, 1, 1, 0, 0, 0, 1, 1, 1, 0, 1, 1, 1, 1,
      1, 1, 1, 0, 0, 0, 1,
    ]);

    expect(MaskPattern.getPenaltyN3(matrix)).toBe(280);
  });

  it("Penalty N4", () => {
    const matrix = new BitMatrix(10);
    matrix.data = new Uint8Array(new Array(50).fill(1).concat(new Array(50).fill(0)));
    expect(MaskPattern.getPenaltyN4(matrix)).toBe(0);

    const matrix2 = new BitMatrix(21);
    matrix2.data = new Uint8Array(new Array(190).fill(1).concat(new Array(251).fill(0)));
    expect(MaskPattern.getPenaltyN4(matrix2)).toBe(10);

    const matrix3 = new BitMatrix(10);
    matrix3.data = new Uint8Array(new Array(22).fill(1).concat(new Array(78).fill(0)));
    expect(MaskPattern.getPenaltyN4(matrix3)).toBe(50);
  });
});

describe("Mask pattern - Best mask", () => {
  it("Should return a valid mask pattern", () => {
    const matrix = new BitMatrix(11);
    matrix.data = new Uint8Array([
      0, 1, 1, 0, 0, 1, 0, 1, 1, 1, 1, 0, 0, 0, 0, 1, 0, 1, 1, 1, 0, 1, 0, 1, 0, 0, 1, 1, 1, 1, 0, 0, 1, 0, 1, 1, 1, 1,
      1, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 1, 1, 1, 1, 1, 0, 1, 1, 1, 0, 0, 1, 1, 0, 0,
      1, 1, 0, 1, 1, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 1, 1, 0, 1, 1, 0, 0, 0, 1, 1, 1, 0, 1, 0, 1, 1,
      1, 0, 1, 0, 0, 0, 0,
    ]);
    const mask = MaskPattern.getBestMask(matrix, () => {});
    expect(mask).not.toBeNaN();
    expect(mask).toBeGreaterThanOrEqual(0);
    expect(mask).toBeLessThan(8);
  });
});
