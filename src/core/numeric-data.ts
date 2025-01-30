import type { DataMode, SegmentInterface } from "../types/qrex.type.js";
import type { BitBuffer } from "./bit-buffer.js";
import { Mode } from "./mode.js";

class NumericData implements SegmentInterface {
  mode: DataMode;
  data: string;
  length: number;

  constructor(data: string | number) {
    this.mode = Mode.NUMERIC;
    this.data = data?.toString();
    this.length = this.data?.length ?? 0;
  }

  static getBitsLength(length: number): number {
    return 10 * Math.floor(length / 3) + (length % 3 ? (length % 3) * 3 + 1 : 0);
  }

  getLength(): number {
    return this.length;
  }

  getBitsLength(): number {
    return NumericData.getBitsLength(this.length);
  }

  write(bitBuffer: BitBuffer): void {
    let i: number;
    let group: string;
    let value: number;

    // The input data string is divided into groups of three digits,
    // and each group is converted to its 10-bit binary equivalent.
    for (i = 0; i + 3 <= this.length; i += 3) {
      group = this.data.substr(i, 3);
      value = Number.parseInt(group, 10);

      bitBuffer.put(value, 10);
    }

    // If the number of input digits is not an exact multiple of three,
    // the final one or two digits are converted to 4 or 7 bits respectively.
    const remainingNum = this.length - i;
    if (remainingNum > 0) {
      group = this.data.substr(i);
      value = Number.parseInt(group, 10);

      bitBuffer.put(value, remainingNum * 3 + 1);
    }
  }
}

export default NumericData;
