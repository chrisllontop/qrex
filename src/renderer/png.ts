import fs from "fs";
import { PNG } from "pngjs";
import { getOptions, getImageWidth, qrToImageData } from "./utils";
import { type QRCodeToDataURLOptionsJpegWebp as RendererOptions, type QRCode } from "qrcode";

export function render(qrData: QRCode, options: RendererOptions) {
  const opts = getOptions(options);
  const pngOpts = opts.rendererOpts;
  const size = getImageWidth(qrData.modules.size, opts);

  pngOpts.width = size;
  pngOpts.height = size;

  const pngImage = new PNG(pngOpts);

  qrToImageData(pngImage.data, qrData, opts);

  return pngImage;
}

export function renderToDataURL(qrData: QRCode, options: RendererOptions, cb: function) {
  if (typeof cb === "undefined") {
    cb = options;
    options = undefined;
  }

  renderToBuffer(qrData, options, (err, output) => {
    if (err) cb(err);
    let url = "data:image/png;base64,";
    url += output.toString("base64");
    cb(null, url);
  });
}

export function renderToBuffer(qrData: QRCode, options: RendererOptions, cb: function) {
  if (typeof cb === "undefined") {
    cb = options;
    options = undefined;
  }

  const png = render(qrData, options);
  const buffer = [];

  png.on("error", cb);

  png.on("data", (data) => {
    buffer.push(data);
  });

  png.on("end", () => {
    cb(null, Buffer.concat(buffer));
  });

  png.pack();
}

export function renderToFile(path: string, qrData: QRCode, options: RendererOptions, cb: function | undefined): void {
  if (typeof cb === "undefined") {
    cb = options;
    options = undefined;
  }

  let called = false;
  const done = (...args) => {
    if (called) return;
    called = true;
    cb.apply(null, args);
  };
  const stream = fs.createWriteStream(path);

  stream.on("error", done);
  stream.on("close", done);

  renderToFileStream(stream, qrData, options);
}

export function renderToFileStream(
  stream,
  qrData: QRCode,
  options: RendererOptions,
): void {
  const png = render(qrData, options);
  png.pack().pipe(stream);
}

export const RendererPng = {
  render,
  renderToBuffer,
  renderToFile,
  renderToFileStream,
  renderToDataURL,
};
