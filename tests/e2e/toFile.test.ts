import os from "node:os";
import path from "node:path";
import { afterAll, beforeAll, describe, expect, it, vi } from "vitest";
import { QRex } from "../../src/server";
import { removeNativePromise, restoreNativePromise } from "../helpers";

const defaultOptions = {
  maskPattern: 0,
};

describe("toFile - no promise available", () => {
  const fileName = path.join(os.tmpdir(), "qrimage.png");
  let originalPromise: PromiseConstructor;
  beforeAll(() => {
    originalPromise = global.Promise;
    removeNativePromise();
    global.Promise = originalPromise;
  });

  afterAll(() => {
    global.Promise = originalPromise;
    restoreNativePromise();
    global.document = undefined;
  });

  it("should throw if a callback is not a function", () => {
    try {
      const qrex: QRex = new QRex("some text", {}, defaultOptions);
      qrex.toFile(fileName);
    } catch (error) {
      expect(error.message).toBe("No valid version provided");
    }
  });
});

describe("toFile", () => {
  const fileName = path.join(os.tmpdir(), "qrimage.png");

  it("should throw if path is not provided", () => {
    const qrex: QRex = new QRex("some text");
    expect(() => qrex.toFile(fileName)).toThrow("bad maskPattern:undefined");
  });

  it("should throw if text is not provided", () => {
    const qrex: QRex = new QRex("some text");
    expect(() => qrex.toFile(fileName)).toThrow("bad maskPattern:undefined");
  });
});
