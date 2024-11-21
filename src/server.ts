import { toCanvas as browserToCanvas } from "./browser";
import { QRex as QRexCore } from "./core/qrex";
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
}

function getTypeFromFilename(path: string): RendererType {
  return <RendererType>path.slice(((path.lastIndexOf(".") - 1) >>> 0) + 2).toLowerCase();
}

function render(renderFunc, text: QrContent, opts?: QRexOptions) {
  const data = QRexCore.create(text, opts);
  return renderFunc(data, opts);
}

export class QRex {
  private readonly opts?: QRexOptions;
  private readonly data: QrContent;

  constructor(data: QrContent, opts?: QRexOptions) {
    this.data = data;
    this.opts = opts;
    checkParams(data, opts);
  }

  private getRendererFromType(type?: RendererType) {
    switch (type) {
      case "svg":
        return new RendererSvg();

      case "txt":
      case "utf8":
        return new RendererUtf8();

      default:
        return new RendererPng();
    }
  }

  private getStringRendererFromType(type?: RendererType) {
    switch (type) {
      case "svg":
        return new RendererSvg();

      case "terminal":
        return new RendererTerminal();

      default:
        return new RendererUtf8();
    }
  }

  create() {
    return QRexCore.create(this.data, this.opts);
  }

  toString() {
    const renderer = this.getStringRendererFromType(this.opts?.type);
    return render(renderer.render, this.data, this.opts);
  }

  toDataURL() {
    const renderer = this.getRendererFromType(this.opts?.type);
    if ("renderToDataURL" in renderer) {
      return render(renderer.renderToDataURL, this.data, this.opts);
    }
    throw new Error("Data URL is not supported for this renderer");
  }

  toBuffer() {
    const renderer = this.getRendererFromType(this.opts?.type);
    if ("renderToBuffer" in renderer) {
      return render(renderer.renderToBuffer, this.data, this.opts);
    }
    throw new Error("Buffer is not supported for this renderer");
  }

  toFile(path: string) {
    const type = this.opts?.type || getTypeFromFilename(path);
    const renderer = this.getRendererFromType(type);
    const renderToFile = renderer.renderToFile.bind(null, path);

    return render(renderToFile, this.data, this.opts);
  }

  toFileStream(stream) {
    const renderer = this.getRendererFromType("png") as RendererPng;
    const renderToFileStream = renderer.renderToFileStream.bind(null, stream);

    render(renderToFileStream, this.data, this.opts);
  }

  static toCanvas = browserToCanvas;
}
