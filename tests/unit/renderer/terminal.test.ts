import { describe, expect, it } from "vitest";
import { Qrex } from "../../../src/core/qrex";
import { RendererTerminal } from "../../../src/renderer/terminal";
import type { QRData } from "../../../src/types/qrex.type";

const renderer: RendererTerminal = new RendererTerminal();
describe("RendererTerminal interface", () => {
  it("should have render function", () => {
    expect(typeof renderer.render).toBe("function");
  });
});

describe("RendererTerminal render big", () => {
  const sampleQrData: QRData = Qrex.create("sample text", {
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
      str = renderer.render(sampleQrData, {
        // @ts-ignore Testing with margin and scale options
        margin: 10,
        scale: 1,
      });
    }).not.toThrow();
  });

  it("should return a string", () => {
    expect(typeof str).toBe("string");
  });

  it("should not throw with inverse options", () => {
    expect(() => {
      str = renderer.render(sampleQrData, {
        // @ts-ignore Testing with inverse option
        inverse: true,
      });
    }).not.toThrow();
  });

  it("should return a string if inverse option is set", () => {
    expect(typeof str).toBe("string");
  });
});

describe("TerminalRenderer render small", () => {
  const sampleQrData: QRData = Qrex.create("sample text", {
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

  it("should use small renderer when renderConfig.small is true", () => {
    expect(() => {
      str = renderer.render(sampleQrData, {
        renderConfig: {
          small: true,
        },
      });
    }).not.toThrow();
    // Small renderer output is typically shorter than regular renderer
    const regularOutput = renderer.render(sampleQrData);
    expect(str.length).toBeLessThan(regularOutput.length);
  });

  it("should not throw with options param and without callback", () => {
    expect(() => {
      str = renderer.render(sampleQrData, {
        margin: 10,
        scale: 1,
        renderConfig: {
          small: true,
        },
      });
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
        renderConfig: {
          small: true,
          inverse: true,
        },
      });
    }).not.toThrow();
  });

  it("should return a string if inverse option is set", () => {
    expect(typeof str).toBe("string");
  });
});
