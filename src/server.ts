import { QRexBase } from "./qrex.base";
import { RendererPng } from "./renderer/png";
import { RendererSvg } from "./renderer/svg";
import { RendererTerminal } from "./renderer/terminal";
import { RendererUtf8 } from "./renderer/utf8";
import type { RendererType } from "./types/qrex.type";

export class QRex extends QRexBase {
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

  public toString() {
    const renderer = this.getStringRendererFromType(this.opts?.type);
    return this.render(renderer.render);
  }

  public toDataURL() {
    const renderer = this.getRendererFromType(this.opts?.type);
    if ("renderToDataURL" in renderer) {
      return this.render(renderer.renderToDataURL);
    }
    throw new Error("Data URL is not supported for this renderer");
  }

  public toBuffer() {
    const renderer = this.getRendererFromType(this.opts?.type);
    if ("renderToBuffer" in renderer) {
      return this.render(renderer.renderToBuffer);
    }
    throw new Error("Buffer is not supported for this renderer");
  }

  public toFile(path: string) {
    const type = this.opts?.type || this.getTypeFromFilename(path);
    const renderer = this.getRendererFromType(type);
    if ("renderToFile" in renderer) {
      const renderToFile = renderer.renderToFile.bind(null, path);
      return this.render(renderToFile);
    }
    throw new Error("File is not supported for this renderer");
  }

  public toFileStream(stream) {
    const renderer = this.getRendererFromType("png") as RendererPng;
    const renderToFileStream = renderer.renderToFileStream.bind(null, stream);

    this.render(renderToFileStream);
  }
}
