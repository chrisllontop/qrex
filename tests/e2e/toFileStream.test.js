import { describe, it, expect, vi } from "vitest";
import { toFileStream } from "../../src/index.js";
import StreamMock from "../mocks/writable-stream";

const defaultOptions = {
  maskPattern: 0,
  errorCorrectionLevel: "L",
};
describe("toFileStream", () => {
  it("should throw if stream is not provided", () => {
    expect(() => toFileStream("some text")).toThrow(
      "Too few arguments provided"
    );
  });

  it("should throw if text is not provided", () => {
    expect(() => toFileStream(new StreamMock())).toThrow(
      "Too few arguments provided"
    );
  });

  it("should not call error event", () => {
    const fstream = new StreamMock();
    const spy = vi.spyOn(fstream, "emit");

    toFileStream(fstream, "i am a pony!", defaultOptions);
    toFileStream(fstream, "i am a pony!", {
      ...defaultOptions,
      type: "image/png",
    });

    expect(spy).not.toHaveBeenCalledWith("error");

    spy.mockRestore();
  });
});

describe("toFileStream png with write error", () => {
  it("should return an error on write error", async () => {
    const fstreamErr = new StreamMock().forceErrorOnWrite();
    const errorPromise = new Promise((resolve) => {
      fstreamErr.on("error", (e) => {
        resolve(e);
      });
    });

    toFileStream(fstreamErr, "i am a pony!");

    const error = await errorPromise;
    expect(error).toBeDefined();
  });
});

describe("toFileStream png with qrcode error", () => {
  it("should return an error on qrcode error", async () => {
    const fstreamErr = new StreamMock();
    const bigString = Array(200).join("i am a pony!");
    const errorPromise = new Promise((resolve) => {
      fstreamErr.on("error", (e) => {
        resolve(e);
      });
    });

    toFileStream(fstreamErr, bigString);
    toFileStream(fstreamErr, "i am a pony!", {
      version: 1,
      errorCorrectionLevel: "H",
    });

    const error = await errorPromise;
    expect(error).toBeDefined();
  });
});
