import { describe, expect, it } from "vitest";
import { RendererUtils } from "../../../src/renderer/utils";

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
    expect(RendererUtils.getOptions).toBeDefined();
  });

  it("should return default options if called without param", () => {
    expect(RendererUtils.getOptions()).toEqual(defaultOptions);
  });

  it("should return correct scale value", () => {
    expect(RendererUtils.getOptions({ scale: 8 }).scale).toBe(8);
  });

  it("should reset scale value to default if width is set", () => {
    expect(RendererUtils.getOptions({ width: 300 }).scale).toBe(4);
  });

  it("should return default margin if specified value is null", () => {
    expect(RendererUtils.getOptions({ margin: null }).margin).toBe(4);
  });

  it("should return default margin if specified value is < 0", () => {
    expect(RendererUtils.getOptions({ margin: -1 }).margin).toBe(4);
  });

  it("should return correct margin value", () => {
    expect(RendererUtils.getOptions({ margin: 20 }).margin).toBe(20);
  });

  it("should return correct colors value from strings", () => {
    expect(RendererUtils.getOptions({ color: { dark: "#fff", light: "#000000" } }).color).toEqual({
      dark: { r: 255, g: 255, b: 255, a: 255, hex: "#ffffff" },
      light: { r: 0, g: 0, b: 0, a: 255, hex: "#000000" },
    });
  });

  it("should throw if color is not a string", () => {
    expect(() => {
      RendererUtils.getOptions({ color: { dark: true } });
    }).toThrow("Color should be defined as hex string");
  });

  it("should throw if color is not in a valid hex format", () => {
    expect(() => {
      RendererUtils.getOptions({ color: { dark: "#aa" } });
    }).toThrow("Invalid hex color: #aa");
  });
});

describe("Utils getScale", () => {
  const symbolSize = 21;

  it("should return correct scale value", () => {
    expect(RendererUtils.getScale(symbolSize, { scale: 5 })).toBe(5);
  });

  it("should calculate correct scale from width and margin", () => {
    expect(RendererUtils.getScale(symbolSize, { width: 50, margin: 2 })).toBe(2);
  });

  it("should return default scale if width is too small to contain the symbol", () => {
    expect(RendererUtils.getScale(symbolSize, { width: 21, margin: 2, scale: 4 })).toBe(4);
  });
});

describe("Utils getImageWidth", () => {
  const symbolSize = 21;

  it("should return correct width value", () => {
    expect(RendererUtils.getImageWidth(symbolSize, { scale: 5, margin: 0 })).toBe(105);
  });

  it("should return specified width value", () => {
    expect(RendererUtils.getImageWidth(symbolSize, { width: 250, margin: 2 })).toBe(250);
  });

  it("should ignore width option if too small to contain the symbol", () => {
    expect(
      RendererUtils.getImageWidth(symbolSize, {
        width: 10,
        margin: 4,
        scale: 4,
      }),
    ).toBe(116);
  });
});

describe("Utils qrToImageData", () => {
  it("should be defined", () => {
    expect(RendererUtils.qrToImageData).toBeDefined();
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
  };

  let imageData = [];
  const expectedImageSize = (sampleQrData.modules.size + margin * 2) * scale;
  let expectedImageDataLength = expectedImageSize ** 2 * 4;

  it("should return correct imageData length", () => {
    RendererUtils.qrToImageData(imageData, sampleQrData, opts);
    expect(imageData.length).toBe(expectedImageDataLength);
  });

  imageData = [];
  opts.width = width;
  expectedImageDataLength = width ** 2 * 4;

  it("should return correct imageData length when width is specified", () => {
    RendererUtils.qrToImageData(imageData, sampleQrData, opts);
    expect(imageData.length).toBe(expectedImageDataLength);
  });
});
