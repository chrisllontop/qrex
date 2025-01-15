import { describe, expect, it, vi } from "vitest";
import { Qrex } from "../../src/qrex";

const defaultOptions = {
  maskPattern: 0,
  errorCorrectionLevel: "L",
};
describe("toFileStream", () => {
  it("should throw if stream is not provided", () => {
    const qrex: Qrex = new Qrex("some text");
    expect(() => qrex.toFileStream(defaultOptions)).toThrow("bad maskPattern:undefined");
  });
});
