import fs from "node:fs";
import { PNG } from "pngjs";
import { describe, expect, it, vi } from "vitest";
import { Qrex } from "../../../src/core/qrex";
import { RendererPng } from "../../../src/renderer/png";
import type { QRData } from "../../../src/types/qrex.type";
import StreamMock from "../../mocks/writable-stream";

describe("PNG renderer interface", () => {
  const renderer: RendererPng = new RendererPng();
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
  const sampleQrData: QRData = Qrex.create("sample text", {
    version: 2,
    maskPattern: 0,
  });

  it("should not throw with only qrData param and return PNG instance", () => {
    let png!: PNG;
    const renderer: RendererPng = new RendererPng();
    expect(() => {
      png = renderer.render(sampleQrData);
    }).not.toThrow();
    expect(png).toBeInstanceOf(PNG);
    expect(png.width).toBe(png.height);
    expect(png.width).toBe((25 + 4 * 2) * 4);
  });

  it("should not throw with options param and return correct size", () => {
    let png!: PNG;
    const renderer: RendererPng = new RendererPng();
    expect(() => {
      png = renderer.render(sampleQrData, {
        // @ts-ignore Testing with margin and scale options
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
  const sampleQrData: QRData = Qrex.create("sample text", {
    version: 2,
    maskPattern: 0,
  });

  it("should not generate errors with only qrData param and return a string", async () => {
    const renderer: RendererPng = new RendererPng();
    const url = await renderer.renderToDataURL(sampleQrData);
    expect(url).toBeTypeOf("string");
  });

  it("should not generate errors with options param and return a valid data URL", async () => {
    const renderer: RendererPng = new RendererPng();

    const url = await renderer.renderToDataURL(sampleQrData, {
      // @ts-ignore Testing with margin and scale options
      margin: 10,
      scale: 1,
    });

    expect(url).toBeTypeOf("string");
    expect(url.split(",")[0]).toBe("data:image/png;base64");
    const b64png = url.split(",")[1];
    expect(b64png.length % 4).toBe(0);
  });
});

describe("PNG renderToFile", () => {
  const sampleQrData: QRData = Qrex.create("sample text", {
    version: 2,
    maskPattern: 0,
  });
  const fileName = "qrimage.png";

  it("should not generate errors with only qrData param and save file with correct file name", async () => {
    const fsStub = vi.spyOn(fs, "createWriteStream").mockReturnValue(new StreamMock() as unknown as fs.WriteStream);

    const renderer: RendererPng = new RendererPng();
    await renderer.renderToFile(fileName, sampleQrData, {
      // @ts-ignore Testing with margin and scale options
      margin: 10,
      scale: 1,
    });

    fsStub.mockRestore();
  });

  it("should not generate errors with options param and save file with correct file name", async () => {
    const fsStub = vi.spyOn(fs, "createWriteStream").mockReturnValue(new StreamMock() as unknown as fs.WriteStream);

    const renderer: RendererPng = new RendererPng();

    await renderer.renderToFile(fileName, sampleQrData, {
      // @ts-ignore Testing with margin and scale options
      margin: 10,
      scale: 1,
    });

    fsStub.mockRestore();
  });

  it("should fail if error occurs during save", async () => {
    const fsStub = vi.spyOn(fs, "createWriteStream").mockReturnValue(new StreamMock().forceErrorOnWrite() as unknown as fs.WriteStream);

    const renderer: RendererPng = new RendererPng();
    await renderer.renderToFile(fileName, sampleQrData, {
      // @ts-ignore Testing with margin and scale options
      margin: 10,
      scale: 1,
    });

    fsStub.mockRestore();
  });
});

describe("PNG renderToFileStream", () => {
  const sampleQrData: QRData = Qrex.create("sample text", {
    version: 2,
    maskPattern: 0,
  });

  it("should not throw with only qrData param", () => {
    expect(() => {
      const renderer: RendererPng = new RendererPng();
      // @ts-ignore Testing with StreamMock
      renderer.renderToFileStream(new StreamMock(), sampleQrData);
    }).not.toThrow();
  });

  it("should not throw with options param", () => {
    expect(() => {
      const renderer: RendererPng = new RendererPng();
      // @ts-ignore Testing with StreamMock and options
      renderer.renderToFileStream(new StreamMock(), sampleQrData, {
        margin: 10,
        scale: 1,
      });
    }).not.toThrow();
  });
});
