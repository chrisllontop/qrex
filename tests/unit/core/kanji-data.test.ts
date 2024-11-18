import type { DeprecatedAssertionSynonyms as AssertionHandler } from "tap";

import { test } from "tap";
import BitBuffer from "core/bit-buffer";
import KanjiData from "core/kanji-data";
import Mode from "core/mode";
import toSJIS from "helper/to-sjis";
import Utils from "core/utils";

Utils.setToSJISFunction(toSJIS);

test("Kanji Data", (t: AssertionHandler) => {
  const data = "漢字漾癶";
  const length = 4;
  const bitLength = 52; // length * 13

  const dataBit = [57, 250, 134, 174, 129, 134, 0];

  let kanjiData = new KanjiData(data);

  t.equal(kanjiData.mode, Mode.KANJI, "Mode should be KANJI");
  t.equal(kanjiData.getLength(), length, "Should return correct length");
  t.equal(
    kanjiData.getBitsLength(),
    bitLength,
    "Should return correct bit length",
  );

  let bitBuffer = new BitBuffer();
  kanjiData.write(bitBuffer);
  t.deepEqual(bitBuffer.buffer, dataBit, "Should write correct data to buffer");

  kanjiData = new KanjiData("abc");
  bitBuffer = new BitBuffer();
  t.throw(function() {
    kanjiData.write(bitBuffer);
  }, "Should throw if data is invalid");

  t.end();
});
