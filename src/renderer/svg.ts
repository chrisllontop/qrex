import type { Callback, QRData, RenderOptions } from "../types/qrex.type";
import { RendererSvgTag } from "./svg-tag";
import fs from "node:fs";

export class RendererSvg {
  private renderSvgTag = new RendererSvgTag();
  public render = this.renderSvgTag.render;

  public renderToFile = (path: string, qrData: QRData, options?: RenderOptions | Callback, cb?: Callback) => {
    if (typeof cb === "undefined" || typeof options === "function") {
      cb = options as Callback;
      options = undefined;
    }
    const svgTag = this.render(qrData, options as RenderOptions, cb);

    const xmlStr = `<?xml version="1.0" encoding="utf-8"?><!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">${svgTag}`;

    fs.writeFile(path, xmlStr, cb);
  };
}
