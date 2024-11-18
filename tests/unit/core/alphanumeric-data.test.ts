import type { DeprecatedAssertionSynonyms as AssertionHandler } from "tap";

import { test } from "tap";
import Mode from "../../../src/core/mode.js";
import BitBuffer from ".../../../src/core/bit-buffer.js";
import AlphaNumericData from "../../../src/core/alphanumeric-data.js";

type MockMode = {
  data: string;
  length: number;
  bitLength: number;
  dataBit: Array<number>;
}

const testData: Array<MockMode> = [
  {
    data: "A",
    length: 1,
    bitLength: 6,
    dataBit: [40],
  },
  {
    data: "AB",
    length: 2,
    bitLength: 11,
    dataBit: [57, 160],
  },
  {
    data: "ABC12",
    length: 5,
    bitLength: 28,
    dataBit: [57, 168, 116, 32],
  },
];

test("Alphanumeric Data", (t: AsssertionHandler) => {
  testData.forEach((data: MockMode) => {
    const alphanumericData = new AlphanumericData(data.data);

    t.equal(
      alphanumericData.mode,
      Mode.ALPHANUMERIC,
      "Mode should be ALPHANUMERIC",
    );
    t.equal(
      alphanumericData.getLength(),
      data.length,
      "Should return correct length",
    );
    t.equal(
      alphanumericData.getBitsLength(),
      data.bitLength,
      "Should return correct bit length",
    );

    const bitBuffer = new BitBuffer();
    alphanumericData.write(bitBuffer);
    t.same(
      bitBuffer.buffer,
      data.dataBit,
      "Should write correct data to buffer",
    );
  });

  t.end();
});
