import { toCanvas as browserToCanvas } from "./browser";
import { QRex } from "./core/qrex";
import { RendererPng } from "./renderer/png";
import { RendererSvg } from "./renderer/svg";
import { RendererTerminal } from "./renderer/terminal";
import { RendererUtf8 } from "./renderer/utf8";
import type { QRexOptions, QrContent, RendererType } from "./types/qrex.type";

function checkParams(text: QrContent, opts?: QRexOptions) {
  if (typeof text === "undefined") {
    throw new Error("String required as first argument");
  }

  // TODO - Add opts validation

  return {
    opts,
  };
}

function getTypeFromFilename(path: string) {
  return <RendererType>path.slice(((path.lastIndexOf(".") - 1) >>> 0) + 2).toLowerCase();
}

function getRendererFromType(type?: RendererType) {
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

function getStringRendererFromType(type?: RendererType) {
  switch (type) {
    case "svg":
      return RendererSvg;

    case "terminal":
      return RendererTerminal;
    default:
      return RendererUtf8;
  }
}

function render(renderFunc, text: QrContent, params: { opts?: QRexOptions }) {
  const data = QRex.create(text, params.opts);
  return renderFunc(data, params.opts);
}

export const create = QRex.create;

export const toCanvas = browserToCanvas;

export function toString(text: QrContent, opts?: QRexOptions) {
  const params = checkParams(text, opts);
  const type = params?.opts ? params.opts.type : undefined;
  const renderer = getStringRendererFromType(type);
  return render(renderer.render, text, params);
}

export function toDataURL(text: QrContent, opts?: QRexOptions) {
  const params = checkParams(text, opts);
  const renderer = getRendererFromType(params.opts?.type);
  return render(renderer.renderToDataURL, text, params);
}

export function toBuffer(text: QrContent, opts?: QRexOptions) {
  const params = checkParams(text, opts);
  const renderer = getRendererFromType(params.opts?.type);
  return render(renderer.renderToBuffer, text, params);
}

export function toFile(path: string, text: QrContent, opts?: QRexOptions) {
  const params = checkParams(text, opts);
  const type = params.opts?.type || getTypeFromFilename(path);
  const renderer = getRendererFromType(type);
  const renderToFile = renderer.renderToFile.bind(null, path);

  return render(renderToFile, text, params);
}

export function toFileStream(stream, text: QrContent, opts: QRexOptions) {
  if (arguments.length < 2) {
    throw new Error("Too few arguments provided");
  }

  const params = checkParams(text, opts);
  const renderer = getRendererFromType("png"); // Only png support for now
  const renderToFileStream = renderer.renderToFileStream.bind(null, stream);
  render(renderToFileStream, text, params);
}
