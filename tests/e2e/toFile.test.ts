import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { afterAll, beforeAll, describe, expect, it, vi } from "vitest";
import { Qrex } from "../../src/qrex.js";
import { removeNativePromise, restoreNativePromise } from "../helpers.js";
import type { MaskPatternType } from "../../src/types/qrex.type.js";

const defaultOptions = {
  maskPattern: 0 as MaskPatternType,
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
    // @ts-ignore Testing in Node environment
    global.document = undefined;
    // Clean up test file if it exists
    if (fs.existsSync(fileName)) {
      fs.unlinkSync(fileName);
    }
  });

  it("should throw if a callback is not a function", () => {
    try {
      const qrex: Qrex = new Qrex("some text", defaultOptions);
      qrex.toFile(fileName);
    } catch (error) {
      // @ts-ignore Testing for error message
      expect(error.message).toBe("No valid version provided");
    }
  });
});

describe("toFile", () => {
  const fileName = path.join(os.tmpdir(), "qrimage.png");

  afterAll(() => {
    // Clean up test file if it exists
    if (fs.existsSync(fileName)) {
      fs.unlinkSync(fileName);
    }
  });

  it("should throw if path is not provided", () => {
    const qrex: Qrex = new Qrex("some text");
    expect(() => qrex.toFile(fileName)).toThrow("bad maskPattern:undefined");
  });

  it("should throw if text is not provided", () => {
    const qrex: Qrex = new Qrex("some text");
    expect(() => qrex.toFile(fileName)).toThrow("bad maskPattern:undefined");
  });
});
