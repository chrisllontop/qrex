/**
 * Helper class to handle QR Code symbol modules
 */
export class BitMatrix {
  /** Symbol size */
  size: number;
  /** Data */
  data: Uint8Array;
  /** Reserved bits */
  reservedBit: Uint8Array;

  /**
   * @param size Symbol size
   */
  constructor(size: number) {
    if (!size || size < 1) {
      throw new Error("BitMatrix size must be defined and greater than 0");
    }

    this.size = size;
    this.data = new Uint8Array(size * size);
    this.reservedBit = new Uint8Array(size * size);
  }

  /**
   * Set bit value at specified location
   * If reserved flag is set, this bit will be ignored during masking process
   */
  set(row: number, col: number, value: number, reserved?: boolean) {
    const index = row * this.size + col;
    this.data[index] = value;
    if (reserved) this.reservedBit[index] = Number(true);
  }

  /**
   * Returns bit value at specified location
   */
  get(row: number, col: number) {
    return this.data[row * this.size + col];
  }

  /**
   * Applies xor operator at specified location
   * (used during masking process)
   */
  xor(row: number, col: number, value: number) {
    this.data[row * this.size + col] ^= value;
  }

  /**
   * Check if bit at specified location is reserved
   */
  isReserved(row: number, col: number) {
    return this.reservedBit[row * this.size + col];
  }
}
