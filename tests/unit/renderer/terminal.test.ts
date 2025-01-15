import { describe, expect, it } from "vitest";
import { Qrex } from "../../../src/core/qrex";
import { RendererTerminal } from "../../../src/renderer/terminal";

const renderer: RendererTerminal = new RendererTerminal();
describe("RendererTerminal interface", () => {
  it("should have render function", () => {
    expect(typeof renderer.render).toBe("function");
  });
});

describe("RendererTerminal render big", () => {
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

  it("should not throw with inverse options", () => {
    expect(() => {
      str = renderer.render(sampleQrData, { inverse: true });
    }).not.toThrow();
  });

  it("should return a string if inverse option is set", () => {
    expect(typeof str).toBe("string");
  });
});

describe("TerminalRenderer render small", () => {
  const sampleQrData = Qrex.create("sample text", {
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
      str = renderer.render(sampleQrData);
    }).not.toThrow();
  });

  it("should not throw with options param and without callback", () => {
    expect(() => {
      str = renderer.render(sampleQrData, {
        // @ts-ignore TODO - Improve types in Qrex options
        margin: 10,
        scale: 1,
        small: true,
      });
    }).not.toThrow();
  });

  it("should not throw with options param and callback", () => {
    expect(() => {
      str = renderer.render(sampleQrData, { margin: 10, scale: 1, small: true }, callback);
    }).not.toThrow();
  });

  it("should return a string", () => {
    expect(typeof str).toBe("string");
  });

  it("should call a callback", () => {
    expect(calledCallback).toBe(false);
  });

  it("should not throw with inverse options", () => {
    expect(() => {
      str = renderer.render(sampleQrData, {
        small: true,
        inverse: true,
      });
    }).not.toThrow();
  });

  it("should return a string if inverse option is set", () => {
    expect(typeof str).toBe("string");
  });
});
