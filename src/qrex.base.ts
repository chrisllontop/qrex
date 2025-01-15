import { Qrex as QrexCore } from "./core/qrex";
import type { QrexOptions, QrContent, RenderFunctionBase } from "./types/qrex.type";

export abstract class QrexBase {
  protected readonly opts?: QrexOptions;
  protected readonly data: QrContent;

  constructor(data: QrContent, opts?: QrexOptions) {
    this.data = data;
    this.opts = opts;
    this.checkParams(data, opts);
  }

  protected checkParams(text: QrContent, opts?: QrexOptions) {
    if (!text) {
      throw new Error("String required as first argument");
    }
    // TODO - Add opts validation
  }

  public create() {
    return QrexCore.create(this.data, this.opts);
  }

  protected render<T>(renderFunc: RenderFunctionBase<T>): T {
    const data = this.create();
    return renderFunc(data, this.opts);
  }
}
