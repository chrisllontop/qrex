import { QRexBase } from "./qrex.base";
import { RendererCanvas } from "./renderer/canvas";
import { RendererSvgTag } from "./renderer/svg-tag";
import type { QRexOptions, QrContent } from "./types/qrex.type";

export class QRex extends QRexBase {
  private readonly rendererCanvas: RendererCanvas;
  private readonly rendererSvgTag = new RendererSvgTag();
  canvas: HTMLCanvasElement;

  constructor(data?: QrContent, opts?: QRexOptions, canvas?: HTMLCanvasElement) {
    super(data, opts);
    this.canvas = canvas || document.createElement("canvas");
    this.rendererCanvas = new RendererCanvas(canvas);
  }

  public toCanvas() {
    return this.render(this.rendererCanvas.render.bind(this.rendererCanvas));
  }

  public toDataURL() {
    return this.render(this.rendererCanvas.renderToDataURL.bind(this.rendererCanvas));
  }

  public toString() {
    return this.render(this.rendererSvgTag.render.bind(this.rendererSvgTag));
  }
}
