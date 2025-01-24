import type { QRData, QrexOptions, RenderOptions } from "../types/qrex.type";
import { RendererUtils } from "./utils";

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
    let opts = options;
    // this.canvas = document.createElement('canvas');
    const canvasEl = this.canvas;

    opts = RendererUtils.getOptions(opts);
    const size = RendererUtils.getImageWidth(qrData.modules.size, opts);

    const ctx = canvasEl.getContext("2d")!;
    const image = ctx!.createImageData(size, size);
    RendererUtils.qrToImageData(image.data, qrData, opts);

    this.clearCanvas(ctx, size);
    ctx!.putImageData(image, 0, 0);

    return canvasEl;
  }

  public renderToDataURL(qrData: QRData, options?: RenderOptions): string {
    const canvasEl = this.render(qrData, options);

    const type = options?.type || "image/png";
    const renderConfig = options?.render?.renderConfig || {};

    return canvasEl.toDataURL(type, renderConfig.quality);
  }
}
