import canPromise from "./can-promise";
import * as QRCode from "./core/qrcode";
import * as PngRenderer from "./renderer/png";
import * as SvgRenderer from "./renderer/svg";
import * as TerminalRenderer from "./renderer/terminal";
import * as Utf8Renderer from "./renderer/utf8";

function checkParams(text, opts, cb) {
  if (typeof text === "undefined") {
    throw new Error("String required as first argument");
  }

  if (typeof cb === "undefined") {
    cb = opts;
    opts = {};
  }

  if (typeof cb !== "function") {
    if (!canPromise()) {
      throw new Error("Callback required as last argument");
    }
    opts = cb || {};
    cb = null;
  }

  return {
    opts: opts,
    cb: cb,
  };
}

function getTypeFromFilename(path) {
  return path.slice(((path.lastIndexOf(".") - 1) >>> 0) + 2).toLowerCase();
}

function getRendererFromType(type) {
  switch (type) {
    case "svg":
      return SvgRenderer;

    case "txt":
    case "utf8":
      return Utf8Renderer;
    default:
      return PngRenderer;
  }
}

function getStringRendererFromType(type) {
  switch (type) {
    case "svg":
      return SvgRenderer;

    case "terminal":
      return TerminalRenderer;
    default:
      return Utf8Renderer;
  }
}

function render(renderFunc, text, params) {
  if (!params.cb) {
    return new Promise((resolve, reject) => {
      try {
        const data = QRCode.create(text, params.opts);
        return renderFunc(data, params.opts, (err, data) =>
          err ? reject(err) : resolve(data),
        );
      } catch (e) {
        reject(e);
      }
    });
  }

  try {
    const data = QRCode.create(text, params.opts);
    return renderFunc(data, params.opts, params.cb);
  } catch (e) {
    params.cb(e);
  }
}

export const create = QRCode.create;

export const toCanvas = require("./browser").toCanvas;

export function toString(text, opts, cb) {
  const params = checkParams(text, opts, cb);
  const type = params.opts ? params.opts.type : undefined;
  const renderer = getStringRendererFromType(type);
  return render(renderer.render, text, params);
}

export function toDataURL(text, opts, cb) {
  const params = checkParams(text, opts, cb);
  const renderer = getRendererFromType(params.opts.type);
  return render(renderer.renderToDataURL, text, params);
}

export function toBuffer(text, opts, cb) {
  const params = checkParams(text, opts, cb);
  const renderer = getRendererFromType(params.opts.type);
  return render(renderer.renderToBuffer, text, params);
}

export function toFile(path, text, opts, cb) {
  if (
    typeof path !== "string" ||
    !(typeof text === "string" || typeof text === "object")
  ) {
    throw new Error("Invalid argument");
  }

  if (arguments.length < 3 && !canPromise()) {
    throw new Error("Too few arguments provided");
  }

  const params = checkParams(text, opts, cb);
  const type = params.opts.type || getTypeFromFilename(path);
  const renderer = getRendererFromType(type);
  const renderToFile = renderer.renderToFile.bind(null, path);

  return render(renderToFile, text, params);
}

export function toFileStream(stream, text, opts) {
  if (arguments.length < 2) {
    throw new Error("Too few arguments provided");
  }

  const params = checkParams(text, opts, stream.emit.bind(stream, "error"));
  const renderer = getRendererFromType("png"); // Only png support for now
  const renderToFileStream = renderer.renderToFileStream.bind(null, stream);
  render(renderToFileStream, text, params);
}
