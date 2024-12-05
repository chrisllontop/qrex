import type { ColorOptions, QRData, RenderOptions, RGBA } from "../types/qrex.type";

export class RendererUtils {
  private hex2rgba = (hex: string | number): RGBA => {
    if (typeof hex === "number") {
      hex = hex.toString();
    }

    if (typeof hex !== "string") {
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
  };

  public getOptions = (options?: RenderOptions) => {
    if (!options) options = {};
    if (!options.color) (options.color as unknown) = {};

    const margin =
      typeof options.margin === "undefined" || options.margin === null || options.margin < 0 ? 4 : options.margin;

    const width = options.width && options.width >= 21 ? options.width : undefined;
    const scale = options.scale || 4;

    return {
      width: width,
      scale: width ? 4 : scale,
      margin: margin,
      color: {
        dark: this.hex2rgba((options.color as ColorOptions).dark || "#000000ff"),
        light: this.hex2rgba((options.color as ColorOptions).light || "#ffffffff"),
      },
      type: options.type,
      rendererOpts: options.rendererOpts || {},
    };
  };

  public getScale = (qrSize: number, opts: RenderOptions): number => {
    return opts.width && opts.width >= qrSize + opts.margin! * 2
      ? opts.width / (qrSize + opts.margin! * 2)
      : opts.scale!;
  };

  public getImageWidth = (qrSize: number, opts: RenderOptions) => {
    const scale = this.getScale(qrSize, opts);
    return Math.floor((qrSize + opts.margin! * 2) * scale);
  };

  public qrToImageData = (imgData: Buffer | Uint8ClampedArray, qr: QRData, opts: RenderOptions) => {
    const size = qr.modules.size;
    const data = qr.modules.data;
    const scale = this.getScale(size, opts);
    const symbolSize = Math.floor((size + opts.margin! * 2) * scale);
    const scaledMargin = opts.margin! * scale;
    //@ts-ignore
    const palette = [opts.color!.light, opts.color!.dark];

    for (let i = 0; i < symbolSize; i++) {
      for (let j = 0; j < symbolSize; j++) {
        let posDst = (i * symbolSize + j) * 4; //@ts-ignore
        let pxColor = opts.color?.light;

        if (i >= scaledMargin && j >= scaledMargin && i < symbolSize - scaledMargin && j < symbolSize - scaledMargin) {
          const iSrc = Math.floor((i - scaledMargin) / scale);
          const jSrc = Math.floor((j - scaledMargin) / scale);
          pxColor = palette[data[iSrc * size + jSrc] ? 1 : 0];
        }

        (imgData as Uint8ClampedArray)[posDst++] = pxColor.r;
        (imgData as Uint8ClampedArray)[posDst++] = pxColor.g;
        (imgData as Uint8ClampedArray)[posDst++] = pxColor.b;
        (imgData as Uint8ClampedArray)[posDst] = pxColor.a;
      }
    }
  };
}
