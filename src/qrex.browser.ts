import { QrexBase } from "./qrex.base";
import { RendererCanvas } from "./renderer/canvas";
import { RendererSvgTag } from "./renderer/svg-tag";
import type { QrexOptions, QrContent } from "./types/qrex.type";

export class Qrex extends QrexBase {
  private readonly rendererCanvas: RendererCanvas;
  private readonly rendererSvgTag = new RendererSvgTag();

  constructor(data: QrContent, opts?: QrexOptions, canvas?: HTMLCanvasElement) {
    super(data, opts);
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
