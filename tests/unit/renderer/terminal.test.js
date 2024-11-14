import { describe, it, expect } from "vitest";
import { QRCode } from "../../../src/core/qrcode";
import { RendererTerminal } from "../../../src/renderer/terminal";

describe("RendererTerminal interface", () => {
  it("should have render function", () => {
    expect(typeof RendererTerminal.render).toBe("function");
  });
});

describe("RendererTerminal render big", () => {
  const sampleQrData = QRCode.create("sample text", {
    version: 2,
    maskPattern: 0,
  });
  let str;

  it("should not throw with only qrData param", () => {
    expect(() => {
      str = RendererTerminal.render(sampleQrData);
    }).not.toThrow();
  });

  it("should not throw with options param", () => {
    expect(() => {
      str = RendererTerminal.render(sampleQrData, { margin: 10, scale: 1 });
    }).not.toThrow();
  });

  it("should return a string", () => {
    expect(typeof str).toBe("string");
  });

  it("should not throw with inverse options", () => {
    expect(() => {
      str = RendererTerminal.render(sampleQrData, { inverse: true });
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
  let str;
  let calledCallback = false;
  const callback = () => {
    calledCallback = true;
  };

  it("should not throw with only qrData param", () => {
    expect(() => {
      str = RendererTerminal.render(sampleQrData);
    }).not.toThrow();
  });

  it("should not throw with options param and without callback", () => {
    expect(() => {
      str = RendererTerminal.render(sampleQrData, {
        margin: 10,
        scale: 1,
        small: true,
      });
    }).not.toThrow();
  });

  it("should not throw with options param and callback", () => {
    expect(() => {
      str = RendererTerminal.render(
        sampleQrData,
        { margin: 10, scale: 1, small: true },
        callback,
      );
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
      str = RendererTerminal.render(sampleQrData, {
        small: true,
        inverse: true,
      });
    }).not.toThrow();
  });

  it("should return a string if inverse option is set", () => {
    expect(typeof str).toBe("string");
  });
});
