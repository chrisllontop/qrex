import type { ColorObject, QRData, QrexOptions, RendererType } from "../types/qrex.type";

interface RenderOptions extends QrexOptions {
  width?: number;
  scale?: number;
  margin?: number;
  color?: {
    dark?: string;
    light?: string;
  };
  rendererOpts?: Record<string, unknown>;
}

interface ProcessedOptions {
  width?: number;
  scale: number;
  margin: number;
  color: {
    dark: ColorObject;
    light: ColorObject;
  };
  type?: RendererType;
  rendererOpts: Record<string, unknown>;
}

function hex2rgba(hex: string): ColorObject {
  if (!hex || typeof hex !== "string") {
    throw new Error("Color should be defined as hex string");
  }

  let hexCode = hex.slice().replace("#", "").split("");
  if (hexCode.length < 3 || hexCode.length === 5 || hexCode.length > 8) {
    throw new Error(`Invalid hex color: ${hex}`);
  }

  // Convert from short to long form (fff -> ffffff)
  if (hexCode.length === 3 || hexCode.length === 4) {
    hexCode = Array.prototype.concat.apply(
      [],
      hexCode.map((c) => [c, c]),
    );
  }

  // Add default alpha value
  if (hexCode.length === 6) hexCode.push("F", "F");

  const hexValue = Number.parseInt(hexCode.join(""), 16);

  return {
    r: (hexValue >> 24) & 255,
    g: (hexValue >> 16) & 255,
    b: (hexValue >> 8) & 255,
    a: hexValue & 255,
    hex: `#${hexCode.slice(0, 6).join("")}`,
  };
}

function getOptions(opts?: RenderOptions): ProcessedOptions {
  const options = opts ?? {};
  if (!options.color) options.color = {};

  const margin =
    typeof options.margin === "undefined" || options.margin === null || options.margin < 0 ? 4 : options.margin;

  const width = options.width && options.width >= 21 ? options.width : undefined;
  const scale = options.scale || 4;

  return {
    width,
    scale: width ? 4 : scale,
    margin,
    color: {
      dark: hex2rgba(options.color.dark || "#000000ff"),
      light: hex2rgba(options.color.light || "#ffffffff"),
    },
    type: options.type,
    rendererOpts: options.rendererOpts || {},
  };
}

function getScale(qrSize: number, opts: ProcessedOptions): number {
  return opts.width && opts.width >= qrSize + opts.margin * 2 ? opts.width / (qrSize + opts.margin * 2) : opts.scale;
}

function getImageWidth(qrSize: number, opts: ProcessedOptions): number {
  const scale = getScale(qrSize, opts);
  return Math.floor((qrSize + opts.margin * 2) * scale);
}

function qrToImageData(imgData: Uint8Array | Uint8ClampedArray, qr: QRData, opts: ProcessedOptions): void {
  const size = qr.modules.size;
  const data = qr.modules.data;
  const scale = getScale(size, opts);
  const symbolSize = Math.floor((size + opts.margin * 2) * scale);
  const scaledMargin = opts.margin * scale;
  const palette = [opts.color.light, opts.color.dark];

  for (let i = 0; i < symbolSize; i++) {
    for (let j = 0; j < symbolSize; j++) {
      let posDst = (i * symbolSize + j) * 4;
      let pxColor = opts.color.light;

      if (i >= scaledMargin && j >= scaledMargin && i < symbolSize - scaledMargin && j < symbolSize - scaledMargin) {
        const iSrc = Math.floor((i - scaledMargin) / scale);
        const jSrc = Math.floor((j - scaledMargin) / scale);
        pxColor = palette[data[iSrc * size + jSrc] ? 1 : 0];
      }

      imgData[posDst++] = pxColor.r;
      imgData[posDst++] = pxColor.g;
      imgData[posDst++] = pxColor.b;
      imgData[posDst] = pxColor.a;
    }
  }
}

export const RendererUtils = {
  getOptions,
  getImageWidth,
  qrToImageData,
  getScale,
};
