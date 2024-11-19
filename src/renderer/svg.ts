import type { QRCode } from "qrcode";
import type { ExtendedRendererOptions as RendererOptions, Renderer } from "./utils.js";

import SvgTagRenderer from "./svg-tag.js";
import * as fs from "node:fs";

class SvgRenderer implements Renderer {

  renderToFile(path: string, qrData: QRCode, options: RendererOptions, cb: Function): void {
    const svgTag = this.render(qrData, options, cb);

    const xmlStr =
      `<?xml version="1.0" encoding="utf-8"?><!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">${svgTag}`;

    fs.writeFile(path, xmlStr, () => cb());

  }

  render(qrData: QRCode, options: RendererOptions, cb?: Function): string {
    return SvgTagRenderer.render(qrData, options, cb);
  }

}

export default new SvgRenderer;
