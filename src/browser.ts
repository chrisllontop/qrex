import { type QRCodeOptions } from "qrcode";

import canPromise from "./can-promise.js";
import { create as qrCodeCreate } from "./core/qrcode.js";
import { render as canvasRender, renderToDataURL } from "./renderer/canvas.js";
import SvgTagRenderer from "./renderer/svg-tag.js";

function renderCanvas(
  renderFunc: Function,
  canvas?: HTMLCanvasElement,
  text?: string,
  opts?: QRCodeOptions,
  cb?: Function
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
