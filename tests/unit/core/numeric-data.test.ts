import type { DeprecatedAssertionSynonyms as AssertionHandler } from "tap";

import { test } from "tap";
import BitBuffer from "../../../src/core/bit-buffer.js";
import Numericdata from "../../../src/core/numeric-data.js";
import Mode from "../../../src/core/mode.js";

type MockMode = {
  data: string;
  length: number;
  bitLength: number;
  dataBit: Array<number>;
};

const testData: Array<MockMode> = [
  {
    data: 8,
    length: 1,
    bitLength: 4,
    dataBit: [128],
  },
  {
    data: 16,
    length: 2,
    bitLength: 7,
    dataBit: [32],
  },
  {
    data: 128,
    length: 3,
    bitLength: 10,
    dataBit: [32, 0],
  },
  {
    data: 12345,
    length: 5,
    bitLength: 17,

    // (123)d -> (0001111011)b 10bit
    //  (45)d ->    (0101101)b  7bit
    //
    //  (00011110)b -> (30)d
    //  (11010110)b -> (214)d
    //  (10000000)b -> (128)d
    dataBit: [30, 214, 128],
  },
];

test("Numeric Data", (t: AssertionHandler) => {
  testData.forEach(function(data) {
    const numericData = new NumericData(data.data);

    t.equal(numericData.mode, Mode.NUMERIC, "Mode should be NUMERIC");
    t.equal(
      numericData.getLength(),
      data.length,
      "Should return correct length",
    );
    t.equal(
      numericData.getBitsLength(),
      data.bitLength,
      "Should return correct bit length",
    );

    const bitBuffer = new BitBuffer();
    numericData.write(bitBuffer);
    t.deepEqual(
      bitBuffer.buffer,
      data.dataBit,
      "Should write correct data to buffer",
    );
  });

  t.end();
});
