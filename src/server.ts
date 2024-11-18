import type { Stream } from "stream";
import type { ExtendedRendererOptions as RendererOptions, Renderer } from "./renderer/utils";

import canPromise from "./can-promise.js";
import * as QRCode from "./core/qrcode.js";
import PngRenderer from "./renderer/png.js";
import Utf8Renderer from "./renderer/utf8.js";
import TerminalRenderer from "./renderer/terminal.js";
import SvgRenderer from "./renderer/svg.js";
import { toCanvas as convertToCanvas } from './browser.js';

export type Parameters = {
  cb: Function;
  opts: RendererOptions;
};

function checkParams(text: string, opts: RendererOptions, cb?: Function): Parameters {
  return {
    opts: opts,
    cb: cb,
  };
}

function getTypeFromFilename(path: string): string {
  return path.slice(((path.lastIndexOf(".") - 1) >>> 0) + 2).toLowerCase();
}

function getRendererFromType(type: string): Renderer {
  switch (type) {
    case "svg":
      return RendererSvg;

    case "txt":
    case "utf8":
      return RendererUtf8;
    default:
      return RendererPng;
  }
}

function getStringRendererFromType(type: string): Renderer {
  switch (type) {
    case "svg":
      return RendererSvg;

    case "terminal":
      return RendererTerminal;
    default:
      return RendererUtf8;
  }
}

function render(renderFunc: Function, text: string, params: Parameters) {
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

export const toCanvas = convertToCanvas;

export function toString(text: string, opts: RendererOptions, cb: Function) {
  const params = checkParams(text, opts, cb);
  const type = params.opts ? params.opts.type : undefined;
  const renderer = getStringRendererFromType(type);
  return render(renderer.render, text, params);
}

export function toDataURL(text: string, opts: RendererOptions, cb: Function) {
  const params = checkParams(text, opts, cb);
  const renderer = getRendererFromType(params.opts.type);
  return render(renderer.renderToDataURL, text, params);
}

export function toBuffer(text: string, opts: RendererOptions, cb: Function) {
  const params = checkParams(text, opts, cb);
  const renderer = getRendererFromType(params.opts.type);
  return render(renderer.renderToBuffer, text, params);
}

export function toFile(path: string, text: string, opts: RendererOptions, cb: Function) {
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

export function toFileStream(stream: Stream, text: string, opts: RendererOptions) {
  if (arguments.length < 2) {
    throw new Error("Too few arguments provided");
  }

  const params = checkParams(text, opts, stream.emit.bind(stream, "error"));
  const renderer = getRendererFromType("png"); // Only png support for now
  const renderToFileStream = renderer.renderToFileStream.bind(null, stream);
  render(renderToFileStream, text, params);
}
