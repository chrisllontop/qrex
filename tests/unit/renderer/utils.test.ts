// @ts-nocheck
import { describe, expect, it } from "vitest";
import { RendererUtils } from "../../../src/renderer/utils";
import { RenderOptions } from "../../../src/types/qrex.type";

const renderObject = new RendererUtils();
describe("Utils getOptions", () => {
  const defaultOptions = {
    width: undefined,
    scale: 4,
    margin: 4,
    color: {
      dark: { r: 0, g: 0, b: 0, a: 255, hex: "#000000" },
      light: { r: 255, g: 255, b: 255, a: 255, hex: "#ffffff" },
    },
    type: undefined,
    rendererOpts: {},
  };

  it("should be defined", () => {
    expect(renderObject.getOptions).toBeDefined();
  });

  it("should return default options if called without param", () => {
    expect(renderObject.getOptions()).toEqual(defaultOptions);
  });

  it("should return correct scale value", () => {
    expect(renderObject.getOptions({ scale: 8 }).scale).toBe(8);
  });

  it("should reset scale value to default if width is set", () => {
    expect(renderObject.getOptions({ width: 300 }).scale).toBe(4);
  });

  it("should return default margin if specified value is null", () => {
    expect(renderObject.getOptions({ margin: null }).margin).toBe(4);
  });

  it("should return default margin if specified value is < 0", () => {
    expect(renderObject.getOptions({ margin: -1 }).margin).toBe(4);
  });

  it("should return correct margin value", () => {
    expect(renderObject.getOptions({ margin: 20 }).margin).toBe(20);
  });

  it("should return correct colors value from strings", () => {
    expect(renderObject.getOptions({ color: { dark: "#fff", light: "#000000" } }).color).toEqual({
      dark: { r: 255, g: 255, b: 255, a: 255, hex: "#ffffff" },
      light: { r: 0, g: 0, b: 0, a: 255, hex: "#000000" },
    });
  });

  it("should return correct colors value from numbers", () => {
    expect(renderObject.getOptions({ color: { dark: 111, light: 999 } }).color).toEqual({
      dark: { r: 17, g: 17, b: 17, a: 255, hex: "#111111" },
      light: { r: 153, g: 153, b: 153, a: 255, hex: "#999999" },
    });
  });

  it("should throw if color is not a string", () => {
    expect(() => {
      renderObject.getOptions({ color: { dark: true } });
    }).toThrow("Color should be defined as hex string");
  });

  it("should throw if color is not in a valid hex format", () => {
    expect(() => {
      renderObject.getOptions({ color: { dark: "#aa" } });
    }).toThrow("Invalid hex color: #aa");
  });
});

describe("Utils getScale", () => {
  const symbolSize = 21;

  it("should return correct scale value", () => {
    expect(renderObject.getScale(symbolSize, { scale: 5 })).toBe(5);
  });

  it("should calculate correct scale from width and margin", () => {
    expect(renderObject.getScale(symbolSize, { width: 50, margin: 2 })).toBe(2);
  });

  it("should return default scale if width is too small to contain the symbol", () => {
    expect(renderObject.getScale(symbolSize, { width: 21, margin: 2, scale: 4 })).toBe(4);
  });
});

describe("Utils getImageWidth", () => {
  const symbolSize = 21;

  it("should return correct width value", () => {
    expect(renderObject.getImageWidth(symbolSize, { scale: 5, margin: 0 })).toBe(105);
  });

  it("should return specified width value", () => {
    expect(renderObject.getImageWidth(symbolSize, { width: 250, margin: 2 })).toBe(250);
  });

  it("should ignore width option if too small to contain the symbol", () => {
    expect(
      renderObject.getImageWidth(symbolSize, {
        width: 10,
        margin: 4,
        scale: 4,
      }),
    ).toBe(116);
  });
});

describe("Utils qrToImageData", () => {
  it("should be defined", () => {
    expect(renderObject.qrToImageData).toBeDefined();
  });

  const sampleQrData = {
    modules: {
      data: [1, 0, 1, 0, 0, 1, 0, 1, 1, 0, 1, 0, 0, 1, 0, 1],
      size: 4,
    },
  };

  const margin = 4;
  const scale = 2;
  const width = 100;

  const color = {
    dark: { r: 255, g: 255, b: 255, a: 255 },
    light: { r: 0, g: 0, b: 0, a: 255 },
  };

  const opts = {
    margin: margin,
    scale: scale,
    color: color,
    width: width,
  };

  let imageData = [];
  const expectedImageSize = (sampleQrData.modules.size + margin * 2) * scale;
  let expectedImageDataLength = expectedImageSize ** 2 * 4;

  it("should return correct imageData length", () => {
    renderObject.qrToImageData(imageData, sampleQrData, opts);
    expect(imageData.length).toBe(expectedImageDataLength);
  });

  imageData = [];
  opts.width = width;
  expectedImageDataLength = width ** 2 * 4;

  it("should return correct imageData length when width is specified", () => {
    renderObject.qrToImageData(imageData, sampleQrData, opts);
    expect(imageData.length).toBe(expectedImageDataLength);
  });
});
