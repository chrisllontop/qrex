import type { DeprecatedAssertionSynonyms as AssertionHandler } from "tap";

import { test } from "tap";
import BitBuffer from ".../../../src/core/bit-buffer.js";
import Utils from "../../../src/core/utils.js";
import Version from "../../../src/core/version.js";
import ECLevel from "../../../src/core/error-correction-level.js";
import ECCode from "../../../src/core/error-correction-code.js";
import Mode from "../../../src/core/mode.js";

test("Error correction codewords", (t: AssertionHandler) => {
  const levels = [ECLevel.L, ECLevel.M, ECLevel.Q, ECLevel.H];

  for (let v = 1; v <= 40; v++) {
    const totalCodewords = Utils.getSymbolTotalCodewords(v);
    const reservedByte = Math.ceil(
      (Mode.getCharCountIndicator(Mode.BYTE, v) + 4) / 8,
    );

    for (let l = 0; l < levels.length; l++) {
      const dataCodewords =
        Version.getCapacity(v, levels[l], Mode.BYTE) + reservedByte;

      const expectedCodewords = totalCodewords - dataCodewords;

      t.equal(
        ECCode.getTotalCodewordsCount(v, levels[l]),
        expectedCodewords,
        "Should return correct codewords number",
      );
    }
  }

  t.equal(
    ECCode.getTotalCodewordsCount(1),
    undefined,
    "Should return undefined if EC level is not specified",
  );

  t.end();
});

test("Error correction blocks", (t: AssertionHandler) => {
  const levels = [ECLevel.L, ECLevel.M, ECLevel.Q, ECLevel.H];

  for (let v = 1; v <= 40; v++) {
    for (let l = 0; l < levels.length; l++) {
      t.ok(
        ECCode.getBlocksCount(v, levels[l]),
        "Should return a positive number",
      );
    }
  }

  t.equal(
    ECCode.getBlocksCount(1),
    undefined,
    "Should return undefined if EC level is not specified",
  );

  t.end();
});
