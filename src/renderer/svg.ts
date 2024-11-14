import { type QRCodeToDataURLOptionsJpegWebp as RendererOptions, type QRCode } from "qrcode";

import * as svgTagRenderer from './svg-tag'
import fs from 'fs'

const render = RendererSvgTag.render;

export function renderToFile(path: string, qrData: QRCode, options: RendererOptions, cb: function | undefined): void {
  if (typeof cb === "undefined") {
    cb = options;
    options = undefined;
  }
  const svgTag = render(qrData, options);

  const xmlStr = `<?xml version="1.0" encoding="utf-8"?><!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">${svgTag}`;

  fs.writeFile(path, xmlStr, cb);
}

export const RendererSvg = {
  render,
  renderToFile,
};
