import { describe, it, expect, vi } from "vitest";
import fs from "node:fs";
import { QRCode } from "../../../src/core/qrcode";
import { RendererUtf8 } from "../../../src/renderer/utf8";

describe("RendererUtf8 interface", () => {
  it("should have render function", () => {
    expect(typeof RendererUtf8.render).toBe("function");
  });
});

describe("RendererUtf8 render", () => {
  const sampleQrData = QRCode.create("sample text", {
    version: 2,
    maskPattern: 0,
  });
  let str;

  it("should not throw with only qrData param", () => {
    expect(() => {
      str = RendererUtf8.render(sampleQrData);
    }).not.toThrow();
  });

  it("should not throw with options param", () => {
    expect(() => {
      str = RendererUtf8.render(sampleQrData, { margin: 10, scale: 1 });
    }).not.toThrow();
  });

  it("should return a string", () => {
    expect(typeof str).toBe("string");
  });
});

describe("RendererUtf8 renderToFile", () => {
  const sampleQrData = QRCode.create("sample text", {
    version: 2,
    maskPattern: 0,
  });
  const fileName = "qrimage.txt";

  it("should not generate errors with only qrData param", async () => {
    const fsStub = vi.spyOn(fs, "writeFile");
    fsStub.mockImplementationOnce((_, __, cb) => cb(null));

    await RendererUtf8.renderToFile(fileName, sampleQrData, (err) => {
      expect(err).toBeNull();
      expect(fsStub).toHaveBeenCalledWith(
        fileName,
        expect.any(String),
        expect.any(Function)
      );
    });

    fsStub.mockReset();
  });

  it("should not generate errors with options param", async () => {
    const fsStub = vi.spyOn(fs, "writeFile");
    fsStub.mockImplementationOnce((_, __, cb) => cb(null));

    await RendererUtf8.renderToFile(
      fileName,
      sampleQrData,
      { margin: 10, scale: 1 },
      (err) => {
        expect(err).toBeNull();
        expect(fsStub).toHaveBeenCalledWith(
          fileName,
          expect.any(String),
          expect.any(Function)
        );
      }
    );

    fsStub.mockReset();
  });

  it("should fail if error occurs during save", async () => {
    const fsStub = vi.spyOn(fs, "writeFile");
    fsStub.mockImplementationOnce((_, __, cb) => cb(new Error("Write failed")));

    await RendererUtf8.renderToFile(fileName, sampleQrData, (err) => {
      expect(err).toBeInstanceOf(Error);
      expect(err.message).toBe("Write failed");
    });

    fsStub.mockReset();
  });
});
