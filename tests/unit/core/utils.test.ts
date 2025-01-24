import { expect, it } from "vitest";
import { CoreUtils } from "../../../src/core/utils";

/**
 * QR Code sizes. Each element refers to a version
 * @type {Array}
 */
const EXPECTED_SYMBOL_SIZES = [
  21, 25, 29, 33, 37, 41, 45, 49, 53, 57, 61, 65, 69, 73, 77, 81, 85, 89, 93, 97, 101, 105, 109, 113, 117, 121, 125,
  129, 133, 137, 141, 145, 149, 153, 157, 161, 165, 169, 173, 177,
];

it("Symbol size", () => {
  expect(() => {
    CoreUtils.getSymbolSize(-1);
  }).toThrow("should be in range from 1 to 40");

  expect(() => {
    CoreUtils.getSymbolSize(0);
  }).toThrow('"version" cannot be null or undefined');

  expect(() => {
    CoreUtils.getSymbolSize(41);
  }).toThrow('"version" should be in range from 1 to 40');

  for (let i = 1; i <= 40; i++) {
    expect(CoreUtils.getSymbolSize(i)).toBe(EXPECTED_SYMBOL_SIZES[i - 1]);
  }
});

it("Symbol codewords", () => {
  for (let i = 1; i <= 40; i++) {
    expect(CoreUtils.getSymbolTotalCodewords(i)).toBeGreaterThan(0);
  }
});

it("BCH Digit", () => {
  const testData = [
    { data: 0, bch: 0 },
    { data: 1, bch: 1 },
    { data: 2, bch: 2 },
    { data: 4, bch: 3 },
    { data: 8, bch: 4 },
  ];

  for (const d of testData) {
    expect(CoreUtils.getBCHDigit(d.data)).toBe(d.bch);
  }
});

it("Set/Get SJIS function", () => {
  expect(() => {
    // @ts-ignore Testing invalid value
    CoreUtils.setToSJISFunction(-1);
  }).toThrow('"toSJISFunc" is not a valid function.');

  expect(CoreUtils.isKanjiModeEnabled()).toBe(false);

  const testFunc = (c: string) => `test_${c}`;

  CoreUtils.setToSJISFunction(testFunc);

  expect(CoreUtils.isKanjiModeEnabled()).toBe(true);
  expect(CoreUtils.toSJIS("a")).toBe("test_a");
});
