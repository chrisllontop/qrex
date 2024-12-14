import * as fs from "node:fs";
import type { WriteStream } from "node:fs";
import { PNG } from "pngjs";
import type { QRData, QRexOptions } from "../types/qrex.type";
import { RendererUtils } from "./utils";

export class RendererPng {
  public render(qrData: QRData, options?: QRexOptions): PNG {
    const opts = RendererUtils.getOptions(options);
    const pngOpts = opts.rendererOpts;
    const size = RendererUtils.getImageWidth(qrData.modules.size, opts);

    pngOpts.width = size;
    pngOpts.height = size;

    const pngImage = new PNG(pngOpts);
    RendererUtils.qrToImageData(pngImage.data, qrData, opts);

    return pngImage;
  }

  public async renderToBuffer(qrData: QRData, options?: QRexOptions): Promise<Buffer> {
    const png = this.render(qrData, options);
    const buffer = [];

    png.on("data", (data) => {
      buffer.push(data);
    });

    png.on("end", () => {
      return Buffer.concat(buffer);
    });
    return png.pack();
  }

  public renderToFile(path: string, qrData: QRData, options?: QRexOptions) {
    const stream = fs.createWriteStream(path);
    this.renderToFileStream(stream, qrData, options);
  }

  public renderToFileStream(stream: WriteStream, qrData: QRData, options?: QRexOptions) {
    const png = this.render(qrData, options);
    return png.pack().pipe(stream);
  }

  public async renderToDataURL(qrData: QRData, options?: QRexOptions) {
    const qrBuffer = await this.renderToBuffer(qrData, options);
    console.log("QR BUFFER", qrBuffer.toString("base64"));
    let dataUrl = "data:image/png;base64,";
    dataUrl += qrBuffer.toString("base64");
    return dataUrl;
  }
}
