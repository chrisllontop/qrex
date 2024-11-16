import { NUMERIC } from "./mode";
import { BitBuffer } from "./bit-buffer";
import { type Mode } from "qrcode";

class NumericData {
  mode: Mode;
  data: string;

  getLength!: () => number;
  getBitsLength!: () => number;
  write!: (bitBuffer: BitBuffer) => void;

  constructor(data: string) {
    this.data = data;
    this.mode = NUMERIC;
  }

  static getBitsLength(length) {
    return 10 * Math.floor(length / 3) + (length % 3 ? (length % 3) * 3 + 1 : 0);
  }

}

NumericData.prototype.getLength = function getLength() {
  return this.data.length;
}

NumericData.prototype.getBitsLength = function getBitsLength() {
  return NumericData.getBitsLength(this.data.length);
}

NumericData.prototype.write = function write(bitBuffer: BitBuffer): void {
  let i, group, value;

  // The input data string is divided into groups of three digits,
  // and each group is converted to its 10-bit binary equivalent.
  for (i = 0; i + 3 <= this.data.length; i += 3) {
    group = this.data.substr(i, 3);
    value = Number.parseInt(group, 10);

    bitBuffer.put(value, 10);
  }

  // If the number of input digits is not an exact multiple of three,
  // the final one or two digits are converted to 4 or 7 bits respectively.
  const remainingNum = this.data.length - i;
  if (remainingNum > 0) {
    group = this.data.substr(i);
    value = Number.parseInt(group, 10);

    bitBuffer.put(value, remainingNum * 3 + 1);
  }
};

export default NumericData;
