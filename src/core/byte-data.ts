import type { DataMode } from "../types/qrex.type";
import type { BitBuffer } from "./bit-buffer";
import Mode from "./mode";

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
