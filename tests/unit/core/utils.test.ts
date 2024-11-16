import type { DeprecatedAssertionSynonyms as AssertionHandler } from "tap";

import { test } from "tap";
import Utils from "core/utils";


/**
 * QR Code sizes. Each element refers to a version
 * @type {Array}
 */
const EXPECTED_SYMBOL_SIZES: Array<number> = [
  21, 25, 29, 33, 37, 41, 45, 49, 53, 57, 61, 65, 69, 73, 77, 81, 85, 89, 93,
  97, 101, 105, 109, 113, 117, 121, 125, 129, 133, 137, 141, 145, 149, 153, 157,
  161, 165, 169, 173, 177,
];

test("Symbol size", (t: AssertionHandler) => {
  t.throws(() => {
    Utils.getSymbolSize();
  }, "Should throw if version is undefined");
  t.throws(() => {
    Utils.getSymbolSize(0);
  }, "Should throw if version is not in range");
  t.throws(() => {
    Utils.getSymbolSize(41);
  }, "Should throw if version is not in range");

  for (let i = 1; i <= 40; i++) {
    t.equal(
      Utils.getSymbolSize(i),
      EXPECTED_SYMBOL_SIZES[i - 1],
      "Should return correct symbol size",
    );
  }

  t.end();
});

test("Symbol codewords", (t: AssertionHandler) => {
  for (let i = 1; i <= 40; i++) {
    t.ok(Utils.getSymbolTotalCodewords(i), "Should return positive number");
  }

  t.end();
});

test("BCH Digit", (t: AssertionHandler) => {
  const testData = [
    { data: 0, bch: 0 },
    { data: 1, bch: 1 },
    { data: 2, bch: 2 },
    { data: 4, bch: 3 },
    { data: 8, bch: 4 },
  ];

  testData.forEach((d: typeof testData[0]) => {
    t.equal(
      Utils.getBCHDigit(d.data),
      d.bch,
      "Should return correct BCH for value: " + d.data,
    );
  });

  t.end();
});

test("Set/Get SJIS function", (t: Assertion) {
  t.throw(() => {
    Utils.setToSJISFunction();
  }, "Should throw if param is not a function");

  t.notOk(
    Utils.isKanjiModeEnabled(),
    'Kanji mode should be disabled if "toSJIS" function is not set',
  );

  const testFunc = testFunc(c: string) => {
    return "test_" + c;
  };

  Utils.setToSJISFunction(testFunc);

  t.ok(
    Utils.isKanjiModeEnabled(),
    'Kanji mode should be enabled if "toSJIS" function is set',
  );

  t.equal(
    Utils.toSJIS("a"),
    "test_a",
    'Should correctly call "toSJIS" function',
  );

  t.end();
});
