import { describe, expect, it } from "vitest";
import { BitBuffer } from "../../../src/core/bit-buffer";
import { ByteData } from "../../../src/core/byte-data";
import { Mode } from "../../../src/core/mode";

describe("Byte Data: String Input", () => {
  it("should handle string input correctly", () => {
    const text = "1234";
    const textBitLength = 32;
    const textByte = new Uint8Array([49, 50, 51, 52]);
    const utf8Text = "\u00bd + \u00bc = \u00be";

    const byteData = new ByteData(text);

    expect(byteData.mode).toBe(Mode.BYTE);
    expect(byteData.getLength()).toBe(text.length);
    expect(byteData.getBitsLength()).toBe(textBitLength);

    const bitBuffer = new BitBuffer();
    byteData.write(bitBuffer);
    expect(new Uint8Array(bitBuffer.buffer)).toEqual(textByte);

    const byteDataUtf8 = new ByteData(utf8Text);
    expect(byteDataUtf8.getLength()).toBe(12);
  });
});

describe("Byte Data: Byte Input", () => {
  it("should handle byte input correctly", () => {
    const bytes = new Uint8Array([1, 231, 32, 22]);

    const byteData = new ByteData(bytes);
    expect(byteData.getLength()).toBe(bytes.length);
    expect(byteData.getBitsLength()).toBe(bytes.length * 8);

    const bitBuffer = new BitBuffer();
    byteData.write(bitBuffer);
    expect(new Uint8Array(bitBuffer.buffer)).toEqual(bytes);
  });
});
