import type { RendererOptions } from "./../types/qrex.type";
import type { QRData, RenderOptions } from "../types/qrex.type";
import { RendererUtils } from "./utils";

export class RendererCanvas {
  private clearCanvas = (ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement, size: number): void => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    // @ts-ignore
    if (!canvas.style) canvas.style = {};
    canvas.height = size;
    canvas.width = size;
    canvas.style.height = `${size}px`;
    canvas.style.width = `${size}px`;
  };

  private getCanvasElement = (): HTMLCanvasElement => {
    try {
      return document.createElement("canvas");
    } catch (e) {
      throw new Error("You need to specify a canvas element");
    }
  };

  public render = (qrData: QRData, canvas?: HTMLCanvasElement, options?: RenderOptions) => {
    let opts = options;
    let canvasEl = canvas;

    if (typeof opts === "undefined" && (!canvas || !canvas.getContext)) {
      opts = canvas as unknown as RenderOptions;
      canvas = undefined;
    }

    if (!canvas) {
      canvasEl = this.getCanvasElement();
    }
    const Utils = new RendererUtils();
    opts = Utils.getOptions(opts);
    const size = Utils.getImageWidth(qrData.modules.size, opts);

    const ctx = canvasEl?.getContext("2d")!;
    const image = ctx.createImageData(size, size);
    Utils.qrToImageData(image.data, qrData, opts);

    if (canvasEl) this.clearCanvas(ctx, canvasEl, size);
    ctx.putImageData(image, 0, 0);

    return canvasEl;
  };

  public renderToDataURL = (qrData: QRData, canvas?: HTMLCanvasElement, options?: RenderOptions) => {
    let opts = options;

    if (typeof opts === "undefined" && (!canvas || !canvas.getContext)) {
      opts = canvas as unknown as RenderOptions;
      canvas = undefined;
    }

    if (!opts) opts = {};

    const canvasEl = this.render(qrData, canvas, opts);

    const type = opts.type || "image/png";
    const rendererOpts = opts.rendererOpts || {};

    return canvasEl?.toDataURL(type, (rendererOpts as RendererOptions).quality);
  };
}
