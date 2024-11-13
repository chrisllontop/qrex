import fs from "node:fs";
import { PNG } from "pngjs";
import { RendererUtils } from "./utils";

function render(qrData, options) {
  const opts = RendererUtils.getOptions(options);
  const pngOpts = opts.rendererOpts;
  const size = RendererUtils.getImageWidth(qrData.modules.size, opts);

  pngOpts.width = size;
  pngOpts.height = size;

  const pngImage = new PNG(pngOpts);
  RendererUtils.qrToImageData(pngImage.data, qrData, opts);

  return pngImage;
}

function renderToDataURL(qrData, options, cb) {
  const resolvedCb = typeof cb === "undefined" ? options : cb;
  const resolvedOptions = typeof cb === "undefined" ? undefined : options;

  renderToBuffer(qrData, resolvedOptions, (err, output) => {
    if (err) resolvedCb(err);
    let url = "data:image/png;base64,";
    url += output.toString("base64");
    resolvedCb(null, url);
  });
}

function renderToBuffer(qrData, options, cb) {
  const resolvedCb = typeof cb === "undefined" ? options : cb;
  const resolvedOptions = typeof cb === "undefined" ? undefined : options;

  const png = render(qrData, resolvedOptions);
  const buffer = [];

  png.on("error", resolvedCb);

  png.on("data", (data) => {
    buffer.push(data);
  });

  png.on("end", () => {
    resolvedCb(null, Buffer.concat(buffer));
  });

  png.pack();
}

function renderToFile(path, qrData, options, cb) {
  const resolvedCb = typeof cb === "undefined" ? options : cb;
  const resolvedOptions = typeof cb === "undefined" ? undefined : options;

  let called = false;
  const done = (...args) => {
    if (called) return;
    called = true;
    resolvedCb.apply(null, args);
  };
  const stream = fs.createWriteStream(path);

  stream.on("error", done);
  stream.on("close", done);

  renderToFileStream(stream, qrData, resolvedOptions);
}

function renderToFileStream(stream, qrData, options) {
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
