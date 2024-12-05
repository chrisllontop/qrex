import fs from "node:fs";
import { PNG, type PNGOptions } from "pngjs";
import { RendererUtils } from "./utils";
import type { QRData, RenderOptions } from "../types/qrex.type";

export class RendererPng {
  public render = (qrData: QRData, options?: RenderOptions): PNG => {
    const Utils = new RendererUtils();
    const opts = Utils.getOptions(options);
    const pngOpts = opts.rendererOpts as PNGOptions;
    const size = Utils.getImageWidth(qrData.modules.size, opts);

    pngOpts.width = size;
    pngOpts.height = size;

    const pngImage = new PNG(pngOpts);
    Utils.qrToImageData(pngImage.data, qrData, opts);

    return pngImage;
  };

  public renderToDataURL = (
    qrData: QRData,
    options?: RenderOptions,
    cb?: (err: Error | null, data: string | null) => void,
  ): void => {
    if (typeof cb === "undefined") {
      cb = options as unknown as (err: Error | null, data: string | null) => void;
      options = undefined;
    }

    this.renderToBuffer(qrData, options, (err, output) => {
      if (err) return cb!(err, null);

      let url = "data:image/png;base64,";
      url += output.toString("base64");
      cb(null, url);
    });
  };

  public renderToBuffer = (
    qrData: QRData,
    options?: RenderOptions,
    cb?: (err: Error | null, output: Buffer) => void,
  ): void => {
    if (typeof cb === "undefined") {
      cb = options as unknown as (err: Error | null, output: Buffer) => void;
      options = undefined;
    }

    const png = this.render(qrData, options);
    const buffer: Buffer[] = [];

    png.on("error", cb);

    png.on("data", (data) => {
      buffer.push(data);
    });

    png.on("end", () => {
      cb!(null, Buffer.concat(buffer));
    });

    png.pack();
  };

  public renderToFile = (
    path: string,
    qrData: QRData,
    options?: RenderOptions,
    cb?: (err: Error | null) => void,
  ): void => {
    if (typeof cb === "undefined") {
      cb = options as unknown as (err: Error | null) => void;
      options = undefined;
    }

    let called = false;
    const done = (...args: Parameters<NonNullable<typeof cb>>) => {
      if (called) return;
      called = true;
      cb.apply(null, args);
    };
    const stream = fs.createWriteStream(path);

    stream.on("error", done);
    stream.on("close", done);

    this.renderToFileStream(stream, qrData, options);
  };

  public renderToFileStream = (stream: fs.WriteStream, qrData: QRData, options?: RenderOptions) => {
    const png = this.render(qrData, options);
    png.pack().pipe(stream);
  };
}
