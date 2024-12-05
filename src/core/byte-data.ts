import type { DataMode } from "../types/qrex.type.js";
import type { BitBuffer } from "./bit-buffer.js";
import Mode from "./mode.js";

export class ByteData {
  mode: DataMode;
  data: Uint8Array;
  length: number;

  constructor(data: string | Uint8Array) {
    this.mode = Mode.BYTE;
    if (typeof data === "string") {
      this.data = new TextEncoder().encode(data);
    } else {
      this.data = new Uint8Array(data);
    }
    this.length = this.data?.length ?? 0;
  }

  static getBitsLength(length: number): number {
    return length * 8;
  }

  getLength(): number {
    return this.data.length;
  }

  write(bitBuffer: BitBuffer): void {
    for (let i = 0, l = this.data.length; i < l; i++) {
      bitBuffer.put(this.data[i], 8);
    }
  }

  getBitsLength(): number {
    return ByteData.getBitsLength(this.data.length);
  }
}
