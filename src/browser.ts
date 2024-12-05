import canPromise from "./can-promise";
import { create as qrCodeCreate } from "./core/qrex";
import { RendererCanvas } from "./renderer/canvas";
import { RendererSvgTag } from "./renderer/svg-tag";
import type { Callback, QRData, QRexOptions, RenderFunc, RenderOptions } from "./types/qrex.type";

export class QRexBrowser {
  private readonly rendererCanvas = new RendererCanvas();
  private readonly svgtagRenderer = new RendererSvgTag();
  private renderCanvas = (
    renderFunc: RenderFunc,
    canvas?: HTMLCanvasElement,
    text?: string,
    opts?: RenderOptions,
    cb?: Callback,
  ) => {
    const args = [];
    if (canvas) {
      args.push(canvas);
    }
    if (text) {
      args.push(text);
    }
    if (opts) {
      args.push(opts);
    }
    if (cb) {
      args.push(cb);
    }
    const argsNum = args.length;
    const isLastArgCb = typeof args[argsNum - 1] === "function";
    if (!isLastArgCb && !canPromise()) {
      throw new Error("Callback required as last argument");
    }

    if (isLastArgCb) {
      if (argsNum < 2) {
        throw new Error("Too few arguments provided");
      }

      if (argsNum === 2) {
        cb = text as unknown as Callback;
        text = canvas as unknown as string;
        canvas = opts = undefined;
      } else if (argsNum === 3) {
        if (canvas?.getContext && typeof cb === "undefined") {
          cb = opts as unknown as Callback;
          opts = undefined;
        } else {
          cb = opts as unknown as Callback;
          opts = text as unknown as RenderOptions;
          text = canvas as unknown as string;
          canvas = undefined;
        }
      }
    } else {
      if (argsNum < 1) {
        throw new Error("Too few arguments provided");
      }
      if (argsNum === 1) {
        text = canvas as unknown as string;
        canvas = opts = undefined;
      } else if (argsNum === 2 && !canvas?.getContext) {
        opts = text as unknown as RenderOptions;
        text = canvas as unknown as string;
        canvas = undefined;
      }

      return new Promise((resolve, reject) => {
        try {
          const data = this.create(text as string, opts as QRexOptions);
          resolve(renderFunc(data, canvas, opts));
        } catch (e) {
          reject(e);
        }
      });
    }

    try {
      const data = this.create(text as string, opts as QRexOptions);
      cb?.(null, renderFunc(data, canvas, opts) as unknown as string | null);
    } catch (e) {
      cb?.(e as Error);
    }
  };

  public create = qrCodeCreate;

  public toCanvas = this.renderCanvas.bind(null, this.rendererCanvas.render);
  public toDataURL = this.renderCanvas.bind(null, this.rendererCanvas.renderToDataURL);

  public toCanvasString = this.renderCanvas.bind(null, (data: QRData, _?: HTMLCanvasElement, opts?: RenderOptions) =>
    this.svgtagRenderer.render(data, opts as RenderOptions),
  );
}
