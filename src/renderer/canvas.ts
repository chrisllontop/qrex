import type { QRData } from "../types/qrex.type";
import { RendererUtils } from "./utils";

export class RendererCanvas {
  private clearCanvas(ctx, canvas, size): void {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (!canvas.style) canvas.style = {};
    canvas.height = size;
    canvas.width = size;
    canvas.style.height = `${size}px`;
    canvas.style.width = `${size}px`;
  }

  private getCanvasElement(): HTMLCanvasElement {
    try {
      return document.createElement("canvas");
    } catch (e) {
      throw new Error("You need to specify a canvas element");
    }
  }

  public render(qrData: QRData, canvas, options): HTMLCanvasElement {
    let opts = options;
    let canvasEl = canvas;

    if (typeof opts === "undefined" && (!canvas || !canvas.getContext)) {
      opts = canvas;
      canvas = undefined;
    }

    if (!canvas) {
      canvasEl = this.getCanvasElement();
    }

    opts = RendererUtils.getOptions(opts);
    const size = RendererUtils.getImageWidth(qrData.modules.size, opts);

    const ctx = canvasEl.getContext("2d");
    const image = ctx.createImageData(size, size);
    RendererUtils.qrToImageData(image.data, qrData, opts);

    this.clearCanvas(ctx, canvasEl, size);
    ctx.putImageData(image, 0, 0);

    return canvasEl;
  }

  public renderToDataURL(qrData: QRData, canvas, options): string {
    let opts = options;

    if (typeof opts === "undefined" && (!canvas || !canvas.getContext)) {
      opts = canvas;
      canvas = undefined;
    }

    if (!opts) opts = {};

    const canvasEl = this.render(qrData, canvas, opts);

    const type = opts.type || "image/png";
    const rendererOpts = opts.rendererOpts || {};

    return canvasEl.toDataURL(type, rendererOpts.quality);
  }
}
