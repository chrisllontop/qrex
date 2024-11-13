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

function render(qrData, canvas, options) {
  let resolvedOpts = options;
  let resolvedCanvas = canvas;

  if (typeof resolvedOpts === "undefined" && (!canvas || !canvas.getContext)) {
    resolvedOpts = canvas;
    resolvedCanvas = undefined;
  }

  if (!canvas) {
    resolvedCanvas = getCanvasElement();
  }

  resolvedOpts = RendererUtils.getOptions(resolvedOpts);
  const size = RendererUtils.getImageWidth(qrData.modules.size, resolvedOpts);

  const ctx = resolvedCanvas.getContext("2d");
  const image = ctx.createImageData(size, size);
  RendererUtils.qrToImageData(image.data, qrData, resolvedOpts);

  clearCanvas(ctx, resolvedCanvas, size);
  ctx.putImageData(image, 0, 0);

  return resolvedCanvas;
}

function renderToDataURL(qrData, canvas, options) {
  let resolvedOpts = options;
  let resolvedCanvas = canvas;

  if (typeof resolvedOpts === "undefined" && (!canvas || !canvas.getContext)) {
    resolvedOpts = canvas;
    resolvedCanvas = undefined;
  }

  if (!resolvedOpts) resolvedOpts = {};

  const canvasEl = render(qrData, resolvedCanvas, resolvedOpts);

  const type = resolvedOpts.type || "image/png";
  const rendererOpts = resolvedOpts.rendererOpts || {};

  return canvasEl.toDataURL(type, rendererOpts.quality);
}

export const RendererCanvas = {
  render,
  renderToDataURL,
};
