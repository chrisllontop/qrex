import { describe, expect, it } from "vitest";
import { Qrex } from "../../src/qrex";

const defaultOptions = {
  maskPattern: 0,
  errorCorrectionLevel: "L",
};

describe("toFileStream", () => {
  it("should throw if stream is not provided", () => {
    const qrex: Qrex = new Qrex("some text");
    // @ts-ignore Testing missing required parameters
    expect(() => qrex.toFileStream(undefined, defaultOptions)).toThrow("bad maskPattern:undefined");
  });
});
