import * as fs from "node:fs";
import type { WriteStream } from "node:fs";
import { PNG } from "pngjs";
import type { QRData, RenderOptions } from "../types/qrex.type.js";
import { RendererUtils } from "./utils.js";

export class RendererPng {
  public render(qrData: QRData, options?: RenderOptions): PNG {
    const opts = RendererUtils.getOptions(options);
    const pngOpts = opts.renderConfig;
    const size = RendererUtils.getImageWidth(qrData.modules.size, opts);

    pngOpts.width = size;
    pngOpts.height = size;

    const pngImage = new PNG(pngOpts);

    RendererUtils.qrToImageData(pngImage.data, qrData, opts);

    return pngImage;
  }

  public async renderToBuffer(qrData: QRData, options?: RenderOptions): Promise<Buffer> {
    const png = this.render(qrData, options);
    const chunks: Buffer[] = [];

    return new Promise<Buffer>((resolve, reject) => {
      png.on("data", (chunk) => {
        chunks.push(chunk);
      });

      png.on("end", () => {
        resolve(Buffer.concat(chunks));
      });

      png.on("error", (err) => {
        reject(err);
      });

      png.pack();
    });
  }

  public renderToFile(path: string, qrData: QRData, options?: RenderOptions) {
    const stream = fs.createWriteStream(path);
    this.renderToFileStream(stream, qrData, options);
  }

  public renderToFileStream(stream: WriteStream, qrData: QRData, options?: RenderOptions) {
    const png = this.render(qrData, options);
    png.pack().pipe(stream);
  }

  public async renderToDataURL(qrData: QRData, options?: RenderOptions) {
    const qrBuffer = await this.renderToBuffer(qrData, options);
    let dataUrl = "data:image/png;base64,";
    dataUrl += qrBuffer.toString("base64");
    return dataUrl;
  }
}
