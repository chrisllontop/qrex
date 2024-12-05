// @ts-nocheck
import fs from "node:fs";
import { describe, expect, it, vi } from "vitest";
import { QRex as QRCode } from "../../../src/core/qrex";
import { RendererUtf8 } from "../../../src/renderer/utf8";

const renderObject = new RendererUtf8();
describe("renderObject interface", () => {
  it("should have render function", () => {
    expect(typeof renderObject.render).toBe("function");
  });
});

describe("renderObject render", () => {
  const sampleQrData = QRCode.create("sample text", {
    version: 2,
    maskPattern: 0,
  });
  let str: string;

  it("should not throw with only qrData param", () => {
    expect(() => {
      str = renderObject.render(sampleQrData);
    }).not.toThrow();
  });

  it("should not throw with options param", () => {
    expect(() => {
      str = renderObject.render(sampleQrData, { margin: 10, scale: 1 });
    }).not.toThrow();
  });

  it("should return a string", () => {
    expect(typeof str).toBe("string");
  });
});

describe("renderObject renderToFile", () => {
  const sampleQrData = QRCode.create("sample text", {
    version: 2,
    maskPattern: 0,
  });
  const fileName = "qrimage.txt";

  it("should not generate errors with only qrData param", async () => {
    const fsStub = vi.spyOn(fs, "writeFile");
    fsStub.mockImplementationOnce((_, __, cb) => cb(null));

    await renderObject.renderToFile(fileName, sampleQrData, (err) => {
      expect(err).toBeNull();
      expect(fsStub).toHaveBeenCalledWith(fileName, expect.any(String), expect.any(Function));
    });

    fsStub.mockReset();
  });

  it("should not generate errors with options param", async () => {
    const fsStub = vi.spyOn(fs, "writeFile");
    fsStub.mockImplementationOnce((_, __, cb) => cb(null));

    await renderObject.renderToFile(fileName, sampleQrData, { margin: 10, scale: 1 }, (err) => {
      expect(err).toBeNull();
      expect(fsStub).toHaveBeenCalledWith(fileName, expect.any(String), expect.any(Function));
    });

    fsStub.mockReset();
  });

  it("should fail if error occurs during save", async () => {
    const fsStub = vi.spyOn(fs, "writeFile");
    fsStub.mockImplementationOnce((_, __, cb) => cb(new Error("Write failed")));

    await renderObject.renderToFile(fileName, sampleQrData, (err) => {
      expect(err).toBeInstanceOf(Error);
      expect(err.message).toBe("Write failed");
    });

    fsStub.mockReset();
  });
});
