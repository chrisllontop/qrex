import { describe, expect, it } from "vitest";
import { BitMatrix } from "../../../src/core/bit-matrix";
import { MaskPattern } from "../../../src/core/mask-pattern";
import type { MaskPatternType } from "../../../src/types/qrex.type";

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
    expect(MaskPattern.isValid()).toBe(false);
  });

  it("Should return false if value is not a number", () => {
    expect(MaskPattern.isValid("")).toBe(false);
  });

  it("Should return false if value is not in range", () => {
    //@ts-ignore
    expect(MaskPattern.isValid(-1)).toBe(false);
  });
  it("Should return false if value is not in range", () => {
    //@ts-ignore
    expect(MaskPattern.isValid(8)).toBe(false);
  });
});

describe("MaskPattern from value", () => {
  it("Should return correct mask pattern from a number", () => {
    expect(MaskPattern.from(5)).toBe(5);
  });

  it("Should return correct mask pattern from a string", () => {
    expect(MaskPattern.from("5")).toBe(5);
  });

  it("Should return undefined if value is invalid", () => {
    //@ts-ignore
    expect(MaskPattern.from(-1)).toBeUndefined();
    //@ts-ignore
    expect(MaskPattern.from(null)).toBeUndefined();
  });
});

describe("Mask pattern - Apply mask", () => {
  const patterns = Object.keys(MaskPattern.Patterns).length;
  const expectedPatterns = [
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
    matrix.set(0, 0, false, true);
    matrix.set(0, 1, false, true);
    matrix.set(1, 0, false, true);
    matrix.set(1, 1, false, true);
    MaskPattern.applyMask(0, matrix);
    //@ts-ignore
    expect(matrix.data).toEqual(new Uint8Array([false, false, false, false]));
  });

  it("Should throw if pattern is invalid", () => {
    expect(() => {
      //@ts-ignore
      MaskPattern.applyMask(-1, new BitMatrix(1));
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
    const matrix: BitMatrix = new BitMatrix(11);
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
