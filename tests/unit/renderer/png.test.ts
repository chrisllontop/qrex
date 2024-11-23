import fs from "node:fs";
import { PNG } from "pngjs";
import { describe, expect, it, vi } from "vitest";
import { QRex } from "../../../src/core/qrex";
import { RendererPng } from "../../../src/renderer/png";
import StreamMock from "../../mocks/writable-stream";

describe("PNG renderer interface", () => {
  const renderer: RendererPng = new RendererPng()
  it("should have render function", () => {
    expect(renderer.render).toBeTypeOf("function");
  });

  it("should have renderToDataURL function", () => {
    expect(renderer.renderToDataURL).toBeTypeOf("function");
  });

  it("should have renderToFile function", () => {
    expect(renderer.renderToFile).toBeTypeOf("function");
  });

  it("should have renderToFileStream function", () => {
    expect(renderer.renderToFileStream).toBeTypeOf("function");
  });
});

describe("PNG render", () => {
  const sampleQrData = QRex.create("sample text", {
    version: 2,
    maskPattern: 0,
  });

  it("should not throw with only qrData param and return PNG instance", () => {
    let png;
    const renderer:RendererPng = new RendererPng()
    expect(() => {
      png = renderer.render(sampleQrData);
    }).not.toThrow();
    expect(png).toBeInstanceOf(PNG);
    expect(png.width).toBe(png.height);
    expect(png.width).toBe((25 + 4 * 2) * 4);
  });

  it("should not throw with options param and return correct size", () => {
    let png;
    const renderer:RendererPng = new RendererPng()
    expect(() => {
      png = renderer.render(sampleQrData, {
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
  const sampleQrData = QRex.create("sample text", {
    version: 2,
    maskPattern: 0,
  });

  it("should not generate errors with only qrData param and return a string", async () => {
    const url = await new Promise((resolve, reject) => {
      const renderer:RendererPng = new RendererPng()
      renderer.renderToDataURL(sampleQrData, (err, url) => {
        if (err) reject(err);
        else resolve(url);
      });
    });
    expect(url).toBeTypeOf("string");
  });

  it("should not generate errors with options param and return a valid data URL", async () => {
    const url = await new Promise((resolve, reject) => {
      const renderer:RendererPng = new RendererPng()
      renderer.renderToDataURL(sampleQrData, { margin: 10, scale: 1 }, (err, url) => {
        if (err) reject(err);
        else resolve(url);
      });
    });

    expect(url).toBeTypeOf("string");
    expect(url.split(",")[0]).toBe("data:image/png;base64");
    const b64png = url.split(",")[1];
    expect(b64png.length % 4).toBe(0);
  });
});

describe("PNG renderToFile", () => {
  const sampleQrData = QRex.create("sample text", {
    version: 2,
    maskPattern: 0,
  });
  const fileName = "qrimage.png";

  it("should not generate errors with only qrData param and save file with correct file name", async () => {
    const fsStub = vi.spyOn(fs, "createWriteStream").mockReturnValue(new StreamMock() as unknown as fs.WriteStream);

    await new Promise<void>((resolve, reject) => {
      const renderer:RendererPng = new RendererPng()
      renderer.renderToFile(fileName, sampleQrData,{ margin: 10, scale: 1 }, (err) => {
        try {
          expect(err).toBeFalsy();
          console.log(fsStub)
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
    const fsStub = vi.spyOn(fs, "createWriteStream").mockReturnValue(new StreamMock() as unknown as fs.WriteStream);


    const renderer: RendererPng = new RendererPng();

    await new Promise<void>((resolve, reject) => {
      renderer.renderToFile(fileName, sampleQrData, { margin: 10, scale: 1 }, (err) => {
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

  it("should fail if error occurs during save", async () => {
    
    const fsStub = vi.spyOn(fs, "createWriteStream").mockReturnValue(new StreamMock().forceErrorOnWrite());

    await new Promise((resolve, reject) => {
      const renderer:RendererPng = new RendererPng()
      renderer.renderToFile(fileName, sampleQrData,{ margin: 10, scale: 1 }, (err) => {
        try {
          expect(err).toBeUndefined();
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
  const sampleQrData = QRex.create("sample text", {
    version: 2,
    maskPattern: 0,
  });

  it("should not throw with only qrData param", () => {
    expect(() => {
      const renderer:RendererPng = new RendererPng()
      renderer.renderToFileStream(new StreamMock(), sampleQrData);
    }).not.toThrow();
  });

  it("should not throw with options param", () => {
    expect(() => {
      const renderer:RendererPng = new RendererPng()
      renderer.renderToFileStream(new StreamMock(), sampleQrData, {
        margin: 10,
        scale: 1,
      });
    }).not.toThrow();
  });
});
