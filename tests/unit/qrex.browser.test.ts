import { describe, expect, it, vi } from "vitest";
import { Qrex } from "../../src/qrex.browser.js";
import { RendererCanvas } from "../../src/renderer/canvas.js";
import type { MaskPatternType } from "../../src/types/qrex.type.js";

// Mock canvas and svg renderers
vi.mock("../../src/renderer/canvas.js", () => ({
  RendererCanvas: vi.fn().mockImplementation(() => ({
    render: vi.fn().mockReturnValue("canvas-result"),
    renderToDataURL: vi.fn().mockReturnValue("data-url-result"),
  })),
}));

vi.mock("../../src/renderer/svg-tag.js", () => ({
  RendererSvgTag: vi.fn().mockImplementation(() => ({
    render: vi.fn().mockReturnValue("svg-result"),
  })),
}));

describe("Qrex Browser", () => {
  const testData = "test data";
  const testOptions = { version: 1, maskPattern: 0 as MaskPatternType };
  const renderOptions = { scale: 2 };

  it("should initialize with canvas element", () => {
    const canvas = {} as HTMLCanvasElement;
    const qr = new Qrex(testData, testOptions, canvas);
    expect(RendererCanvas).toHaveBeenCalledWith(canvas);
  });

  it("should render to canvas", () => {
    const qr = new Qrex(testData, testOptions);
    const result = qr.toCanvas(renderOptions);
    expect(result).toBe("canvas-result");
  });

  it("should render to data URL", () => {
    const qr = new Qrex(testData, testOptions);
    const result = qr.toDataURL(renderOptions);
    expect(result).toBe("data-url-result");
  });

  it("should render to SVG string", () => {
    const qr = new Qrex(testData, testOptions);
    const result = qr.toString(renderOptions);
    expect(result).toBe("svg-result");
  });

  it("should render to SVG string without options", () => {
    const qr = new Qrex(testData, testOptions);
    const result = qr.toString();
    expect(result).toBe("svg-result");
  });
});
