import { QRex as QRexCore } from "./core/qrex";
import type { QRexOptions, QrContent, RenderFunctionBase } from "./types/qrex.type";

export abstract class QRexBase {
  protected readonly opts?: QRexOptions;
  protected readonly data: QrContent;

  constructor(data: QrContent, opts?: QRexOptions) {
    this.data = data;
    this.opts = opts;
    this.checkParams(data, opts);
  }

  protected checkParams(text: QrContent, opts?: QRexOptions) {
    if (typeof text === "undefined") {
      throw new Error("String required as first argument");
    }
    // TODO - Add opts validation
  }

  public create() {
    return QRexCore.create(this.data, this.opts);
  }

  protected render<T>(renderFunc: RenderFunctionBase<T>): T {
    const data = this.create();
    return renderFunc(data, this.opts);
  }
}
