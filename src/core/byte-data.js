import { Mode } from "./mode";

export class ByteData {
  constructor(data) {
    this.mode = Mode.BYTE;
    if (typeof data === "string") {
      this.data = new TextEncoder().encode(data);
    } else {
      this.data = new Uint8Array(data);
    }
  }

  static getBitsLength(length) {
    return length * 8;
  }

  getLength() {
    return this.data.length;
  }

  write(bitBuffer) {
    for (let i = 0, l = this.data.length; i < l; i++) {
      bitBuffer.put(this.data[i], 8);
    }
  }
}

ByteData.prototype.getBitsLength = function getBitsLength() {
  return ByteData.getBitsLength(this.data.length);
};
