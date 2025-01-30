import * as fs from "node:fs";
import type { QRData, RenderOptions } from "../types/qrex.type.js";
import { RendererSvgTag } from "./svg-tag.js";

export class RendererSvg {
  private rendererSvgTag = new RendererSvgTag();

  public render(qrData: QRData, options?: RenderOptions): string {
    return this.rendererSvgTag.render(qrData, options);
  }

  public renderToFile(path: string, qrData: QRData, options?: RenderOptions): void {
    const svgTag = this.render(qrData, options);

    const xmlStr = `<?xml version="1.0" encoding="utf-8"?><!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">${svgTag}`;

    fs.writeFileSync(path, xmlStr);
  }
}
