import type { QRData } from "../types/qrex.type";
import { RendererUtils } from "./utils";

function clearCanvas(ctx, canvas, size) {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  if (!canvas.style) canvas.style = {};
  canvas.height = size;
  canvas.width = size;
  canvas.style.height = `${size}px`;
  canvas.style.width = `${size}px`;
}

function getCanvasElement() {
  try {
    return document.createElement("canvas");
  } catch (e) {
    throw new Error("You need to specify a canvas element");
  }
}

function render(qrData: QRData, canvas, options) {
  let opts = options;
  let canvasEl = canvas;

  if (typeof opts === "undefined" && (!canvas || !canvas.getContext)) {
    opts = canvas;
    canvas = undefined;
  }

  if (!canvas) {
    canvasEl = getCanvasElement();
  }

  opts = RendererUtils.getOptions(opts);
  const size = RendererUtils.getImageWidth(qrData.modules.size, opts);

  const ctx = canvasEl.getContext("2d");
  const image = ctx.createImageData(size, size);
  RendererUtils.qrToImageData(image.data, qrData, opts);

  clearCanvas(ctx, canvasEl, size);
  ctx.putImageData(image, 0, 0);

  return canvasEl;
}

function renderToDataURL(qrData: QRData, canvas, options) {
  let opts = options;

  if (typeof opts === "undefined" && (!canvas || !canvas.getContext)) {
    opts = canvas;
    canvas = undefined;
  }

  if (!opts) opts = {};

  const canvasEl = render(qrData, canvas, opts);

  const type = opts.type || "image/png";
  const rendererOpts = opts.rendererOpts || {};

  return canvasEl.toDataURL(type, rendererOpts.quality);
}

export const RendererCanvas = {
  render,
  renderToDataURL,
};
