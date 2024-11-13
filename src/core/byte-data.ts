import { BYTE, type Mode } from "./mode";

export class ByteData {
  mode: Mode;
  data: number[];

  constructor(data: number[] | string) {
    this.mode = Mode.BYTE;
    if (typeof data === 'string') {
      this.data = new TextEncoder().encode(data);
    } else {
      this.data = new Uint8Array(data);
    }
  }

  static getBitsLength(length: number): number {
    return length * 8;
  }

  getLength(): number {
    return this.data.length;
  }

  write(bitBuffer: Buffers): void {
    for (let i = 0, l = this.data.length; i < l; i++) {
      bitBuffer.put(this.data[i], 8);
    }
  }
}

ByteData.prototype.getBitsLength = function getBitsLength() {
  return ByteData.getBitsLength(this.data.length);
}
