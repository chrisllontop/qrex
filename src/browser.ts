import { QRexBase } from "./qrex.base";
import { RendererCanvas } from "./renderer/canvas";
import { RendererSvgTag } from "./renderer/svg-tag";
import type { QRData, QRexOptions, QrContent } from "./types/qrex.type";

export class QRex extends QRexBase {
  private readonly canvas?: HTMLCanvasElement;
  private readonly rendererCanvas = new RendererCanvas();
  private readonly rendererSvgTag = new RendererSvgTag();

  constructor(data: QrContent, opts?: QRexOptions, canvas?: HTMLCanvasElement) {
    super(data, opts);
    this.canvas = canvas;
  }

  private async renderCanvas(renderFunc) {
    try {
      const qrData = this.create();
      return renderFunc(qrData, this.canvas, this.opts);
    } catch (e) {
      return Promise.reject(e);
    }
  }

  public toCanvas() {
    return this.renderCanvas(this.rendererCanvas.render);
  }

  public toDataURL() {
    return this.renderCanvas(this.rendererCanvas.renderToDataURL);
  }

  public toString() {
    return this.renderCanvas((data: QRData, _: HTMLCanvasElement, opts: QRexOptions) =>
      this.rendererSvgTag.render(data, opts),
    );
  }
}
