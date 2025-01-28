import type { DataMode, SegmentInterface } from "../types/qrex.type";
import type { BitBuffer } from "./bit-buffer";
import { Mode } from "./mode";
import { CoreUtils } from "./utils";

export class KanjiData implements SegmentInterface {
  mode: DataMode;
  data: string;
  length: number;

  constructor(data: string) {
    this.mode = Mode.KANJI;
    this.data = data;
    this.length = this.data?.length ?? 0;
  }

  static getBitsLength(length: number): number {
    return length * 13;
  }

  getLength(): number {
    return this.data.length;
  }

  getBitsLength(): number {
    return KanjiData.getBitsLength(this.data.length);
  }

  write(bitBuffer: BitBuffer): void {
    // In the Shift JIS system, Kanji characters are represented by a two byte combination.
    // These byte values are shifted from the JIS X 0208 values.
    // JIS X 0208 gives details of the shift coded representation.
    for (let i = 0; i < this.data.length; i++) {
      let value = CoreUtils.toSJIS(this.data[i]);

      // For characters with Shift JIS values from 0x8140 to 0x9FFC:
      if (value && value >= 0x8140 && value <= 0x9ffc) {
        // Subtract 0x8140 from Shift JIS value
        value -= 0x8140;

        // For characters with Shift JIS values from 0xE040 to 0xEBBF:
      } else if (value && value >= 0xe040 && value <= 0xebbf) {
        // Subtract 0xC140 from Shift JIS value
        value -= 0xc140;
      } else {
        throw new Error(
          `Invalid SJIS character: ${this.data[i]}
Make sure your charset is UTF-8`,
        );
      }

      // Multiply most significant byte of result by 0xC0
      // and add least significant byte to product
      value = ((value >>> 8) & 0xff) * 0xc0 + (value & 0xff);

      // Convert result to a 13-bit binary string
      bitBuffer.put(value, 13);
    }
  }
}
