import { describe, expect, it } from "vitest";
import { QRex } from "../../../src/core/qrex";
import { RendererUtf8 } from "../../../src/renderer/utf8";

const renderer: RendererUtf8 = new RendererUtf8();
describe("RendererUtf8 interface", () => {
  it("should have render function", () => {
    expect(typeof renderer.render).toBe("function");
  });
});

describe("RendererUtf8 render", () => {
  const sampleQrData = QRex.create("sample text", {
    version: 2,
    maskPattern: 0,
  });
  let str: string;

  it("should not throw with only qrData param", () => {
    expect(() => {
      str = renderer.render(sampleQrData);
    }).not.toThrow();
  });

  it("should not throw with options param", () => {
    expect(() => {
      // @ts-ignore TODO - Improve types in QRex options
      str = renderer.render(sampleQrData, { margin: 10, scale: 1 });
    }).not.toThrow();
  });

  it("should return a string", () => {
    expect(typeof str).toBe("string");
  });
});
