import { describe, expect, it, vi } from "vitest";
import { QRex } from "../../src/server";

const defaultOptions = {
  maskPattern: 0,
  errorCorrectionLevel: "L",
};
describe("toFileStream", () => {
  it("should throw if stream is not provided", () => {
    const qrex: QRex = new QRex("some text");
    expect(() => qrex.toFileStream(defaultOptions)).toThrow("bad maskPattern:undefined");
  });
});
