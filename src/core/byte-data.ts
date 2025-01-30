import type { DataMode, SegmentInterface } from "../types/qrex.type.js";
import type { BitBuffer } from "./bit-buffer.js";
import { Mode } from "./mode.js";

export class ByteData implements SegmentInterface<Uint8Array> {
  mode: DataMode;
  data: Uint8Array;
  length: number;

  constructor(data: Uint8Array | string) {
    this.mode = Mode.BYTE;
    if (typeof data === "string") {
      this.data = new TextEncoder().encode(data);
    } else {
      this.data = new Uint8Array(data);
    }
    this.length = this.data.length;
  }

  static getBitsLength(length: number) {
    return length * 8;
  }

  getLength() {
    return this.data.length;
  }

  getBitsLength() {
    return ByteData.getBitsLength(this.data.length);
  }

  write(bitBuffer: BitBuffer) {
    for (let i = 0, l = this.data.length; i < l; i++) {
      bitBuffer.put(this.data[i], 8);
    }
  }
}
