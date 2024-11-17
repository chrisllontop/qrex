import type { DeprecatedAssertionSynonyms as AssertionHandler } from "tap";

import { test } from "tap";
import toSJIS from "../../../helper/to-sjis.js";

test("SJIS from char", (t: AssertionHandler) => {
  t.notOk(toSJIS(""), "Should return undefined if character is invalid");

  t.notOk(toSJIS("A"), "Should return undefined if character is not a kanji");

  t.equal(toSJIS("襦"), 0xe640, "Should return correct SJIS value");

  t.equal(toSJIS("￢"), 0x81ca, "Should return correct SJIS value");

  t.equal(toSJIS("≧"), 0x8186, "Should return correct SJIS value");

  t.equal(toSJIS("⊥"), 0x81db, "Should return correct SJIS value");

  t.equal(toSJIS("愛"), 0x88a4, "Should return correct SJIS value");

  t.equal(toSJIS("衣"), 0x88df, "Should return correct SJIS value");

  t.equal(toSJIS("蔭"), 0x88fc, "Should return correct SJIS value");

  t.end();
});
