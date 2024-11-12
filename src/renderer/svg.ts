import fs from "node:fs";
import { RendererSvgTag } from "./svg-tag";

const render = RendererSvgTag.render;

function renderToFile(path, qrData, options, cb) {
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
