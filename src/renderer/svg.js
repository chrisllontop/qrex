import fs from "node:fs";
import { RendererSvgTag } from "./svg-tag";

const render = RendererSvgTag.render;

function renderToFile(path, qrData, options, cb) {
  const resolvedCb = typeof cb === "undefined" ? options : cb;
  const opts = typeof cb === "undefined" ? undefined : options;

  const svgTag = render(qrData, opts);

  const xmlStr = `<?xml version="1.0" encoding="utf-8"?><!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">${svgTag}`;

  fs.writeFile(path, xmlStr, resolvedCb);
}

export const RendererSvg = {
  render,
  renderToFile,
};
