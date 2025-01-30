import { describe, expect, it, afterEach } from "vitest";
import { Qrex } from "../../../src/core/qrex.js";
import { RendererUtf8 } from "../../../src/renderer/utf8.js";
import * as fs from "node:fs";

const renderer: RendererUtf8 = new RendererUtf8();
describe("RendererUtf8 interface", () => {
  it("should have render function", () => {
    expect(typeof renderer.render).toBe("function");
  });
});

describe("RendererUtf8 renderToFile", () => {
  const testFilePath = "test-qr.txt";
  const sampleQrData = Qrex.create("sample text", {
    version: 2,
    maskPattern: 0,
  });

  afterEach(() => {
    // Cleanup test file after each test
    if (fs.existsSync(testFilePath)) {
      fs.unlinkSync(testFilePath);
    }
  });

  it("should write QR code to file", () => {
    renderer.renderToFile(testFilePath, sampleQrData);
    expect(fs.existsSync(testFilePath)).toBe(true);
    const fileContent = fs.readFileSync(testFilePath, "utf8");
    expect(typeof fileContent).toBe("string");
    expect(fileContent.length).toBeGreaterThan(0);
  });
});

describe("RendererUtf8 render", () => {
  const sampleQrData = Qrex.create("sample text", {
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
      // @ts-ignore TODO - Improve types in Qrex options
      str = renderer.render(sampleQrData, { margin: 10, scale: 1 });
    }).not.toThrow();
  });

  it("should return a string", () => {
    expect(typeof str).toBe("string");
  });

  it("should use inverted block chars when dark color is white", () => {
    const str = renderer.render(sampleQrData, {
      color: {
        dark: "#ffffff",
        light: "#000000",
      },
    });
    expect(typeof str).toBe("string");
    expect(str).toContain("█"); // Should contain inverted full block
  });
});
