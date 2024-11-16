import { type QRCode } from "qrcode";
import { type ExtendedRendererOptions as RendererOptions, type Renderer } from "./utils";

import SvgTagRenderer from './svg-tag'
import fs from 'fs'

class SvgRenderer implements Renderer {

  renderToFile(path: string, qrData: QRCode, options: RendererOptions, cb: Function): void {
    if (typeof cb === "undefined") {
      cb = options;
      options = undefined;
    }
    const svgTag = this.render(qrData, options);

    const xmlStr =
      `<?xml version="1.0" encoding="utf-8"?><!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">${svgTag}`;

    fs.writeFile(path, xmlStr, cb);
  }

  render(qrData: QRCode, options: RendererOptions, cb?: Function): string {
    return SvgTagRenderer.render(qrData, options, cb);
  }

}

export default new SvgRenderer;
