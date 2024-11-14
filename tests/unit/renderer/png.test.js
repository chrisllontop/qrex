import { describe, it, expect, vi } from "vitest";
import fs from "node:fs";
import { QRCode } from "../../../src/core/qrcode";
import { RendererPng } from "../../../src/renderer/png";
import { PNG } from "pngjs";
import StreamMock from "../../mocks/writable-stream";

describe("PNG renderer interface", () => {
  it("should have render function", () => {
    expect(RendererPng.render).toBeTypeOf("function");
  });

  it("should have renderToDataURL function", () => {
    expect(RendererPng.renderToDataURL).toBeTypeOf("function");
  });

  it("should have renderToFile function", () => {
    expect(RendererPng.renderToFile).toBeTypeOf("function");
  });

  it("should have renderToFileStream function", () => {
    expect(RendererPng.renderToFileStream).toBeTypeOf("function");
  });
});

describe("PNG render", () => {
  const sampleQrData = QRCode.create("sample text", {
    version: 2,
    maskPattern: 0,
  });

  it("should not throw with only qrData param and return PNG instance", () => {
    let png;
    expect(() => {
      png = RendererPng.render(sampleQrData);
    }).not.toThrow();
    expect(png).toBeInstanceOf(PNG);
    expect(png.width).toBe(png.height);
    expect(png.width).toBe((25 + 4 * 2) * 4);
  });

  it("should not throw with options param and return correct size", () => {
    let png;
    expect(() => {
      png = RendererPng.render(sampleQrData, {
        margin: 10,
        scale: 1,
      });
    }).not.toThrow();
    expect(png).toBeInstanceOf(PNG);
    expect(png.width).toBe(png.height);
    expect(png.width).toBe(25 + 10 * 2);
  });
});

describe("PNG renderToDataURL", () => {
  const sampleQrData = QRCode.create("sample text", {
    version: 2,
    maskPattern: 0,
  });

  it("should not generate errors with only qrData param and return a string", async () => {
    const url = await new Promise((resolve, reject) => {
      RendererPng.renderToDataURL(sampleQrData, (err, url) => {
        if (err) reject(err);
        else resolve(url);
      });
    });
    expect(url).toBeTypeOf("string");
  });

  it("should not generate errors with options param and return a valid data URL", async () => {
    const url = await new Promise((resolve, reject) => {
      RendererPng.renderToDataURL(
        sampleQrData,
        { margin: 10, scale: 1 },
        (err, url) => {
          if (err) reject(err);
          else resolve(url);
        }
      );
    });

    expect(url).toBeTypeOf("string");
    expect(url.split(",")[0]).toBe("data:image/png;base64");
    const b64png = url.split(",")[1];
    expect(b64png.length % 4).toBe(0);
  });
});

describe("PNG renderToFile", () => {
  const sampleQrData = QRCode.create("sample text", {
    version: 2,
    maskPattern: 0,
  });
  const fileName = "qrimage.png";

  it("should not generate errors with only qrData param and save file with correct file name", async () => {
    const fsStub = vi
      .spyOn(fs, "createWriteStream")
      .mockReturnValue(new StreamMock());

    await new Promise((resolve, reject) => {
      RendererPng.renderToFile(fileName, sampleQrData, (err) => {
        try {
          expect(err).toBeFalsy();
          expect(fsStub).toHaveBeenCalledWith(fileName);
          resolve();
        } catch (e) {
          reject(e);
        }
      });
    });

    fsStub.mockRestore();
  });

  it("should not generate errors with options param and save file with correct file name", async () => {
    const fsStub = vi
      .spyOn(fs, "createWriteStream")
      .mockReturnValue(new StreamMock());

    await new Promise((resolve, reject) => {
      RendererPng.renderToFile(
        fileName,
        sampleQrData,
        { margin: 10, scale: 1 },
        (err) => {
          try {
            expect(err).toBeFalsy();
            expect(fsStub).toHaveBeenCalledWith(fileName);
            resolve();
          } catch (e) {
            reject(e);
          }
        }
      );
    });

    fsStub.mockRestore();
  });

  it("should fail if error occurs during save", async () => {
    const fsStub = vi
      .spyOn(fs, "createWriteStream")
      .mockReturnValue(new StreamMock().forceErrorOnWrite());

    await new Promise((resolve, reject) => {
      RendererPng.renderToFile(fileName, sampleQrData, (err) => {
        try {
          expect(err).toBeTruthy();
          resolve();
        } catch (e) {
          reject(e);
        }
      });
    });

    fsStub.mockRestore();
  });
});

describe("PNG renderToFileStream", () => {
  const sampleQrData = QRCode.create("sample text", {
    version: 2,
    maskPattern: 0,
  });

  it("should not throw with only qrData param", () => {
    expect(() => {
      RendererPng.renderToFileStream(new StreamMock(), sampleQrData);
    }).not.toThrow();
  });

  it("should not throw with options param", () => {
    expect(() => {
      RendererPng.renderToFileStream(new StreamMock(), sampleQrData, {
        margin: 10,
        scale: 1,
      });
    }).not.toThrow();
  });
});
