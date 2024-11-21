import { QRexBase } from "./qrex.base";
import { RendererCanvas } from "./renderer/canvas";
import { RendererSvgTag } from "./renderer/svg-tag";
import type { QRexOptions, QrContent } from "./types/qrex.type";

export class QRex extends QRexBase {
  private readonly rendererCanvas: RendererCanvas;
  private readonly rendererSvgTag = new RendererSvgTag();

  constructor(data: QrContent, opts?: QRexOptions, canvas?: HTMLCanvasElement) {
    super(data, opts);
    this.rendererCanvas = new RendererCanvas(canvas);
  }

  public toCanvas() {
    return this.render(this.rendererCanvas.render);
  }

  public toDataURL() {
    return this.render(this.rendererCanvas.renderToDataURL);
  }

  public toString() {
    return this.render(this.rendererSvgTag.render);
  }
}
