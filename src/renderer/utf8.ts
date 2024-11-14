import fs from 'fs';
import { getOptions } from "./utils";
import { type QRCodeToDataURLOptionsJpegWebp as RendererOptions, type QRCode } from "qrcode";

const BLOCK_CHAR = {
  WW: " ",
  WB: "▄",
  BB: "█",
  BW: "▀",
};

type BlockCharacters = typeof BLOCK_CHAR;

const INVERTED_BLOCK_CHAR = {
  BB: " ",
  BW: "▄",
  WW: "█",
  WB: "▀",
};

function getBlockChar(top: boolean, bottom: boolean, blocks: BlockCharacters) {
  if (top && bottom) return blocks.BB;
  if (top && !bottom) return blocks.BW;
  if (!top && bottom) return blocks.WB;
  return blocks.WW;
}

export function render(qrData: QRCode, options: RendererOptions, cb: function) {
  const opts = getOptions(options);

  let blocks = BLOCK_CHAR;
  if (opts.color.dark.hex === "#ffffff" || opts.color.light.hex === "#000000") {
    blocks = INVERTED_BLOCK_CHAR;
  }

  const size = qrData.modules.size;
  const data = qrData.modules.data;

  let output = "";
  let hMargin = Array(size + opts.margin * 2 + 1).join(blocks.WW);
  hMargin = Array(opts.margin / 2 + 1).join(`${hMargin}
`);

  const vMargin = Array(opts.margin + 1).join(blocks.WW);

  output += hMargin;
  for (let i = 0; i < size; i += 2) {
    output += vMargin;
    for (let j = 0; j < size; j++) {
      const topModule = data[i * size + j];
      const bottomModule = data[(i + 1) * size + j];

      output += getBlockChar(topModule, bottomModule, blocks);
    }

    output += `${vMargin}
`;
  }

  output += hMargin.slice(0, -1);

  if (typeof cb === "function") {
    cb(null, output);
  }

  return output;
}

export function renderToFile(path: string, qrData: QRCode, options: RendererOptions, cb: function) {
  if (typeof cb === "undefined") {
    cb = options;
    options = undefined;
  }
  const utf8 = render(qrData, options);
  fs.writeFile(path, utf8, cb);
}

export const RendererUtf8 = {
  render,
  renderToFile,
};
