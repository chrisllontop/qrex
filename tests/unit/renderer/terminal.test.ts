// @ts-nocheck
import { describe, expect, it } from "vitest";
import { QRex as QRCode } from "../../../src/core/qrex";
import { RendererTerminal } from "../../../src/renderer/terminal";

const renderObject = new RendererTerminal();
describe("renderObject interface", () => {
  it("should have render function", () => {
    expect(typeof renderObject.render).toBe("function");
  });
});

describe("renderObject render big", () => {
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

  it("should not throw with inverse options", () => {
    expect(() => {
      str = renderObject.render(sampleQrData, { inverse: true });
    }).not.toThrow();
  });

  it("should return a string if inverse option is set", () => {
    expect(typeof str).toBe("string");
  });
});

describe("TerminalRenderer render small", () => {
  const sampleQrData = QRCode.create("sample text", {
    version: 2,
    maskPattern: 0,
  });
  let str: string;
  let calledCallback = false;
  const callback = () => {
    calledCallback = true;
  };

  it("should not throw with only qrData param", () => {
    expect(() => {
      str = renderObject.render(sampleQrData);
    }).not.toThrow();
  });

  it("should not throw with options param and without callback", () => {
    expect(() => {
      str = renderObject.render(sampleQrData, {
        margin: 10,
        scale: 1,
        small: true,
      });
    }).not.toThrow();
  });

  it("should not throw with options param and callback", () => {
    expect(() => {
      str = renderObject.render(sampleQrData, { margin: 10, scale: 1, small: true }, callback);
    }).not.toThrow();
  });

  it("should return a string", () => {
    expect(typeof str).toBe("string");
  });

  it("should call a callback", () => {
    expect(calledCallback).toBe(true);
  });

  it("should not throw with inverse options", () => {
    expect(() => {
      str = renderObject.render(sampleQrData, {
        small: true,
        inverse: true,
      });
    }).not.toThrow();
  });

  it("should return a string if inverse option is set", () => {
    expect(typeof str).toBe("string");
  });
});
