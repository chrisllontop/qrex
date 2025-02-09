import type { QRData, RenderOptions } from "../types/qrex.type.js";
import { RendererUtils } from "./utils.js";

export class RendererCanvas {
  canvas: HTMLCanvasElement;

  constructor(canvas?: HTMLCanvasElement) {
    this.canvas = canvas ?? this.getCanvasElement();
  }

  private clearCanvas(ctx: CanvasRenderingContext2D, size: number): void {
    ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    if (!this.canvas.style) {
      // @ts-ignore
      this.canvas.style = {};
    }
    this.canvas.height = size;
    this.canvas.width = size;
    this.canvas.style.height = `${size}px`;
    this.canvas.style.width = `${size}px`;
  }

  private getCanvasElement(): HTMLCanvasElement {
    try {
      return document.createElement("canvas");
    } catch (e) {
      throw new Error("You need to specify a canvas element");
    }
  }

  public render(qrData: QRData, options?: RenderOptions): HTMLCanvasElement {
    const processedOpts = RendererUtils.getOptions(options);
    const canvasEl = this.canvas;
    const size = RendererUtils.getImageWidth(qrData.modules.size, processedOpts);

    const ctx = canvasEl.getContext("2d")!;
    const image = ctx!.createImageData(size, size);
    RendererUtils.qrToImageData(image.data, qrData, processedOpts);

    this.clearCanvas(ctx, size);
    ctx!.putImageData(image, 0, 0);

    return canvasEl;
  }

  public renderToDataURL(qrData: QRData, options?: RenderOptions): string {
    const canvasEl = this.render(qrData, options);
    const renderConfig = options?.renderConfig || {};
    const mimeType = renderConfig.mimeType || "image/png";

    return canvasEl.toDataURL(mimeType, renderConfig.quality);
  }
}
