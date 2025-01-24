import * as fs from "node:fs";
import type { QRData, QrexOptions, RenderOptions } from "../types/qrex.type";
import { RendererUtils } from "./utils";

type BlockChars = {
  WW: string;
  WB: string;
  BB: string;
  BW: string;
};

export class RendererUtf8 {
  private readonly BLOCK_CHAR: BlockChars = {
    WW: " ",
    WB: "▄",
    BB: "█",
    BW: "▀",
  };

  private readonly INVERTED_BLOCK_CHAR: BlockChars = {
    BB: " ",
    BW: "▄",
    WW: "█",
    WB: "▀",
  };

  private getBlockChar(top: number, bottom: number, blocks: BlockChars): string {
    if (top && bottom) return blocks.BB;
    if (top && !bottom) return blocks.BW;
    if (!top && bottom) return blocks.WB;
    return blocks.WW;
  }

  public render(qrData: QRData, options?: RenderOptions): string {
    const opts = RendererUtils.getOptions(options);
    let blocks: BlockChars = this.BLOCK_CHAR;
    if (opts.color.dark.hex === "#ffffff" || opts.color.light.hex === "#000000") {
      blocks = this.INVERTED_BLOCK_CHAR;
    }

    const size = qrData.modules.size;
    const data = qrData.modules.data;

    let output = "";
    let hMargin = Array(size + opts.margin * 2 + 1).join(blocks.WW);
    hMargin = Array(opts.margin / 2 + 1).join(`${hMargin}\n`);

    const vMargin = Array(opts.margin + 1).join(blocks.WW);

    output += hMargin;
    for (let i = 0; i < size; i += 2) {
      output += vMargin;
      for (let j = 0; j < size; j++) {
        const topModule = data[i * size + j];
        const bottomModule = data[(i + 1) * size + j];

        output += this.getBlockChar(topModule, bottomModule, blocks);
      }

      output += `${vMargin}\n`;
    }

    output += hMargin.slice(0, -1);

    return output;
  }

  public renderToFile(path: string, qrData: QRData, options?: RenderOptions): void {
    const utf8 = this.render(qrData, options);
    fs.writeFileSync(path, utf8);
  }
}
