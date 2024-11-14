import { getImageWidth, getOptions, qrToImageData } from "./utils";
import { type QRCodeToDataURLOptionsJpegWebp as RendererOptions, type QRCode } from "qrcode";

function clearCanvas(ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement, size: number): void {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  if (!canvas.style) canvas.style = {};
  canvas.height = size;
  canvas.width = size;
  canvas.style.height = `${size}px`;
  canvas.style.width = `${size}px`;
}

function getCanvasElement(): HTMLCanvasElement {
  try {
    return document.createElement("canvas");
  } catch (e) {
    throw new Error("You need to specify a canvas element");
  }
}

export function render(qrData, canvas: HTMLCanvasElement, options: RendererOptions): HTMLCanvasElement {
  let opts = options;
  let canvasEl = canvas;

  if (typeof opts === "undefined" && (!canvas || !canvas.getContext)) {
    opts = canvas;
    canvas = undefined;
  }

  if (!canvas) {
    canvasEl = getCanvasElement();
  }

  opts = getOptions(opts);
  const size = getImageWidth(qrData.modules.size, opts);

  const ctx = canvasEl.getContext("2d");
  const image = ctx.createImageData(size, size);

  qrToImageData(image.data, qrData, opts);
  clearCanvas(ctx, canvasEl, size);
  ctx.putImageData(image, 0, 0);

  return canvasEl;
}

export function renderToDataURL(qrData: QRCode, canvas: HTMLCanvasElement, options: RendererOptions): string {
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
