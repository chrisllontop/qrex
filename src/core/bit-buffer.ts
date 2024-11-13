export class BitBuffer {
<<<<<<< HEAD
=======
  length: number;
  buffer: number[];

>>>>>>> efb7136 (Iterative typing phase one)
  constructor() {
    this.buffer = [];
    this.length = 0;
  }

<<<<<<< HEAD
  get(index) {
=======
  get(index: number): number {
>>>>>>> efb7136 (Iterative typing phase one)
    const bufIndex = Math.floor(index / 8);
    return ((this.buffer[bufIndex] >>> (7 - (index % 8))) & 1) === 1;
  }

<<<<<<< HEAD
  put(num, length) {
=======
  put(num: number, length: number): void {
>>>>>>> efb7136 (Iterative typing phase one)
    for (let i = 0; i < length; i++) {
      this.putBit(((num >>> (length - i - 1)) & 1) === 1);
    }
  }

<<<<<<< HEAD
  getLengthInBits() {
    return this.length;
  }

  putBit(bit) {
    const bufIndex = Math.floor(this.length / 8);
=======
  getLengthInBits(): number {
    return this.length;
  }

  putBit(bit: number | undefined): void {
    const bufIndex = Math.floor(this.length / 8);

>>>>>>> efb7136 (Iterative typing phase one)
    if (this.buffer.length <= bufIndex) {
      this.buffer.push(0);
    }

    if (bit) {
      this.buffer[bufIndex] |= 0x80 >>> (this.length % 8);
    }

    this.length++;
  }

}
