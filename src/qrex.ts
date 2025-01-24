import type { WriteStream } from "node:fs";
import { QrexBase } from "./qrex.base";
import { RendererPng } from "./renderer/png";
import { RendererSvg } from "./renderer/svg";
import { RendererTerminal } from "./renderer/terminal";
import { RendererUtf8 } from "./renderer/utf8";
import type { RendererType, RenderOptions } from "./types/qrex.type";

export class Qrex extends QrexBase {
  private getTypeFromFilename(path: string): RendererType {
    return <RendererType>path.slice(((path.lastIndexOf(".") - 1) >>> 0) + 2).toLowerCase();
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

  public toString(renderOptions?: RenderOptions) {
    const renderer = this.getStringRendererFromType(this.opts?.type);
    return this.render(renderer.render.bind(renderer), renderOptions);
  }

  public toDataURL(renderOptions?: RenderOptions) {
    const renderer = this.getRendererFromType(this.opts?.type);
    if ("renderToDataURL" in renderer) {
      return this.render(renderer.renderToDataURL.bind(renderer), renderOptions);
    }
    throw new Error("Data URL is not supported for this renderer");
  }

  public toBuffer(renderOptions?: RenderOptions) {
    const renderer = this.getRendererFromType(this.opts?.type);
    if ("renderToBuffer" in renderer) {
      return this.render(renderer.renderToBuffer.bind(renderer), renderOptions);
    }
    throw new Error("Buffer is not supported for this renderer");
  }

  public toFile(path: string, renderOptions?: RenderOptions) {
    const type = this.opts?.type || this.getTypeFromFilename(path);
    const renderer = this.getRendererFromType(type);
    if ("renderToFile" in renderer) {
      const renderToFile = renderer.renderToFile.bind(renderer, path);
      return this.render(renderToFile, renderOptions);
    }
    throw new Error("File is not supported for this renderer");
  }

  public toFileStream(stream: WriteStream, renderOptions?: RenderOptions) {
    const renderer = this.getRendererFromType("png") as RendererPng;
    const renderToFileStream = renderer.renderToFileStream.bind(renderer, stream);

    return this.render(renderToFileStream, renderOptions);
  }
}
