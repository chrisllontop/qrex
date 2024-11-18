import { describe, expect, it } from "vitest";
import toSJIS from "../../../helper/to-sjis";
import { BitBuffer } from "../../../src/core/bit-buffer";
import { KanjiData } from "../../../src/core/kanji-data";
import { Mode } from "../../../src/core/mode";
import { CoreUtils } from "../../../src/core/utils";

CoreUtils.setToSJISFunction(toSJIS);

describe("Kanji Data", () => {
  it("should handle valid Kanji data", () => {
    const data = "漢字漾癶";
    const length = 4;
    const bitLength = 52;
    const dataBit = [57, 250, 134, 174, 129, 134, 0];

    const kanjiData = new KanjiData(data);

    expect(kanjiData.mode).toBe(Mode.KANJI);
    expect(kanjiData.getLength()).toBe(length);
    expect(kanjiData.getBitsLength()).toBe(bitLength);

    const bitBuffer = new BitBuffer();
    kanjiData.write(bitBuffer);
    expect(bitBuffer.buffer).toEqual(dataBit);
  });

  it("should throw if data is invalid", () => {
    const kanjiData = new KanjiData("abc");
    const bitBuffer = new BitBuffer();

    expect(() => {
      kanjiData.write(bitBuffer);
    }).toThrow("Invalid SJIS character: a\nMake sure your charset is UTF-8");
  });
});
