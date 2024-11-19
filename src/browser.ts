import type { QRCodeOptions } from "qrcode";
import type { ArbitaryFunction } from "./core/utils.js";

import canPromise from "./can-promise.js";
import * as QRCode from "./core/qrcode.js";
import { RendererCanvas } from "./renderer/canvas.js";
import SvgTagRenderer from "./renderer/svg-tag.js";

function renderCanvas(
  renderFunc: ArbitaryFunction,
  canvas?: HTMLCanvasElement,
  text?: string,
  opts?: QRCodeOptions,
  cb?: ArbitaryFunction
): void {
  try {
    const data = create(text, opts);
    cb(null, renderFunc(data, canvas, opts));
  } catch (e) {
    cb(e);
  }
}

export const create = QRCode.create;
export const toCanvas = renderCanvas.bind(null, RendererCanvas.render);
export const toDataURL = renderCanvas.bind(
  null,
  RendererCanvas.renderToDataURL,
);

export const toString = renderCanvas.bind(null, (data, _, opts) => SvgTagRenderer.render(data, opts));
